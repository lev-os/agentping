/**
 * AgentPing Browser Extension - Cinematic Lease Overlay Content Script
 *
 * Renders a full-screen vignette overlay with a neon-styled modal
 * for lease approval requests. Uses Shadow DOM for style isolation.
 */

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',

  main() {
    // Create overlay host element
    const host = document.createElement('agentping-overlay');
    host.style.cssText = 'all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;';
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: 'closed' });

    // Create drawer host element
    const drawerHost = document.createElement('agentping-drawer');
    drawerHost.style.cssText = 'all: initial; position: fixed; inset: 0; z-index: 2147483646; pointer-events: none;';
    document.documentElement.appendChild(drawerHost);

    const drawerShadow = drawerHost.attachShadow({ mode: 'closed' });

    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: radial-gradient(
          ellipse 80% 70% at 50% 50%,
          rgba(5, 5, 5, 0.85) 0%,
          rgba(5, 5, 5, 0.92) 50%,
          rgba(0, 0, 0, 0.98) 100%
        );
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        pointer-events: none;
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
      }

      .overlay.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .overlay.fade-out {
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .modal {
        background: #0a0a0a;
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 12px;
        box-shadow: 0 0 40px rgba(0, 229, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.5);
        padding: 28px 32px;
        max-width: 420px;
        width: 90%;
        transform: scale(0.95) translateY(10px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .overlay.visible .modal {
        transform: scale(1) translateY(0);
      }

      .header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(0, 229, 255, 0.1);
      }

      .icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(0, 229, 255, 0.05) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .title {
        color: #00e5ff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.5);
        font-size: 11px;
        margin-top: 2px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .field {
        margin-bottom: 14px;
      }

      .field-label {
        color: rgba(255, 255, 255, 0.4);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 6px;
      }

      .field-value {
        color: #fff;
        font-size: 14px;
        word-break: break-word;
      }

      .scopes {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .scope-tag {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 12px;
        color: #00e5ff;
      }

      .reason {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        padding: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        line-height: 1.5;
        font-style: italic;
      }

      .buttons {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }

      .btn {
        flex: 1;
        padding: 14px 20px;
        border: none;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-grant {
        background: rgba(0, 255, 157, 0.1);
        border: 1px solid rgba(0, 255, 157, 0.3);
        color: #00ff9d;
        box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
      }

      .btn-grant:hover {
        background: rgba(0, 255, 157, 0.2);
        box-shadow: 0 0 30px rgba(0, 255, 157, 0.2);
      }

      .btn-grant:active {
        transform: scale(0.98);
      }

      .btn-deny {
        background: rgba(255, 42, 109, 0.1);
        border: 1px solid rgba(255, 42, 109, 0.3);
        color: #ff2a6d;
        box-shadow: 0 0 20px rgba(255, 42, 109, 0.1);
      }

      .btn-deny:hover {
        background: rgba(255, 42, 109, 0.2);
        box-shadow: 0 0 30px rgba(255, 42, 109, 0.2);
      }

      .btn-deny:active {
        transform: scale(0.98);
      }

      .hints {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 16px;
        color: rgba(255, 255, 255, 0.3);
        font-size: 11px;
      }

      .hint {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .key {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 500;
      }
    `;
    shadow.appendChild(styles);

    // Create overlay structure
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="header">
          <div class="icon">🤖</div>
          <div>
            <div class="title">Lease Request</div>
            <div class="subtitle">Agent Authorization</div>
          </div>
        </div>
        <div class="field">
          <div class="field-label">Agent</div>
          <div class="field-value agent-name">--</div>
        </div>
        <div class="field">
          <div class="field-label">Scopes</div>
          <div class="scopes scope-list"></div>
        </div>
        <div class="field">
          <div class="field-label">Duration</div>
          <div class="field-value duration">--</div>
        </div>
        <div class="field">
          <div class="field-label">Reason</div>
          <div class="reason reason-text">No reason provided</div>
        </div>
        <div class="buttons">
          <button class="btn btn-grant" data-action="grant">Grant</button>
          <button class="btn btn-deny" data-action="deny">Deny</button>
        </div>
        <div class="hints">
          <span class="hint"><span class="key">G</span> Grant</span>
          <span class="hint"><span class="key">D</span> Deny</span>
          <span class="hint"><span class="key">Esc</span> Dismiss</span>
        </div>
      </div>
    `;
    shadow.appendChild(overlay);

    // Get elements
    const agentNameEl = overlay.querySelector('.agent-name') as HTMLElement;
    const scopeListEl = overlay.querySelector('.scope-list') as HTMLElement;
    const durationEl = overlay.querySelector('.duration') as HTMLElement;
    const reasonEl = overlay.querySelector('.reason-text') as HTMLElement;
    const grantBtn = overlay.querySelector('[data-action="grant"]') as HTMLButtonElement;
    const denyBtn = overlay.querySelector('[data-action="deny"]') as HTMLButtonElement;

    let currentRequestId: string | null = null;

    // Play notification chime
    function playChime() {
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);      // A5
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1); // D6
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch (err) {
        console.warn('[AgentPing] Could not play chime:', err);
      }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(str: string): string {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Show overlay with lease data
    function showOverlay(lease: {
      requestId: string;
      agentName?: string;
      scopes?: string[];
      ttl?: string | number;
      reason?: string;
    }) {
      // Play notification sound
      playChime();

      currentRequestId = lease.requestId;

      agentNameEl.textContent = lease.agentName || 'Unknown Agent';

      // Render scopes
      const scopes = lease.scopes || [];
      scopeListEl.innerHTML = scopes.length > 0
        ? scopes.map(s => `<span class="scope-tag">${escapeHtml(s)}</span>`).join('')
        : '<span class="scope-tag">default</span>';

      // Duration
      const ttl = lease.ttl;
      if (typeof ttl === 'number') {
        durationEl.textContent = `${ttl} minute${ttl !== 1 ? 's' : ''}`;
      } else if (typeof ttl === 'string') {
        durationEl.textContent = escapeHtml(ttl);
      } else {
        durationEl.textContent = '--';
      }

      // Reason
      reasonEl.textContent = lease.reason || 'No reason provided';

      overlay.classList.remove('fade-out');
      overlay.classList.add('visible');
    }

    // Hide overlay with optional fade
    function hideOverlay(fade = false) {
      if (fade) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.classList.remove('visible', 'fade-out');
          currentRequestId = null;
        }, 400);
      } else {
        overlay.classList.remove('visible');
        currentRequestId = null;
      }
    }

    // Grant action
    function grant() {
      if (!currentRequestId) return;
      chrome.runtime.sendMessage({ type: 'approveLease', requestId: currentRequestId });
      hideOverlay(true);
    }

    // Deny action
    function deny() {
      if (!currentRequestId) return;
      chrome.runtime.sendMessage({ type: 'denyLease', requestId: currentRequestId });
      hideOverlay(false);
    }

    // Button handlers
    grantBtn.addEventListener('click', grant);
    denyBtn.addEventListener('click', deny);

    // Keyboard shortcuts (overlay + drawer)
    document.addEventListener('keydown', (e) => {
      // Overlay shortcuts
      if (overlay.classList.contains('visible')) {
        if (e.key.toLowerCase() === 'g') {
          e.preventDefault();
          grant();
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          deny();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          hideOverlay(false);
        }
        return;
      }
      // Drawer shortcuts
      if (drawerVisible && e.key === 'Escape') {
        e.preventDefault();
        hideDrawer();
      }
    });

    // ==================== DRAWER COMPONENT ====================

    // Drawer styles
    const drawerStyles = document.createElement('style');
    drawerStyles.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        pointer-events: none;
      }

      .drawer-backdrop.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .drawer {
        position: fixed;
        right: 0;
        top: 0;
        height: 100vh;
        width: 320px;
        background: #0a0a0a;
        border-left: 1px solid rgba(0, 229, 255, 0.15);
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .drawer-backdrop.visible .drawer {
        transform: translateX(0);
      }

      .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 229, 255, 0.1);
      }

      .drawer-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 700;
        color: #fafafa;
      }

      .drawer-icon {
        color: #00e5ff;
        font-size: 16px;
      }

      .close-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.5);
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }

      .status-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: rgba(0, 229, 255, 0.03);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        font-size: 12px;
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .status-dot.gray { background: #555; }
      .status-dot.amber { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
      .status-dot.green { background: #00ff9d; box-shadow: 0 0 8px rgba(0, 255, 157, 0.5); }
      .status-dot.cyan { background: #00e5ff; box-shadow: 0 0 8px rgba(0, 229, 255, 0.5); }

      .status-text {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }

      .drawer-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
      }

      .section {
        margin-bottom: 24px;
      }

      .section-header {
        color: rgba(255, 255, 255, 0.4);
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 12px;
      }

      .lease-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(0, 255, 157, 0.2);
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 10px;
      }

      .request-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(0, 229, 255, 0.3);
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 10px;
      }

      .card-field {
        margin-bottom: 8px;
      }

      .card-label {
        font-size: 9px;
        font-weight: 600;
        color: #555;
        text-transform: uppercase;
        margin-bottom: 4px;
      }

      .card-value {
        font-size: 12px;
        color: #e0e0e0;
      }

      .card-value.agent {
        color: #fafafa;
        font-weight: 600;
      }

      .card-value.countdown {
        font-size: 18px;
        font-weight: 700;
        color: #00ff9d;
        text-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
      }

      .card-value.countdown.warning {
        color: #ff2a6d;
      }

      .scope-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      .scope-tag {
        background: rgba(0, 229, 255, 0.1);
        border: 1px solid rgba(0, 229, 255, 0.2);
        border-radius: 4px;
        padding: 4px 10px;
        font-size: 11px;
        color: #00e5ff;
      }

      .card-buttons {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .card-btn {
        flex: 1;
        padding: 8px 12px;
        border: none;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.2s ease;
      }

      .card-btn.grant {
        background: rgba(0, 255, 157, 0.15);
        color: #00ff9d;
        border: 1px solid rgba(0, 255, 157, 0.3);
      }

      .card-btn.grant:hover {
        background: rgba(0, 255, 157, 0.25);
      }

      .card-btn.deny {
        background: rgba(255, 42, 109, 0.15);
        color: #ff2a6d;
        border: 1px solid rgba(255, 42, 109, 0.3);
      }

      .card-btn.deny:hover {
        background: rgba(255, 42, 109, 0.25);
      }

      .card-btn.revoke {
        background: rgba(255, 255, 255, 0.05);
        color: #71717a;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .card-btn.revoke:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #e0e0e0;
      }

      .empty-state {
        text-align: center;
        color: #555;
        padding: 24px 0;
        font-size: 11px;
      }

      .empty-icon {
        font-size: 32px;
        margin-bottom: 8px;
        opacity: 0.3;
      }

      .drawer-footer {
        padding: 16px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #00e5ff;
        text-decoration: none;
        font-size: 12px;
        margin-bottom: 8px;
        transition: color 0.2s ease;
      }

      .footer-link:hover {
        color: #00ff9d;
      }

      .version {
        color: #555;
        font-size: 10px;
        text-align: center;
      }
    `;
    drawerShadow.appendChild(drawerStyles);

    // Drawer HTML
    const drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'drawer-backdrop';
    drawerBackdrop.innerHTML = `
      <div class="drawer">
        <div class="drawer-header">
          <div class="drawer-title">
            <span class="drawer-icon">⚡</span>
            <span>AgentPing</span>
          </div>
          <button class="close-btn" data-action="close">×</button>
        </div>
        <div class="status-bar">
          <div class="status-dot gray" data-status-dot></div>
          <div class="status-text" data-status-text>Checking...</div>
        </div>
        <div class="drawer-content">
          <div class="section">
            <div class="section-header">Active Leases</div>
            <div data-leases-container></div>
          </div>
          <div class="section">
            <div class="section-header">Pending Requests</div>
            <div data-requests-container></div>
          </div>
        </div>
        <div class="drawer-footer">
          <a href="http://localhost:7890" target="_blank" class="footer-link">
            🔗 Dashboard
          </a>
          <div class="version">v0.1.0</div>
        </div>
      </div>
    `;
    drawerShadow.appendChild(drawerBackdrop);

    // Drawer elements
    const drawer = drawerBackdrop.querySelector('.drawer') as HTMLElement;
    const closeBtn = drawerBackdrop.querySelector('[data-action="close"]') as HTMLButtonElement;
    const statusDot = drawerBackdrop.querySelector('[data-status-dot]') as HTMLElement;
    const statusText = drawerBackdrop.querySelector('[data-status-text]') as HTMLElement;
    const leasesContainer = drawerBackdrop.querySelector('[data-leases-container]') as HTMLElement;
    const requestsContainer = drawerBackdrop.querySelector('[data-requests-container]') as HTMLElement;

    // Prevent clicks inside drawer from closing it
    drawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Close drawer when backdrop is clicked
    drawerBackdrop.addEventListener('click', () => {
      hideDrawer();
    });

    closeBtn.addEventListener('click', () => {
      hideDrawer();
    });

    let drawerVisible = false;
    let countdownIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
    let drawerRefreshInterval: ReturnType<typeof setInterval> | null = null;

    function showDrawer() {
      drawerVisible = true;
      drawerBackdrop.classList.add('visible');
      updateDrawerContent();
      // Periodic refresh while drawer is open (catches new pending, expired leases)
      if (!drawerRefreshInterval) {
        drawerRefreshInterval = setInterval(updateDrawerContent, 2000);
      }
    }

    function hideDrawer() {
      drawerVisible = false;
      drawerBackdrop.classList.remove('visible');
      // Clear all countdown intervals
      countdownIntervals.forEach(interval => clearInterval(interval));
      countdownIntervals.clear();
      if (drawerRefreshInterval) {
        clearInterval(drawerRefreshInterval);
        drawerRefreshInterval = null;
      }
    }

    function toggleDrawer() {
      if (drawerVisible) {
        hideDrawer();
      } else {
        showDrawer();
      }
    }

    function formatRemaining(ms: number): string {
      if (ms <= 0) return '00:00';
      const totalSec = Math.floor(ms / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function escapeHtmlDrawer(str: string): string {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    async function updateDrawerContent() {
      chrome.runtime.sendMessage({ type: 'getDrawerState' }, (response) => {
        if (!response) return;

        const { connectionState, activeLeases, pendingLeases } = response;

        // Update status
        const statusClasses: Record<string, string> = {
          disconnected: 'gray',
          connecting: 'amber',
          connected: 'green',
          leased: 'cyan',
        };

        const statusTexts: Record<string, string> = {
          disconnected: 'Not connected',
          connecting: 'Connecting...',
          connected: 'Connected',
          leased: 'Active lease',
        };

        statusDot.className = `status-dot ${statusClasses[connectionState] || 'gray'}`;
        statusText.textContent = statusTexts[connectionState] || connectionState;

        // Render active leases
        if (activeLeases && activeLeases.length > 0) {
          leasesContainer.innerHTML = activeLeases.map((lease: any) => {
            const scopes = (lease.scopes || []).map((s: string) =>
              `<span class="scope-tag">${escapeHtmlDrawer(s)}</span>`
            ).join('');

            return `
              <div class="lease-card" data-lease-token="${lease.token}">
                <div class="card-field">
                  <div class="card-label">Scopes</div>
                  <div class="scope-tags">${scopes || '<span class="scope-tag">default</span>'}</div>
                </div>
                <div class="card-field">
                  <div class="card-label">Remaining</div>
                  <div class="card-value countdown" data-countdown="${lease.token}">--</div>
                </div>
                <div class="card-buttons">
                  <button class="card-btn revoke" data-action="revoke" data-token="${lease.token}">Revoke</button>
                </div>
              </div>
            `;
          }).join('');

          // Start countdowns for each lease
          activeLeases.forEach((lease: any) => {
            const countdownEl = leasesContainer.querySelector(`[data-countdown="${lease.token}"]`) as HTMLElement;
            if (countdownEl && lease.expiresAt) {
              const startCountdown = () => {
                const remaining = Math.max(0, lease.expiresAt - Date.now());
                countdownEl.textContent = formatRemaining(remaining);
                countdownEl.className = remaining < 60000 ? 'card-value countdown warning' : 'card-value countdown';
                if (remaining <= 0) {
                  const interval = countdownIntervals.get(lease.token);
                  if (interval) {
                    clearInterval(interval);
                    countdownIntervals.delete(lease.token);
                  }
                  updateDrawerContent(); // Refresh to remove expired lease
                }
              };
              startCountdown();
              const interval = setInterval(startCountdown, 1000);
              countdownIntervals.set(lease.token, interval);
            }
          });

          // Add revoke button listeners
          leasesContainer.querySelectorAll('[data-action="revoke"]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const token = (btn as HTMLElement).dataset.token;
              if (token) {
                chrome.runtime.sendMessage({ type: 'revokeLease', token });
                updateDrawerContent();
              }
            });
          });
        } else {
          leasesContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">💤</div>No active leases</div>';
        }

        // Render pending requests
        if (pendingLeases && pendingLeases.length > 0) {
          requestsContainer.innerHTML = pendingLeases.map((req: any) => {
            const scopes = (req.scopes || []).map((s: string) =>
              `<span class="scope-tag">${escapeHtmlDrawer(s)}</span>`
            ).join('');

            return `
              <div class="request-card" data-request-id="${req.requestId}">
                <div class="card-field">
                  <div class="card-label">Agent</div>
                  <div class="card-value agent">${escapeHtmlDrawer(req.agentName || 'Unknown Agent')}</div>
                </div>
                <div class="card-field">
                  <div class="card-label">Scopes</div>
                  <div class="scope-tags">${scopes || '<span class="scope-tag">default</span>'}</div>
                </div>
                <div class="card-field">
                  <div class="card-label">Duration</div>
                  <div class="card-value">${escapeHtmlDrawer(String(req.ttl || '--'))}</div>
                </div>
                <div class="card-buttons">
                  <button class="card-btn grant" data-action="grant" data-request="${req.requestId}">Grant</button>
                  <button class="card-btn deny" data-action="deny" data-request="${req.requestId}">Deny</button>
                </div>
              </div>
            `;
          }).join('');

          // Add grant/deny listeners for each request card
          requestsContainer.querySelectorAll('[data-action="grant"]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const requestId = (btn as HTMLElement).dataset.request;
              if (requestId) {
                chrome.runtime.sendMessage({ type: 'approveLease', requestId });
                updateDrawerContent();
              }
            });
          });

          requestsContainer.querySelectorAll('[data-action="deny"]').forEach((btn) => {
            btn.addEventListener('click', () => {
              const requestId = (btn as HTMLElement).dataset.request;
              if (requestId) {
                chrome.runtime.sendMessage({ type: 'denyLease', requestId });
                updateDrawerContent();
              }
            });
          });
        } else {
          requestsContainer.innerHTML = '<div class="empty-state"><div class="empty-icon">✓</div>None pending</div>';
        }
      });
    }

    // Listen for storage changes to update drawer
    chrome.storage.onChanged.addListener((changes) => {
      if (drawerVisible && (changes.activeLeases || changes.pendingLeases)) {
        updateDrawerContent();
      }
    });

    // Listen for messages from background
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'showLeaseOverlay' && msg.lease) {
        showOverlay(msg.lease);
      } else if (msg.type === 'hideLeaseOverlay') {
        hideOverlay(false);
      } else if (msg.type === 'toggleDrawer') {
        toggleDrawer();
      }
    });
  },
});
