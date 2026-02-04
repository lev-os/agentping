/**
 * Browser CDP Adapter
 *
 * WebSocket handler for browser extension connections.
 * Receives CDP commands from PingService/agents, forwards to extension,
 * returns results. Manages lease lifecycle.
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { IEventBus } from '@agentping/core';
import { LeaseManager, type Lease } from './lease-manager.js';

// ============================================================================
// Types
// ============================================================================

export interface NotificationConfig {
  style: 'modal' | 'drawer' | 'toast';
  position: 'left' | 'right' | 'center';
  maxStack: number;
  soundEnabled: boolean;
  soundVolume: number;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
}

export interface ExtensionConfig {
  notification?: NotificationConfig;
  theme?: ThemeConfig;
}

export interface BrowserCDPAdapterConfig {
  eventBus: IEventBus;
  leaseManager: LeaseManager;
  extensionConfig?: ExtensionConfig;
}

interface PendingRequest {
  resolve: (result: unknown) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

// ============================================================================
// Browser CDP Adapter
// ============================================================================

export class BrowserCDPAdapter {
  private wss: WebSocketServer | null = null;
  private extension: WebSocket | null = null;
  private extensionCapabilities: string[] = [];
  private pending = new Map<string, PendingRequest>();
  private eventBus: IEventBus;
  private leaseManager: LeaseManager;
  private extensionConfig: ExtensionConfig;

  constructor(config: BrowserCDPAdapterConfig) {
    this.eventBus = config.eventBus;
    this.leaseManager = config.leaseManager;
    this.extensionConfig = config.extensionConfig || {
      notification: {
        style: 'drawer',
        position: 'right',
        maxStack: 5,
        soundEnabled: true,
        soundVolume: 0.15,
      },
      theme: {
        mode: 'system',
      },
    };
  }

  /**
   * Update the extension configuration and push to connected extension
   */
  updateConfig(config: Partial<ExtensionConfig>): void {
    if (config.notification) {
      this.extensionConfig.notification = { ...this.extensionConfig.notification, ...config.notification };
    }
    if (config.theme) {
      this.extensionConfig.theme = { ...this.extensionConfig.theme, ...config.theme };
    }

    // Push update to extension
    this.sendConfigToExtension();
  }

  private sendConfigToExtension(): void {
    this.sendToExtension({
      type: 'config:update',
      config: this.extensionConfig,
    });
  }

  /**
   * Attach to an HTTP server at /browser-cdp
   */
  attach(server: any, path = '/browser-cdp'): void {
    this.wss = new WebSocketServer({ noServer: true });

    server.on('upgrade', (req: any, socket: any, head: any) => {
      const url = new URL(req.url || '/', `http://${req.headers.host}`);
      if (url.pathname === path) {
        this.wss!.handleUpgrade(req, socket, head, (ws) => {
          this.wss!.emit('connection', ws, req);
        });
      }
    });

    this.wss.on('connection', (ws: WebSocket) => {
      // Only one extension connection at a time
      if (this.extension) {
        ws.close(4001, 'Extension already connected');
        return;
      }

      this.extension = ws;
      console.log('[BrowserCDP] Extension connected');

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          this.handleExtensionMessage(msg);
        } catch (err) {
          console.error('[BrowserCDP] Failed to parse message:', err);
        }
      });

      ws.on('close', () => {
        console.log('[BrowserCDP] Extension disconnected');
        this.extension = null;
        this.extensionCapabilities = [];
        // Reject all pending requests
        for (const [id, req] of this.pending) {
          clearTimeout(req.timer);
          req.reject(new Error('Extension disconnected'));
        }
        this.pending.clear();
      });

      ws.on('error', (err) => {
        console.error('[BrowserCDP] Extension error:', err);
      });
    });
  }

  private handleExtensionMessage(msg: Record<string, unknown>) {
    switch (msg.type) {
      case 'extension:hello': {
        this.extensionCapabilities = (msg.capabilities as string[]) || [];
        console.log('[BrowserCDP] Extension capabilities:', this.extensionCapabilities);
        // Send initial config to extension
        if (this.extensionCapabilities.includes('notification-ui')) {
          this.sendConfigToExtension();
        }
        break;
      }

      case 'config:request': {
        // Extension is requesting current config
        this.sendConfigToExtension();
        break;
      }

      case 'cdp:response': {
        const id = msg.id as string;
        const req = this.pending.get(id);
        if (req) {
          clearTimeout(req.timer);
          this.pending.delete(id);
          if (msg.error) {
            req.reject(new Error((msg.error as any).message));
          } else {
            req.resolve(msg.result);
          }
        }
        break;
      }

      case 'lease:approve': {
        const requestId = msg.requestId as string;
        const lease = this.leaseManager.approvePending(requestId);
        if (lease) {
          this.sendToExtension({ type: 'lease:granted', lease });
          console.log('[BrowserCDP] Lease approved:', lease.token.slice(0, 16) + '...');
        }
        break;
      }

      case 'lease:deny': {
        const requestId = msg.requestId as string;
        this.leaseManager.denyPending(requestId);
        console.log('[BrowserCDP] Lease denied:', requestId);
        break;
      }
    }
  }

  /**
   * Send a CDP command to the browser extension.
   * Returns the result or throws on error/timeout.
   */
  async sendCDPCommand(method: string, params?: Record<string, unknown>, tabId?: number, timeoutMs = 10000): Promise<unknown> {
    if (!this.extension || this.extension.readyState !== WebSocket.OPEN) {
      throw new Error('No browser extension connected');
    }

    const activeLease = this.leaseManager.getActiveLease();
    if (!activeLease) {
      throw new Error('No active lease');
    }

    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, timeoutMs);

      this.pending.set(id, { resolve, reject, timer });
      this.sendToExtension({ type: 'cdp:request', id, method, params, tabId });
    });
  }

  /**
   * Request a lease from the extension user.
   * Returns the requestId for subsequent wait/poll operations.
   */
  async requestLease(
    agentName: string,
    scopes: string[],
    tabId?: number,
    ttl?: string | number,
    reason?: string
  ): Promise<string> {
    if (!this.extension) throw new Error('No browser extension connected');

    const requestId = this.leaseManager.createPendingRequest(scopes, tabId, agentName);
    this.sendToExtension({
      type: 'lease:request',
      requestId,
      agentName,
      scopes,
      tabId,
      ttl: ttl || '5m',
      reason: reason || 'Agent requesting browser access',
    });

    return requestId;
  }

  /**
   * Wait for a lease decision (approval or denial).
   */
  async waitForLeaseDecision(requestId: string, timeoutMs = 30000): Promise<{ approved: boolean; lease?: { token: string; scopes: string[]; expiresAt: number }; reason?: string }> {
    const result = await this.leaseManager.waitForDecision(requestId, timeoutMs);
    return {
      approved: result.approved,
      lease: result.lease ? {
        token: result.lease.token,
        scopes: result.lease.scopes,
        expiresAt: result.lease.expiresAt,
      } : undefined,
      reason: result.reason,
    };
  }

  /**
   * Revoke the current lease.
   */
  revokeLease(): void {
    this.leaseManager.revokeActive();
    this.sendToExtension({ type: 'lease:revoked' });
  }

  isExtensionConnected(): boolean {
    return this.extension?.readyState === WebSocket.OPEN;
  }

  private sendToExtension(data: unknown) {
    if (this.extension?.readyState === WebSocket.OPEN) {
      this.extension.send(JSON.stringify(data));
    }
  }

  close() {
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    this.extension = null;
    for (const [, req] of this.pending) {
      clearTimeout(req.timer);
      req.reject(new Error('Adapter closed'));
    }
    this.pending.clear();
  }
}

export function createBrowserCDPAdapter(config: BrowserCDPAdapterConfig): BrowserCDPAdapter {
  return new BrowserCDPAdapter(config);
}
