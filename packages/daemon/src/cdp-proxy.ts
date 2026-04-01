/**
 * CDP Proxy — Raw Chrome DevTools Protocol WebSocket for Playwright/agent-browser.
 *
 * Exposes a standard CDP endpoint that tools like agent-browser can connect to
 * with `--cdp <port>`. Translates raw CDP WebSocket messages to/from the
 * AgentPing daemon's internal envelope format, with auto-lease on first command.
 *
 * Architecture:
 *   agent-browser --cdp 7891
 *     → Playwright chromium.connectOverCDP("http://localhost:7891")
 *     → This proxy (WebSocket + HTTP discovery endpoints)
 *       → BrowserCDPAdapter.sendCDPCommand()
 *       → Extension chrome.debugger.sendCommand()
 *       → User's live browser
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import type { BrowserCDPAdapter } from './browser-cdp-adapter.js';
import type { LeaseManager } from './lease-manager.js';

// ============================================================================
// Types
// ============================================================================

export interface CDPProxyConfig {
  port: number;
  browserCDPAdapter: BrowserCDPAdapter;
  leaseManager: LeaseManager;
  /** Event bus for receiving CDP events from the extension */
  eventBus?: any;
  /** Agent name for auto-lease requests */
  agentName?: string;
  /** Default scopes for auto-lease */
  defaultScopes?: string[];
}

interface CDPMessage {
  id: number;
  method: string;
  params?: Record<string, unknown>;
  sessionId?: string;
}

// ============================================================================
// CDP Proxy
// ============================================================================

export class CDPProxy {
  private server: ReturnType<typeof createServer> | null = null;
  private wss: WebSocketServer | null = null;
  private client: WebSocket | null = null;
  private port: number;
  private adapter: BrowserCDPAdapter;
  private leaseManager: LeaseManager;
  private agentName: string;
  private defaultScopes: string[];
  private leaseAcquired = false;
  private leaseAcquiring = false;

  constructor(config: CDPProxyConfig) {
    this.port = config.port;
    this.adapter = config.browserCDPAdapter;
    this.leaseManager = config.leaseManager;
    this.agentName = config.agentName ?? 'cdp-proxy';
    this.defaultScopes = config.defaultScopes ?? [
      'browser:navigate',
      'browser:interact',
      'cookies:read',
      'storage:read',
      'Page',
      'Runtime',
      'DOM',
      'Network',
      'Target',
      'Input',
    ];

    // Forward CDP events from extension to connected Playwright client
    if (config.eventBus) {
      config.eventBus.on('cdp:event', (event: { method: string; params: unknown; tabId?: number }) => {
        if (this.client && this.client.readyState === WebSocket.OPEN) {
          // Forward as raw CDP event (no id field = it's an event, not a response)
          this.send(this.client, {
            method: event.method,
            params: event.params,
          });
        }
      });
    }
  }

  /**
   * Start the CDP proxy server.
   */
  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = createServer((req, res) => this.handleHTTP(req, res));
      this.wss = new WebSocketServer({ noServer: true });

      this.server.on('upgrade', (req, socket, head) => {
        this.wss!.handleUpgrade(req, socket, head, (ws) => {
          this.handleConnection(ws);
        });
      });

      this.wss.on('error', (err) => {
        console.error('[CDPProxy] WebSocket server error:', err);
      });

