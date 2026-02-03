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

export interface BrowserCDPAdapterConfig {
  eventBus: IEventBus;
  leaseManager: LeaseManager;
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

  constructor(config: BrowserCDPAdapterConfig) {
    this.eventBus = config.eventBus;
    this.leaseManager = config.leaseManager;
  }

  /**
   * Attach to an HTTP server at /browser-cdp
   */
  attach(server: any, path = '/browser-cdp'): void {
    this.wss = new WebSocketServer({ server, path });

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
   */
  async requestLease(agentName: string, scopes: string[], tabId?: number): Promise<void> {
    if (!this.extension) throw new Error('No browser extension connected');

    const requestId = this.leaseManager.createPendingRequest(scopes, tabId);
    this.sendToExtension({
      type: 'lease:request',
      requestId,
      agentName,
      scopes,
      tabId,
    });
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
