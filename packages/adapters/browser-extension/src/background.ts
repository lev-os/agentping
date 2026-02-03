/**
 * AgentPing Browser Extension - Service Worker
 *
 * WebSocket client to daemon + chrome.debugger CDP bridge.
 * Connects to ws://localhost:7890/browser-cdp, receives CDP commands,
 * executes via chrome.debugger.sendCommand(), returns results.
 */

// ============================================================================
// Types
// ============================================================================

interface CDPRequest {
  id: string;
  method: string;
  params?: Record<string, unknown>;
  tabId?: number;
}

interface CDPResponse {
  id: string;
  result?: unknown;
  error?: { code: number; message: string };
}

interface LeaseInfo {
  token: string;
  scopes: string[];
  expiresAt: number;
  tabId?: number;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'leased';

// ============================================================================
// State
// ============================================================================

let ws: WebSocket | null = null;
let state: ConnectionState = 'disconnected';
let lease: LeaseInfo | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let attachedTabs = new Set<number>();

const DAEMON_URL = 'ws://localhost:7890/browser-cdp';
const RECONNECT_DELAY_MS = 3000;

// ============================================================================
// Icon Management
// ============================================================================

function updateIcon() {
  const iconMap: Record<ConnectionState, string> = {
    disconnected: 'assets/dot-gray.svg',
    connecting: 'assets/dot-amber.svg',
    connected: 'assets/dot-green.svg',
    leased: 'assets/dot-red.svg',
  };
  chrome.action.setIcon({ path: { '16': iconMap[state] } });
}

function setState(newState: ConnectionState) {
  state = newState;
  updateIcon();
}

// ============================================================================
// WebSocket Connection
// ============================================================================

function connect() {
  if (ws && ws.readyState === WebSocket.OPEN) return;

  setState('connecting');
  ws = new WebSocket(DAEMON_URL);

  ws.onopen = () => {
    setState('connected');
    console.log('[AgentPing] Connected to daemon');
    // Announce capabilities
    ws!.send(JSON.stringify({
      type: 'extension:hello',
      capabilities: ['cdp', 'tabs'],
      version: '0.1.0',
    }));
  };

  ws.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data as string);
      await handleMessage(msg);
    } catch (err) {
      console.error('[AgentPing] Failed to handle message:', err);
    }
  };

  ws.onclose = () => {
    setState('disconnected');
    ws = null;
    scheduleReconnect();
  };

  ws.onerror = (err) => {
    console.error('[AgentPing] WebSocket error:', err);
  };
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, RECONNECT_DELAY_MS);
}

function send(data: unknown) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// ============================================================================
// Message Handler
// ============================================================================

async function handleMessage(msg: Record<string, unknown>) {
  switch (msg.type) {
    case 'lease:granted': {
      lease = msg.lease as LeaseInfo;
      setState('leased');
      console.log('[AgentPing] Lease granted, scopes:', lease.scopes);
      break;
    }

    case 'lease:revoked': {
      await detachAll();
      lease = null;
      setState('connected');
      console.log('[AgentPing] Lease revoked');
      break;
    }

    case 'cdp:request': {
      const req = msg as unknown as { type: string } & CDPRequest;
      if (!lease) {
        send({ type: 'cdp:response', id: req.id, error: { code: -1, message: 'No active lease' } });
        return;
      }
      if (lease.expiresAt < Date.now()) {
        send({ type: 'cdp:response', id: req.id, error: { code: -2, message: 'Lease expired' } });
        lease = null;
        setState('connected');
        return;
      }
      await executeCDP(req);
      break;
    }

    case 'lease:request': {
      // Store pending request for popup approval
      chrome.storage.local.set({
        pendingLease: {
          requestId: msg.requestId,
          scopes: msg.scopes,
          agentName: msg.agentName,
          tabId: msg.tabId,
        },
      });
      break;
    }

    default:
      console.log('[AgentPing] Unknown message type:', msg.type);
  }
}

// ============================================================================
// CDP Execution
// ============================================================================

async function executeCDP(req: CDPRequest) {
  const tabId = req.tabId ?? lease?.tabId;
  if (!tabId) {
    send({ type: 'cdp:response', id: req.id, error: { code: -3, message: 'No target tab' } });
    return;
  }

  try {
    // Attach debugger if not already attached
    if (!attachedTabs.has(tabId)) {
      await chrome.debugger.attach({ tabId }, '1.3');
      attachedTabs.add(tabId);
    }

    const result = await chrome.debugger.sendCommand({ tabId }, req.method, req.params);
    send({ type: 'cdp:response', id: req.id, result } satisfies { type: string } & CDPResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    send({ type: 'cdp:response', id: req.id, error: { code: -4, message } } satisfies { type: string } & CDPResponse);
  }
}

async function detachAll() {
  for (const tabId of attachedTabs) {
    try {
      await chrome.debugger.detach({ tabId });
    } catch { /* tab may already be closed */ }
  }
  attachedTabs.clear();
}

// ============================================================================
// Chrome Events
// ============================================================================

chrome.debugger.onDetach.addListener((source) => {
  if (source.tabId) attachedTabs.delete(source.tabId);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'getState') {
    sendResponse({ state, lease, hasPendingLease: false });
    chrome.storage.local.get('pendingLease', (data) => {
      // Re-send with pending lease info if available
    });
    return true;
  }

  if (msg.type === 'approveLease') {
    send({ type: 'lease:approve', requestId: msg.requestId });
    chrome.storage.local.remove('pendingLease');
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'denyLease') {
    send({ type: 'lease:deny', requestId: msg.requestId });
    chrome.storage.local.remove('pendingLease');
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'disconnect') {
    ws?.close();
    sendResponse({ ok: true });
    return true;
  }
});

// ============================================================================
// MV3 Keep-Alive (service workers go idle after ~30s)
// ============================================================================

const KEEPALIVE_ALARM = 'agentping-keepalive';

chrome.alarms.create(KEEPALIVE_ALARM, { periodInMinutes: 0.4 }); // ~24s

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === KEEPALIVE_ALARM) {
    // Reconnect if dropped
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      connect();
    }
  }
});

// ============================================================================
// Init
// ============================================================================

connect();
