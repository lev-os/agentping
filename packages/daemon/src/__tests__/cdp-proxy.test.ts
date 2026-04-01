/**
 * CDP Proxy Tests
 *
 * Tests the WebSocket-based CDP proxy that enables agent-browser --cdp <port>
 * to control a browser through the AgentPing extension.
 */

import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { createServer, type Server } from 'http';
import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { CDPProxy, type CDPProxyConfig } from '../cdp-proxy.js';

// ============================================================================
// Mocks
// ============================================================================

function createMockAdapter() {
  return {
    sendCDPCommand: vi.fn().mockResolvedValue({}),
    isExtensionConnected: vi.fn().mockReturnValue(true),
    requestLease: vi.fn().mockResolvedValue('req-123'),
    waitForLeaseDecision: vi.fn().mockResolvedValue({ approved: true, lease: { token: 'tok-abc', scopes: ['*'], expiresAt: Date.now() + 300_000 } }),
    revokeLease: vi.fn(),
  };
}

function createMockLeaseManager(hasActiveLease = false) {
  const fakeLease = hasActiveLease
    ? { token: 'tok-existing', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() }
    : null;

  return {
    getActiveLease: vi.fn().mockReturnValue(fakeLease),
    createPendingRequest: vi.fn(),
    approvePending: vi.fn(),
    denyPending: vi.fn(),
    waitForDecision: vi.fn(),
    isAllowed: vi.fn().mockReturnValue(true),
    revokeActive: vi.fn(),
    validateToken: vi.fn().mockReturnValue(true),
  };
}

// ============================================================================
// Helpers
// ============================================================================

/** Start a CDPProxy on a random port and return it + its port. */
async function startProxy(overrides: Partial<CDPProxyConfig> = {}) {
  const adapter = createMockAdapter();
  const leaseManager = createMockLeaseManager(overrides.leaseManager ? true : false);
  const eventBus = new EventEmitter();

  const config: CDPProxyConfig = {
    port: 0, // let OS pick
    browserCDPAdapter: adapter as any,
    leaseManager: leaseManager as any,
    eventBus,
    agentName: 'test-agent',
    defaultScopes: ['*'],
    ...overrides,
  };

  const proxy = new CDPProxy(config);

  // CDPProxy.start() binds to config.port. For random port we need to patch.
  // Since CDPProxy creates its own server, we need to get the actual port after listen.
  await proxy.start();

  // Extract actual port from the internal server
  const addr = (proxy as any).server?.address();
  const port = typeof addr === 'object' ? addr.port : config.port;

  return { proxy, port, adapter, leaseManager, eventBus };
}

/** Connect a WebSocket client to the proxy. */
function connectWS(port: number, path = '/devtools/browser'): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${port}${path}`);
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}

/** Send a CDP message and wait for a response with matching id. */
function sendCDP(ws: WebSocket, id: number, method: string, params?: Record<string, unknown>): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Timeout waiting for response to ${method}`)), 5000);

    const handler = (data: WebSocket.Data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === id) {
        ws.off('message', handler);
        clearTimeout(timeout);
        resolve(msg);
      }
    };

    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

