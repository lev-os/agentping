/**
 * AgentPing Browser Extension - Popup UI
 */

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
    leaseCountdownEl.className = remaining < 60000 ? 'countdown-value warning' : 'countdown-value';
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
}

function render(connState: string, lease: any, pendingLease: PendingLease | null) {
  dot.className = `dot ${dotClass[connState] || 'dot-gray'}`;
  statusEl.textContent = statusText[connState] || connState;

  if (lease && connState === 'leased') {
    leaseSection.classList.add('active');
    leaseScopesEl.textContent = (lease.scopes || []).join(', ') || '--';
    if (lease.expiresAt) {
      const now = Date.now();
      const remaining = lease.expiresAt - now;
      // Calculate total duration from lease grant (fallback to remaining if ttlMs not available)
      const totalMs = lease.ttlMs || remaining;
      startCountdown(lease.expiresAt, totalMs);
    } else {
      // Fallback if no expiresAt - show 00:00
      leaseCountdownEl.textContent = '00:00';
      leaseProgressEl.style.width = '0%';
    }
    btnDisconnect.style.display = 'block';
  } else {
    leaseSection.classList.remove('active');
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    btnDisconnect.style.display = connState === 'connected' ? 'block' : 'none';
  }

  if (pendingLease) {
    pendingSection.classList.add('pending');
    pendingAgentEl.textContent = pendingLease.agentName || '--';
    pendingScopeEl.textContent = (pendingLease.scopes || []).join(', ') || pendingLease.scope || '--';
    pendingTtlEl.textContent = pendingLease.ttl || '--';
    pendingAgentIdEl.textContent = pendingLease.agentId || '--';
    pendingReasonEl.textContent = pendingLease.reason || 'No reason provided';
    emptyState.style.display = 'none';
  } else {
    pendingSection.classList.remove('pending');
    emptyState.style.display = connState === 'connected' && !lease ? 'block' : 'none';
  }
}

chrome.runtime.sendMessage({ type: 'getState' }, (resp) => {
  if (resp) {
    chrome.storage.local.get(['pendingLease', 'activeLease'], (data) => {
      const lease = resp.lease || data.activeLease || null;
      render(resp.state, lease, data.pendingLease || null);
    });
  }
});

btnApprove.addEventListener('click', () => {
  chrome.storage.local.get('pendingLease', (data) => {
    if (data.pendingLease) {
      chrome.runtime.sendMessage({ type: 'approveLease', requestId: data.pendingLease.requestId });
      chrome.storage.local.remove('pendingLease');
      pendingSection.classList.remove('pending');
      statusEl.textContent = '\u2705 Granted';
      setTimeout(() => window.close(), 800);
    }
  });
});

btnDeny.addEventListener('click', () => {
  chrome.storage.local.get('pendingLease', (data) => {
    if (data.pendingLease) {
      chrome.runtime.sendMessage({ type: 'denyLease', requestId: data.pendingLease.requestId });
      chrome.storage.local.remove('pendingLease');
      pendingSection.classList.remove('pending');
      statusEl.textContent = 'Lease denied';
    }
  });
});

btnDisconnect.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'disconnect' });
  if (countdownInterval) clearInterval(countdownInterval);
  render('disconnected', null, null);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.pendingLease || changes.activeLease) {
    chrome.runtime.sendMessage({ type: 'getState' }, (resp) => {
      if (resp) {
        const lease = resp.lease || changes.activeLease?.newValue || null;
        const pending = changes.pendingLease?.newValue || null;
        render(resp.state, lease, pending);
      }
    });
  }
});
