/**
 * AgentPing Browser Extension - Service Worker
 *
 * WebSocket client to daemon + chrome.debugger CDP bridge.
 * Connects to ws://localhost:7890/browser-cdp, receives CDP commands,
 * executes via chrome.debugger.sendCommand(), returns results.
 */

export default defineBackground(() => {
  // Types
  interface CDPRequest {
    id: string;
    method: string;
    params?: Record<string, unknown>;
    tabId?: number;
  }

  interface LeaseInfo {
    token: string;
    scopes: string[];
    expiresAt: number;
    tabId?: number;
  }

  type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'leased';

  // State
  let ws: WebSocket | null = null;
  let state: ConnectionState = 'disconnected';
  let leases: LeaseInfo[] = [];
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let attachedTabs = new Set<number>();

  const DEFAULT_DAEMON_URL = 'ws://localhost:7890/browser-cdp';
  const DAEMON_URL_STORAGE_KEY = 'agentping_daemon_ws_url';
  const RECONNECT_DELAY_MS = 3000;
  const KEEPALIVE_ALARM = 'agentping-keepalive';
  let daemonUrl = DEFAULT_DAEMON_URL;

  // Icon pulse animation state
  let iconPulseInterval: ReturnType<typeof setInterval> | null = null;

  // Icon Management
  function updateIcon() {
    const iconMap: Record<ConnectionState, string> = {
      disconnected: '/assets/dot-gray.png',
      connecting: '/assets/dot-amber.png',
      connected: '/assets/dot-green.png',
      leased: '/assets/dot-cyan.png',
    };
    chrome.action.setIcon({ path: { '16': iconMap[state] } });
  }

  // Icon pulse animation for attention
  function startIconPulse() {
    if (iconPulseInterval) return; // Already pulsing
    let toggle = false;
    iconPulseInterval = setInterval(() => {
      chrome.action.setIcon({
        path: { '16': toggle ? '/assets/dot-amber.png' : '/assets/dot-cyan.png' }
      });
      toggle = !toggle;
    }, 500);
  }

  function stopIconPulse() {
    if (iconPulseInterval) {
      clearInterval(iconPulseInterval);
      iconPulseInterval = null;
    }
    updateIcon(); // Restore to appropriate state
  }

  function setState(newState: ConnectionState) {
    state = newState;
    updateIcon();
  }

  async function resolveDaemonUrl(): Promise<string> {
    try {
      const stored = await chrome.storage.local.get(DAEMON_URL_STORAGE_KEY);
      const configured = stored[DAEMON_URL_STORAGE_KEY];
      if (typeof configured === 'string' && configured.trim().length > 0) {
        daemonUrl = configured.trim();
      }
    } catch {
      // Keep default URL on storage failures.
    }
    return daemonUrl;
  }

  // WebSocket Connection
  async function connect() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    setState('connecting');
    const targetUrl = await resolveDaemonUrl();
    ws = new WebSocket(targetUrl);

    ws.onopen = () => {
      setState('connected');
      console.log('[AgentPing] Connected to daemon');
      ws!.send(JSON.stringify({
        type: 'extension:hello',
        capabilities: ['cdp', 'tabs', 'notification-ui'],
        version: '0.2.0',
      }));
      // Request current config from daemon
      ws!.send(JSON.stringify({ type: 'config:request' }));
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
      void connect();
    }, RECONNECT_DELAY_MS);
  }

  function send(data: unknown) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // Message Handler
  async function handleMessage(msg: Record<string, unknown>) {
    switch (msg.type) {
      case 'config:update': {
        // Daemon sends config updates (notification style, theme, etc.)
        const config = msg.config as Record<string, unknown>;
        if (config) {
          // Store notification config
          if (config.notification) {
            await chrome.storage.local.set({ notificationConfig: config.notification });
          }
          // Store theme config
          if (config.theme) {
            await chrome.storage.local.set({ agentping_theme_config: config.theme });
          }
          // Broadcast config update to all tabs
          const tabs = await chrome.tabs.query({});
          for (const tab of tabs) {
            if (tab.id && !tab.url?.startsWith('chrome://')) {
              chrome.tabs.sendMessage(tab.id, { type: 'updateConfig', config }).catch(() => {});
            }
          }
        }
        break;
      }

      case 'lease:granted': {
        const grantedLease = msg.lease as LeaseInfo;
        // Ensure expiresAt is set if not already present
        if (!grantedLease.expiresAt && msg.ttl) {
          const ttlMinutes = typeof msg.ttl === 'number' ? msg.ttl : parseInt(String(msg.ttl), 10);
          grantedLease.expiresAt = Date.now() + (ttlMinutes * 60 * 1000);
        }

        // Add to leases array
        leases.push(grantedLease);
        chrome.storage.local.set({ activeLeases: leases });

        setState('leased');
        console.log('[AgentPing] Lease granted, scopes:', grantedLease.scopes);
        break;
      }

      case 'lease:revoked': {
        const revokedToken = msg.token as string | undefined;
        if (revokedToken) {
          leases = leases.filter(l => l.token !== revokedToken);
        } else {
          leases = [];
        }

        if (leases.length === 0) {
          await detachAll();
          setState('connected');
        }

        chrome.storage.local.set({ activeLeases: leases });
        console.log('[AgentPing] Lease revoked');
        break;
      }

      case 'cdp:request': {
        const req = msg as unknown as { type: string } & CDPRequest;

        // Filter out expired leases
        leases = leases.filter(l => l.expiresAt > Date.now());
        chrome.storage.local.set({ activeLeases: leases });

        if (leases.length === 0) {
          send({ type: 'cdp:response', id: req.id, error: { code: -1, message: 'No active lease' } });
          setState('connected');
          return;
        }

        // Use first valid lease (or lease matching tabId if specified)
        const activeLease = req.tabId
          ? leases.find(l => l.tabId === req.tabId) || leases[0]
          : leases[0];

        await executeCDP(req, activeLease);
        break;
      }

      case 'lease:request': {
        const newPending = {
          requestId: msg.requestId,
          scopes: msg.scopes,
          agentName: msg.agentName,
          agentId: msg.agentId,
          ttl: msg.ttl,
          reason: msg.reason,
          tabId: msg.tabId,
        };

        // Append to pending array (not overwrite)
        const existing = await chrome.storage.local.get('pendingLeases');
        const pendingLeases = existing.pendingLeases || [];
        pendingLeases.push(newPending);
        await chrome.storage.local.set({ pendingLeases });

        // Set badge count and color
        chrome.action.setBadgeText({ text: String(pendingLeases.length) });
        chrome.action.setBadgeBackgroundColor({ color: '#ff2a6d' });

        // Start icon pulse animation
        startIconPulse();

        // Broadcast overlay to active tab
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab?.id && !activeTab.url?.startsWith('chrome://')) {
          chrome.tabs.sendMessage(activeTab.id, { type: 'showLeaseOverlay', lease: newPending })
            .catch(() => { /* content script not loaded */ });
        }
        break;
      }

      default:
        console.log('[AgentPing] Unknown message type:', msg.type);
    }
  }

  // CDP Execution
  async function executeCDP(req: CDPRequest, activeLease: LeaseInfo) {
    let tabId = req.tabId ?? activeLease?.tabId;

    // Auto-select active tab if none specified
    if (!tabId) {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      tabId = activeTab?.id;
    }

    if (!tabId) {
      send({ type: 'cdp:response', id: req.id, error: { code: -3, message: 'No target tab' } });
      return;
    }

    try {
      if (!attachedTabs.has(tabId)) {
        await chrome.debugger.attach({ tabId }, '1.3');
        attachedTabs.add(tabId);
      }

      const result = await chrome.debugger.sendCommand({ tabId }, req.method, req.params);
      send({ type: 'cdp:response', id: req.id, result });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      send({ type: 'cdp:response', id: req.id, error: { code: -4, message } });
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

  // Chrome Events
  chrome.debugger.onDetach.addListener((source) => {
    if (source.tabId) attachedTabs.delete(source.tabId);
  });

  // Extension action click - toggle drawer
  chrome.action.onClicked.addListener(async (tab) => {
    if (tab.id && !tab.url?.startsWith('chrome://')) {
      chrome.tabs.sendMessage(tab.id, { type: 'toggleDrawer' }).catch(() => {
        console.warn('[AgentPing] Content script not loaded on this tab');
      });
    }
  });

  // Messages from popup/drawer
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === 'getState') {
      sendResponse({ state, leases });
      return true;
    }

    if (msg.type === 'getDrawerState') {
      // Filter expired leases before returning
      const now = Date.now();
      chrome.storage.local.get(['activeLeases', 'pendingLeases'], (data) => {
        const validLeases = (data.activeLeases || []).filter((l: LeaseInfo) => l.expiresAt > now);
        // Update storage if we filtered any out
        if (validLeases.length !== (data.activeLeases || []).length) {
          leases = validLeases;
          chrome.storage.local.set({ activeLeases: validLeases });
          if (validLeases.length === 0 && state === 'leased') {
            setState('connected');
          }
        }
        sendResponse({
          connectionState: state,
          activeLeases: validLeases,
          pendingLeases: data.pendingLeases || [],
        });
      });
      return true;
    }

    if (msg.type === 'approveLease') {
      send({ type: 'lease:approve', requestId: msg.requestId });

      // Remove from pending array
      chrome.storage.local.get('pendingLeases', (data) => {
        const remaining = (data.pendingLeases || []).filter((p: any) => p.requestId !== msg.requestId);
        chrome.storage.local.set({ pendingLeases: remaining });
        // Update badge
        if (remaining.length === 0) {
          stopIconPulse();
          chrome.action.setBadgeText({ text: '' });
        } else {
          chrome.action.setBadgeText({ text: String(remaining.length) });
        }
      });

      // Hide overlay on ALL tabs
      chrome.tabs.query({}).then((tabs) => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { type: 'hideLeaseOverlay' }).catch(() => {});
          }
        }
      });
      sendResponse({ ok: true });
      return true;
    }

    if (msg.type === 'denyLease') {
      send({ type: 'lease:deny', requestId: msg.requestId });

      // Remove from pending array
      chrome.storage.local.get('pendingLeases', (data) => {
        const remaining = (data.pendingLeases || []).filter((p: any) => p.requestId !== msg.requestId);
        chrome.storage.local.set({ pendingLeases: remaining });
        if (remaining.length === 0) {
          stopIconPulse();
          chrome.action.setBadgeText({ text: '' });
        } else {
          chrome.action.setBadgeText({ text: String(remaining.length) });
        }
      });

      // Hide overlay on ALL tabs
      chrome.tabs.query({}).then((tabs) => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, { type: 'hideLeaseOverlay' }).catch(() => {});
          }
        }
      });
      sendResponse({ ok: true });
      return true;
    }

    if (msg.type === 'revokeLease') {
      const token = msg.token as string;
      leases = leases.filter(l => l.token !== token);
      chrome.storage.local.set({ activeLeases: leases });
      if (leases.length === 0) {
        setState('connected');
      }
      send({ type: 'lease:revoke', token });
      sendResponse({ ok: true });
      return true;
    }

    if (msg.type === 'disconnect') {
      ws?.close();
      sendResponse({ ok: true });
      return true;
    }

    // WebMCP: CDP execution from content script bridge
    if (msg.type === 'webmcp:execute-cdp') {
      (async () => {
        try {
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          const tabId = activeTab?.id;
          if (!tabId) {
            sendResponse({ error: 'No active tab for CDP execution' });
            return;
          }

          if (!attachedTabs.has(tabId)) {
            await chrome.debugger.attach({ tabId }, '1.3');
            attachedTabs.add(tabId);
          }

          const result = await chrome.debugger.sendCommand(
            { tabId },
            msg.method as string,
            (msg.params as Record<string, unknown>) ?? {},
          );
          sendResponse({ result });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          sendResponse({ error: message });
        }
      })();
      return true; // async sendResponse
    }
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') return;
    if (!changes[DAEMON_URL_STORAGE_KEY]) return;

    const next = changes[DAEMON_URL_STORAGE_KEY].newValue;
    if (typeof next !== 'string' || next.trim().length === 0) return;
    if (next.trim() === daemonUrl) return;

    daemonUrl = next.trim();
    ws?.close();
    void connect();
  });

  // MV3 Keep-Alive + lease GC
  chrome.alarms.create(KEEPALIVE_ALARM, { periodInMinutes: 0.4 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === KEEPALIVE_ALARM) {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        void connect();
      }
      // Garbage-collect expired leases every tick
      gcLeases();
    }
  });

  // Garbage-collect expired leases from in-memory + storage
  async function gcLeases() {
    const now = Date.now();
    leases = leases.filter(l => l.expiresAt > now);
    await chrome.storage.local.set({ activeLeases: leases });
    if (leases.length > 0) {
      setState('leased');
    } else {
      if (state === 'leased') setState('connected');
    }
  }

  // Init - restore state from storage, clean stale data
  async function init() {
    const stored = await chrome.storage.local.get(['activeLeases', 'pendingLeases', 'pendingLease']);

    // Migrate old singular key → array
    if (stored.pendingLease && !stored.pendingLeases) {
      await chrome.storage.local.set({ pendingLeases: [stored.pendingLease] });
      await chrome.storage.local.remove('pendingLease');
    } else if (stored.pendingLease) {
      await chrome.storage.local.remove('pendingLease');
    }

    // Restore active leases, filter expired
    if (stored.activeLeases) {
      leases = stored.activeLeases.filter((l: LeaseInfo) => l.expiresAt > Date.now());
    }
    await chrome.storage.local.set({ activeLeases: leases });
    if (leases.length > 0) {
      setState('leased');
    }

    // Restore badge for any pending requests
    const pending = (await chrome.storage.local.get('pendingLeases')).pendingLeases || [];
    if (pending.length > 0) {
      chrome.action.setBadgeText({ text: String(pending.length) });
      chrome.action.setBadgeBackgroundColor({ color: '#ff2a6d' });
      startIconPulse();
    }

    await resolveDaemonUrl();
    void connect();
  }

  void init();
});