/** Fetch JSON from proxy HTTP endpoints. */
async function httpGet(port: number, path: string): Promise<{ status: number; body: any }> {
  const res = await fetch(`http://localhost:${port}${path}`);
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

// ============================================================================
// Tests
// ============================================================================

describe('CDPProxy', () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    for (const fn of cleanups.splice(0)) fn();
  });

  // --------------------------------------------------------------------------
  // 1. HTTP Discovery Endpoints
  // --------------------------------------------------------------------------

  describe('HTTP Discovery Endpoints', () => {
    it('GET /json/version returns browser info with webSocketDebuggerUrl', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const { status, body } = await httpGet(port, '/json/version');
      expect(status).toBe(200);
      expect(body.Browser).toBe('AgentPing/0.2.0');
      expect(body['Protocol-Version']).toBe('1.3');
      expect(body.webSocketDebuggerUrl).toContain(`ws://localhost:${port}`);
    });

    it('GET /json/list returns page targets', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const { status, body } = await httpGet(port, '/json/list');
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body[0].type).toBe('page');
      expect(body[0].id).toBe('agentping-page-1');
      expect(body[0].webSocketDebuggerUrl).toContain(`ws://localhost:${port}`);
    });

    it('GET /json also returns page targets (alias)', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const { status, body } = await httpGet(port, '/json');
      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
    });

    it('GET /unknown returns 404', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const res = await fetch(`http://localhost:${port}/unknown`);
      expect(res.status).toBe(404);
    });
  });

  // --------------------------------------------------------------------------
  // 2. WebSocket Connection
  // --------------------------------------------------------------------------

  describe('WebSocket Connection', () => {
    it('accepts a WebSocket client', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      expect(ws.readyState).toBe(WebSocket.OPEN);
    });

    it('rejects a second client with 4001', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const ws1 = await connectWS(port);
      cleanups.push(() => ws1.close());

      const ws2 = new WebSocket(`ws://localhost:${port}/devtools/browser`);
      const closeCode = await new Promise<number>((resolve) => {
        ws2.on('close', (code) => resolve(code));
      });
      expect(closeCode).toBe(4001);
    });

    it('cleans up state on disconnect', async () => {
      const { proxy, port } = await startProxy();
      cleanups.push(() => proxy.close());

      const ws = await connectWS(port);
      ws.close();

      // Wait for close to propagate
      await new Promise((r) => setTimeout(r, 50));

      // Now a new connection should be accepted
      const ws2 = await connectWS(port);
      cleanups.push(() => ws2.close());
      expect(ws2.readyState).toBe(WebSocket.OPEN);
    });
  });

  // --------------------------------------------------------------------------
  // 3. CDP Command Forwarding
  // --------------------------------------------------------------------------

  describe('CDP Command Forwarding', () => {
    it('forwards commands to adapter and returns result', async () => {
      const { proxy, port, adapter, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });

      adapter.sendCDPCommand.mockResolvedValueOnce({ frameId: 'abc', loaderId: '123' });

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 1, 'Page.navigate', { url: 'https://example.com' });
      expect(resp.id).toBe(1);
      expect(resp.result).toEqual({ frameId: 'abc', loaderId: '123' });
      expect(adapter.sendCDPCommand).toHaveBeenCalledWith('Page.navigate', { url: 'https://example.com' });
    });

    it('returns error when adapter throws', async () => {
      const { proxy, port, adapter, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });

      adapter.sendCDPCommand.mockRejectedValueOnce(new Error('Extension disconnected'));

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 2, 'Page.reload');
      expect(resp.id).toBe(2);
      expect(resp.error.message).toBe('Extension disconnected');
    });
  });

  // --------------------------------------------------------------------------
  // 4. Local Method Handling
  // --------------------------------------------------------------------------

  describe('Local Method Handling', () => {
    it('handles Browser.getVersion locally without calling adapter', async () => {
      const { proxy, port, adapter, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 3, 'Browser.getVersion');
      expect(resp.result.product).toBe('AgentPing/0.2.0');
      expect(resp.result.protocolVersion).toBe('1.3');
      expect(adapter.sendCDPCommand).not.toHaveBeenCalled();
    });

    it('handles Target.setDiscoverTargets locally', async () => {
      const { proxy, port, adapter, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 4, 'Target.setDiscoverTargets', { discover: true });
      expect(resp.id).toBe(4);
      expect(resp.result).toEqual({});
      expect(adapter.sendCDPCommand).not.toHaveBeenCalled();
    });

    it('handles Target.setAutoAttach locally', async () => {
      const { proxy, port, adapter, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 5, 'Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false });
      expect(resp.id).toBe(5);
      expect(resp.result).toEqual({});
      expect(adapter.sendCDPCommand).not.toHaveBeenCalled();
    });

    it('handles local methods without any lease (Playwright setup)', async () => {
      // No active lease, no extension — local methods still work
      const adapter = createMockAdapter();
      adapter.isExtensionConnected.mockReturnValue(false);
      const leaseManager = createMockLeaseManager(false);
      const eventBus = new EventEmitter();

      const proxy = new CDPProxy({
        port: 0,
        browserCDPAdapter: adapter as any,
        leaseManager: leaseManager as any,
        eventBus,
      });
      await proxy.start();
      const addr = (proxy as any).server?.address();
      cleanups.push(() => proxy.close());

      const ws = await connectWS(addr.port);
      cleanups.push(() => ws.close());

      // These should all succeed without lease or extension
      const r1 = await sendCDP(ws, 10, 'Browser.getVersion');
      expect(r1.result.product).toBe('AgentPing/0.2.0');

      const r2 = await sendCDP(ws, 11, 'Target.setDiscoverTargets', { discover: true });
      expect(r2.result).toEqual({});

      const r3 = await sendCDP(ws, 12, 'Target.setAutoAttach', { autoAttach: true });
      expect(r3.result).toEqual({});

      // No lease was ever requested
      expect(adapter.requestLease).not.toHaveBeenCalled();
      expect(adapter.sendCDPCommand).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // 5. Auto-Lease Flow
  // --------------------------------------------------------------------------

  describe('Auto-Lease', () => {
    it('requests lease on first command when none active', async () => {
      const adapter = createMockAdapter();
      const leaseManager = createMockLeaseManager(false); // no active lease
      const eventBus = new EventEmitter();

      // After lease acquisition, getActiveLease should return a lease
      let leaseGranted = false;
      leaseManager.getActiveLease.mockImplementation(() => {
        if (leaseGranted) return { token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() };
        return null;
      });
      adapter.waitForLeaseDecision.mockImplementation(async () => {
        leaseGranted = true;
        return { approved: true, lease: { token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000 } };
      });
      adapter.sendCDPCommand.mockResolvedValue({ title: 'Test Page' });

      const config: CDPProxyConfig = {
        port: 0,
        browserCDPAdapter: adapter as any,
        leaseManager: leaseManager as any,
        eventBus,
        agentName: 'test-agent',
        defaultScopes: ['*'],
      };

      const proxy = new CDPProxy(config);
      await proxy.start();
      const addr = (proxy as any).server?.address();
      const port = addr.port;
      cleanups.push(() => proxy.close());

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 1, 'Runtime.evaluate', { expression: 'document.title' });
      expect(adapter.requestLease).toHaveBeenCalledWith('test-agent', ['*']);
      expect(adapter.waitForLeaseDecision).toHaveBeenCalled();
      expect(resp.result).toEqual({ title: 'Test Page' });
    });

    it('skips lease request when lease already active', async () => {
      const { proxy, port, adapter, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      // Ensure there IS an active lease
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });
      adapter.sendCDPCommand.mockResolvedValue({});

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      await sendCDP(ws, 1, 'Runtime.evaluate', { expression: '1+1' });
      expect(adapter.requestLease).not.toHaveBeenCalled();
    });

    it('propagates lease denial error', async () => {
      const adapter = createMockAdapter();
      const leaseManager = createMockLeaseManager(false);
      const eventBus = new EventEmitter();

      adapter.waitForLeaseDecision.mockResolvedValue({ approved: false, reason: 'User denied access' });

      const config: CDPProxyConfig = {
        port: 0,
        browserCDPAdapter: adapter as any,
        leaseManager: leaseManager as any,
        eventBus,
        agentName: 'test-agent',
        defaultScopes: ['*'],
      };

      const proxy = new CDPProxy(config);
      await proxy.start();
      const addr = (proxy as any).server?.address();
      const port = addr.port;
      cleanups.push(() => proxy.close());

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const resp = await sendCDP(ws, 1, 'Page.navigate', { url: 'https://evil.com' });
      expect(resp.error).toBeDefined();
      expect(resp.error.message).toContain('User denied access');
    });
  });

  // --------------------------------------------------------------------------
  // 6. CDP Event Forwarding
  // --------------------------------------------------------------------------

  describe('CDP Event Forwarding', () => {
    it('forwards eventBus cdp:event to connected WebSocket client', async () => {
      const { proxy, port, eventBus, leaseManager } = await startProxy();
      cleanups.push(() => proxy.close());
      leaseManager.getActiveLease.mockReturnValue({ token: 'tok', scopes: ['*'], expiresAt: Date.now() + 300_000, createdAt: Date.now() });

      const ws = await connectWS(port);
      cleanups.push(() => ws.close());

      const received = new Promise<any>((resolve) => {
        ws.on('message', (data) => {
          const msg = JSON.parse(data.toString());
          if (msg.method === 'Page.loadEventFired') resolve(msg);
        });
      });

      eventBus.emit('cdp:event', { method: 'Page.loadEventFired', params: { timestamp: 12345 } });

      const msg = await received;
      expect(msg.method).toBe('Page.loadEventFired');
      expect(msg.params.timestamp).toBe(12345);
      expect(msg.id).toBeUndefined(); // events have no id
    });

    it('silently skips events when no client connected', async () => {
      const { proxy, eventBus } = await startProxy();
      cleanups.push(() => proxy.close());

      // Should not throw
      expect(() => {
        eventBus.emit('cdp:event', { method: 'Network.requestWillBeSent', params: {} });
      }).not.toThrow();
    });
  });
});