      this.server.listen(this.port, () => {
        // Update port in case OS assigned one (port 0)
        const addr = this.server!.address();
        if (typeof addr === 'object' && addr) {
          this.port = addr.port;
        }
        console.log(`✓ CDP Proxy listening on http://localhost:${this.port}`);
        console.log(`  agent-browser --cdp ${this.port} open <url>`);
        resolve();
      });
    });
  }

  // --------------------------------------------------------------------------
  // HTTP: Playwright browser discovery endpoints
  // --------------------------------------------------------------------------

  private handleHTTP(req: IncomingMessage, res: ServerResponse): void {
    const url = req.url || '/';

    if (url === '/json/version' || url === '/json/version/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        Browser: 'AgentPing/0.2.0',
        'Protocol-Version': '1.3',
        'User-Agent': 'AgentPing CDP Proxy',
        'V8-Version': '0.0.0',
        'WebKit-Version': '0.0.0',
        webSocketDebuggerUrl: `ws://localhost:${this.port}/devtools/browser`,
      }));
      return;
    }

    if (url === '/json/list' || url === '/json' || url === '/json/') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([{
        description: 'AgentPing CDP Proxy — live browser via extension',
        devtoolsFrontendUrl: '',
        id: 'agentping-page-1',
        title: 'AgentPing Browser',
        type: 'page',
        url: 'about:blank',
        webSocketDebuggerUrl: `ws://localhost:${this.port}/devtools/page/agentping-page-1`,
      }]));
      return;
    }

    // Fallback
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  // --------------------------------------------------------------------------
  // WebSocket: raw CDP protocol relay
  // --------------------------------------------------------------------------

  private handleConnection(ws: WebSocket): void {
    // Only one client at a time (like the extension connection)
    if (this.client) {
      ws.close(4001, 'Another client is already connected');
      return;
    }

    this.client = ws;
    console.log('[CDPProxy] Client connected (Playwright/agent-browser)');

    ws.on('message', async (data) => {
      try {
        const msg: CDPMessage = JSON.parse(data.toString());
        await this.handleCDPMessage(ws, msg);
      } catch (err) {
        console.error('[CDPProxy] Failed to handle message:', err);
      }
    });

    ws.on('close', () => {
      console.log('[CDPProxy] Client disconnected');
      this.client = null;
    });

    ws.on('error', (err) => {
      console.error('[CDPProxy] Client error:', err);
    });
  }

  private async handleCDPMessage(ws: WebSocket, msg: CDPMessage): Promise<void> {
    const { id, method, params } = msg;

    // Handle Playwright setup calls locally — no lease needed
    if (this.isLocalMethod(method)) {
      const result = this.handleLocalMethod(method, params);
      this.send(ws, { id, result });
      return;
    }

    // Auto-lease on first real command (after local methods pass through)
    if (!this.leaseAcquired && !this.leaseAcquiring) {
      try {
        await this.acquireLease();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.send(ws, { id, error: { code: -32003, message: `Lease failed: ${message}` } });
        return;
      }
    }

    // Forward to extension via BrowserCDPAdapter
    try {
      const result = await this.adapter.sendCDPCommand(method, params);
      this.send(ws, { id, result: result ?? {} });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // If no active lease, try to acquire one and retry
      if (message.includes('No active lease')) {
        this.leaseAcquired = false;
        try {
          await this.acquireLease();
          const result = await this.adapter.sendCDPCommand(method, params);
          this.send(ws, { id, result: result ?? {} });
          return;
        } catch (retryErr) {
          const retryMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
          this.send(ws, { id, error: { code: -32000, message: retryMsg } });
          return;
        }
      }

      this.send(ws, { id, error: { code: -32000, message } });
    }
  }

  // --------------------------------------------------------------------------
  // Auto-lease
  // --------------------------------------------------------------------------

  private async acquireLease(): Promise<void> {
    if (this.leaseAcquired) return;
    if (this.leaseAcquiring) {
      // Wait for in-flight acquisition
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (!this.leaseAcquiring) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
      return;
    }

    // Check if there's already an active lease
    const existing = this.leaseManager.getActiveLease();
    if (existing) {
      this.leaseAcquired = true;
      return;
    }

    this.leaseAcquiring = true;
    console.log('[CDPProxy] Requesting lease (approve in extension)...');

    try {
      if (!this.adapter.isExtensionConnected()) {
        throw new Error('No browser extension connected. Load the AgentPing extension in Brave.');
      }

      const requestId = await this.adapter.requestLease(
        this.agentName,
        this.defaultScopes,
      );

      const result = await this.adapter.waitForLeaseDecision(requestId, 60_000);

      if (result.approved) {
        this.leaseAcquired = true;
        console.log('[CDPProxy] Lease granted');
      } else {
        throw new Error(result.reason || 'Lease denied');
      }
    } finally {
      this.leaseAcquiring = false;
    }
  }

  // --------------------------------------------------------------------------
  // Local method handling (Playwright setup calls)
  // --------------------------------------------------------------------------

  /**
   * Some CDP methods Playwright calls during connectOverCDP that we handle
   * locally rather than forwarding to the extension.
   */
  private isLocalMethod(method: string): boolean {
    return [
      'Target.setDiscoverTargets',
      'Target.setAutoAttach',
      'Browser.getVersion',
    ].includes(method);
  }

  private handleLocalMethod(method: string, _params?: Record<string, unknown>): unknown {
    switch (method) {
      case 'Target.setDiscoverTargets':
        return {};
      case 'Target.setAutoAttach':
        return {};
      case 'Browser.getVersion':
        return {
          protocolVersion: '1.3',
          product: 'AgentPing/0.2.0',
          revision: '0',
          userAgent: 'AgentPing CDP Proxy',
          jsVersion: '0',
        };
      default:
        return {};
    }
  }

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  private send(ws: WebSocket, data: unknown): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  close(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}
