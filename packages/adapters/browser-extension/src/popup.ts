/**
 * AgentPing Browser Extension - Popup UI
 *
 * Shows connection state, active lease info, and lease approval.
 * Lease approval here uses the same daemon store as the web-ui dashboard:
 * first response (from either popup or dashboard) wins.
 */

// DOM elements
const dot = document.getElementById('dot')!;
const statusEl = document.getElementById('status')!;
const leaseSection = document.getElementById('lease-section')!;
const leaseScopesEl = document.getElementById('lease-scopes')!;
const leaseCountdownEl = document.getElementById('lease-countdown')!;
const leaseProgressEl = document.getElementById('lease-progress')!;
const pendingSection = document.getElementById('pending-section')!;
const pendingAgentEl = document.getElementById('pending-agent')!;
const pendingScopeEl = document.getElementById('pending-scope')!;
const pendingTtlEl = document.getElementById('pending-ttl')!;
const pendingAgentIdEl = document.getElementById('pending-agent-id')!;
const pendingReasonEl = document.getElementById('pending-reason')!;
const btnApprove = document.getElementById('btn-approve')!;
const btnDeny = document.getElementById('btn-deny')!;
const btnDisconnect = document.getElementById('btn-disconnect')! as HTMLButtonElement;
const emptyState = document.getElementById('empty-state')!;

// State
let countdownInterval: ReturnType<typeof setInterval> | null = null;

const dotClass: Record<string, string> = {
  disconnected: 'dot-gray',
  connecting: 'dot-amber',
  connected: 'dot-green',
  leased: 'dot-cyan',
};

const statusText: Record<string, string> = {
  disconnected: 'Not connected',
  connecting: 'Connecting...',
  connected: 'Idle',
  leased: 'Active lease',
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startCountdown(expiresAt: number, totalMs: number) {
  if (countdownInterval) clearInterval(countdownInterval);

  const update = () => {
    const remaining = Math.max(0, expiresAt - Date.now());
    leaseCountdownEl.textContent = formatRemaining(remaining);
    leaseCountdownEl.className = remaining < 60000
      ? 'countdown-value warning'
      : 'countdown-value';

    const pct = totalMs > 0 ? (remaining / totalMs) * 100 : 0;
    leaseProgressEl.style.width = `${Math.max(0, pct)}%`;

    if (remaining <= 0 && countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  update();
  countdownInterval = setInterval(update, 1000);
}

interface PendingLease {
  requestId: string;
  scopes?: string[];
  scope?: string;
  agentName?: string;
  agentId?: string;
  ttl?: string;
  reason?: string;
  tabId?: number;
}

function render(connState: string, lease: any, pendingLease: PendingLease | null) {
  // Connection indicator
  dot.className = `dot ${dotClass[connState] || 'dot-gray'}`;
  statusEl.textContent = statusText[connState] || connState;

  // Active lease
  if (lease && connState === 'leased') {
    leaseSection.classList.add('active');
    leaseScopesEl.textContent = (lease.scopes || []).join(', ') || lease.scope || '--';

    if (lease.expiresAt) {
      const totalMs = lease.ttlMs || (lease.expiresAt - Date.now());
      startCountdown(lease.expiresAt, totalMs);
    }

    btnDisconnect.style.display = 'block';
  } else {
    leaseSection.classList.remove('active');
    btnDisconnect.style.display = connState === 'connected' ? 'block' : 'none';
  }

  // Pending lease request
  if (pendingLease) {
    pendingSection.classList.add('pending');
    pendingAgentEl.textContent = pendingLease.agentName || '--';
    pendingScopeEl.textContent =
      (pendingLease.scopes || []).join(', ') || pendingLease.scope || '--';
    pendingTtlEl.textContent = pendingLease.ttl || '--';
    pendingAgentIdEl.textContent = pendingLease.agentId || '--';
    pendingReasonEl.textContent = pendingLease.reason || 'No reason provided';
    emptyState.style.display = 'none';
  } else {
    pendingSection.classList.remove('pending');
    if (connState === 'connected' && !lease) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }
  }
}

// Fetch state from background service worker
chrome.runtime.sendMessage({ type: 'getState' }, (resp) => {
  if (resp) {
    chrome.storage.local.get('pendingLease', (data) => {
      render(resp.state, resp.lease, data.pendingLease || null);
    });
  }
});

// Approve button - first-one-wins via shared daemon store
btnApprove.addEventListener('click', () => {
  chrome.storage.local.get('pendingLease', (data) => {
    if (data.pendingLease) {
      chrome.runtime.sendMessage({
        type: 'approveLease',
        requestId: data.pendingLease.requestId,
      });
      chrome.storage.local.remove('pendingLease');
      pendingSection.classList.remove('pending');
      statusEl.textContent = 'Lease granted';
    }
  });
});

// Deny button
btnDeny.addEventListener('click', () => {
  chrome.storage.local.get('pendingLease', (data) => {
    if (data.pendingLease) {
      chrome.runtime.sendMessage({
        type: 'denyLease',
        requestId: data.pendingLease.requestId,
      });
      chrome.storage.local.remove('pendingLease');
      pendingSection.classList.remove('pending');
      statusEl.textContent = 'Lease denied';
    }
  });
});

// Disconnect
btnDisconnect.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'disconnect' });
  if (countdownInterval) clearInterval(countdownInterval);
  render('disconnected', null, null);
});

// Listen for storage changes (e.g. pending lease arrives while popup is open)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.pendingLease) {
    chrome.runtime.sendMessage({ type: 'getState' }, (resp) => {
      if (resp) {
        render(resp.state, resp.lease, changes.pendingLease.newValue || null);
      }
    });
  }
});
