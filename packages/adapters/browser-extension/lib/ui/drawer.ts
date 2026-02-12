/**
 * AgentPing Drawer Notification UI
 *
 * Side panel drawer showing pending requests and active leases.
 * Can be toggled from extension icon and auto-opens on new requests.
 */

import {
  BaseNotification,
  type LeaseRequest,
  type ActiveLease,
  type NotificationConfig,
} from './base-notification';
import { FocusTrap, generateAriaId, setDialogAttributes, setButtonAttributes, prefersReducedMotion } from '../a11y-utils';
import { ThemeManager, getThemeBoxShadow } from '../theme-utils';
import { getBaseStyles, typography, borderRadius, spacing, animation } from '../tokens';

// ============================================================================
// Drawer State
// ============================================================================

export interface DrawerState {
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'leased';
  activeLeases: ActiveLease[];
  pendingRequests: LeaseRequest[];
}

// ============================================================================
// Drawer Notification UI
// ============================================================================

export class DrawerNotificationUI extends BaseNotification {
  private backdrop!: HTMLElement;
  private drawer!: HTMLElement;
  private statusDot!: HTMLElement;
  private statusText!: HTMLElement;
  private leasesContainer!: HTMLElement;
  private requestsContainer!: HTMLElement;

  private state: DrawerState = {
    connectionState: 'disconnected',
    activeLeases: [],
    pendingRequests: [],
  };

  private countdownIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  private ids = {
    drawer: generateAriaId('drawer'),
    title: generateAriaId('drawer-title'),
    leases: generateAriaId('drawer-leases'),
    requests: generateAriaId('drawer-requests'),
  };

  // Drawer-specific callbacks
  onRevoke: (token: string) => void = () => {};
  onStateRequest: (callback: (state: DrawerState) => void) => void = () => {};

  constructor(themeManager: ThemeManager, config: NotificationConfig) {
    super('agentping-drawer', themeManager, config);
    this.host.style.zIndex = '2147483646'; // Slightly lower than modal
    this.initializeUI();
  }

  protected initializeUI(): void {
    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = this.getStyles();
    this.shadow.appendChild(styles);

    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'drawer-backdrop';
    this.backdrop.setAttribute('role', 'presentation');

    // Create drawer
    this.drawer = document.createElement('div');
    this.drawer.className = 'drawer';
    setDialogAttributes(this.drawer, {
      labelledBy: this.ids.title,
    });

    this.drawer.innerHTML = this.getDrawerTemplate();
    this.backdrop.appendChild(this.drawer);
    this.shadow.appendChild(this.backdrop);

    // Get element references
    this.statusDot = this.drawer.querySelector('[data-status-dot]') as HTMLElement;
    this.statusText = this.drawer.querySelector('[data-status-text]') as HTMLElement;
    this.leasesContainer = this.drawer.querySelector('[data-leases-container]') as HTMLElement;
    this.requestsContainer = this.drawer.querySelector('[data-requests-container]') as HTMLElement;

    // Setup focus trap
    this.focusTrap = new FocusTrap(this.drawer);

    // Bind events
    this.bindEvents();
  }

  private getDrawerTemplate(): string {
    const positionClass = this.config.position === 'left' ? 'position-left' : 'position-right';

    return `
      <div class="drawer-header">
        <div class="drawer-title" id="${this.ids.title}">
          <span class="drawer-icon" aria-hidden="true">⚡</span>
          <span>AgentPing</span>
        </div>
        <button class="close-btn" data-action="close" type="button" aria-label="Close drawer">
          ×
        </button>
      </div>

      <div class="status-bar">
        <div class="status-dot" data-status-dot aria-hidden="true"></div>
        <div class="status-text" data-status-text role="status" aria-live="polite">Checking...</div>
      </div>

      <div class="drawer-content">
        <section class="section" aria-labelledby="${this.ids.leases}">
          <h3 class="section-header" id="${this.ids.leases}">Active Leases</h3>
          <div data-leases-container role="list" aria-label="Active leases"></div>
        </section>

        <section class="section" aria-labelledby="${this.ids.requests}">
          <h3 class="section-header" id="${this.ids.requests}">Pending Requests</h3>
          <div data-requests-container role="list" aria-label="Pending requests"></div>
        </section>
      </div>

      <div class="drawer-footer">
        <a href="http://localhost:5175" target="_blank" rel="noopener" class="footer-link">
          🔗 Dashboard
        </a>
        <div class="version">v0.1.0</div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Close button
    const closeBtn = this.drawer.querySelector('[data-action="close"]') as HTMLButtonElement;
    closeBtn?.addEventListener('click', () => this.hide());

    // Backdrop click closes drawer
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });

    // Prevent clicks inside drawer from closing it
    this.drawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * Update drawer with new state
   */
  updateState(state: DrawerState): void {
    this.state = state;
    this.renderStatus();
    this.renderLeases();
    this.renderRequests();
  }

  private renderStatus(): void {
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

    this.statusDot.className = `status-dot ${statusClasses[this.state.connectionState] || 'gray'}`;
    this.statusText.textContent = statusTexts[this.state.connectionState] || this.state.connectionState;
  }

  private renderLeases(): void {
    // Clear countdown intervals
    this.countdownIntervals.forEach(interval => clearInterval(interval));
    this.countdownIntervals.clear();

    if (this.state.activeLeases.length === 0) {
      this.leasesContainer.innerHTML = `
        <div class="empty-state" role="status">
          <div class="empty-icon" aria-hidden="true">💤</div>
          No active leases
        </div>
      `;
      return;
    }

    this.leasesContainer.innerHTML = this.state.activeLeases.map(lease => `
      <div class="lease-card" data-lease-token="${lease.token}" role="listitem">
        <div class="card-field">
          <div class="card-label">Scopes</div>
          <div class="scope-tags" role="list" aria-label="Lease scopes">
            ${(lease.scopes || []).map(s =>
              `<span class="scope-tag" role="listitem">${this.escapeHtml(s)}</span>`
            ).join('') || '<span class="scope-tag" role="listitem">default</span>'}
          </div>
        </div>
        <div class="card-field">
          <div class="card-label">Remaining</div>
          <div class="card-value countdown" data-countdown="${lease.token}" aria-live="polite">--</div>
        </div>
        <div class="card-buttons">
          <button class="card-btn revoke" data-action="revoke" data-token="${lease.token}" type="button">
            Revoke
          </button>
        </div>
      </div>
    `).join('');

    // Setup countdowns
    this.state.activeLeases.forEach(lease => {
      this.setupCountdown(lease);
    });

    // Setup revoke buttons
    this.leasesContainer.querySelectorAll('[data-action="revoke"]').forEach(btn => {
      const token = (btn as HTMLElement).dataset.token;
      setButtonAttributes(btn as HTMLElement, { label: 'Revoke this lease' });
      btn.addEventListener('click', () => {
        if (token) this.onRevoke(token);
      });
    });
  }

  private setupCountdown(lease: ActiveLease): void {
    const el = this.leasesContainer.querySelector(`[data-countdown="${lease.token}"]`) as HTMLElement;
    if (!el || !lease.expiresAt) return;

    const update = () => {
      const remaining = Math.max(0, lease.expiresAt - Date.now());
      el.textContent = this.formatRemaining(remaining);
      el.className = remaining < 60000 ? 'card-value countdown warning' : 'card-value countdown';

      if (remaining <= 0) {
        const interval = this.countdownIntervals.get(lease.token);
        if (interval) {
          clearInterval(interval);
          this.countdownIntervals.delete(lease.token);
        }
        // Request state refresh to remove expired lease
        this.onStateRequest((newState) => this.updateState(newState));
      }
    };

    update();
    const interval = setInterval(update, 1000);
    this.countdownIntervals.set(lease.token, interval);
  }

  private formatRemaining(ms: number): string {
    if (ms <= 0) return '00:00';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  private renderRequests(): void {
    if (this.state.pendingRequests.length === 0) {
      this.requestsContainer.innerHTML = `
        <div class="empty-state" role="status">
          <div class="empty-icon" aria-hidden="true">✓</div>
          None pending
        </div>
      `;
      return;
    }

    this.requestsContainer.innerHTML = this.state.pendingRequests.map(req => `
      <div class="request-card" data-request-id="${req.requestId}" role="listitem">
        <div class="card-field">
          <div class="card-label">Agent</div>
          <div class="card-value agent">${this.escapeHtml(req.agentName || 'Unknown Agent')}</div>
        </div>
        <div class="card-field">
          <div class="card-label">Scopes</div>
          <div class="scope-tags" role="list" aria-label="Requested scopes">
            ${(req.scopes || []).map(s =>
              `<span class="scope-tag" role="listitem">${this.escapeHtml(s)}</span>`
            ).join('') || '<span class="scope-tag" role="listitem">default</span>'}
          </div>
        </div>
        <div class="card-field">
          <div class="card-label">Duration</div>
          <div class="card-value">${this.formatTtl(req.ttl)}</div>
        </div>
        <div class="card-buttons">
          <button class="card-btn grant" data-action="grant" data-request="${req.requestId}" type="button">
            Grant
          </button>
          <button class="card-btn deny" data-action="deny" data-request="${req.requestId}" type="button">
            Deny
          </button>
        </div>
      </div>
    `).join('');

    // Setup grant/deny buttons
    this.requestsContainer.querySelectorAll('[data-action="grant"]').forEach(btn => {
      const requestId = (btn as HTMLElement).dataset.request;
      setButtonAttributes(btn as HTMLElement, { label: 'Grant lease request' });
      btn.addEventListener('click', () => {
        if (requestId) this.onGrant(requestId);
      });
    });

    this.requestsContainer.querySelectorAll('[data-action="deny"]').forEach(btn => {
      const requestId = (btn as HTMLElement).dataset.request;
      setButtonAttributes(btn as HTMLElement, { label: 'Deny lease request' });
      btn.addEventListener('click', () => {
        if (requestId) this.onDeny(requestId);
      });
    });
  }

  protected renderContent(lease: LeaseRequest): void {
    // Add to pending if not already there
    const exists = this.state.pendingRequests.some(r => r.requestId === lease.requestId);
    if (!exists) {
      this.state.pendingRequests.push(lease);
    }
    this.renderRequests();
  }

  protected getStyles(): string {
    const reducedMotion = prefersReducedMotion();
    const transitionDuration = reducedMotion ? '0ms' : animation.duration.slow;
    const isLeft = this.config.position === 'left';

    return `
      ${getBaseStyles()}

      .drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
        opacity: 0;
        visibility: hidden;
        transition: opacity ${transitionDuration} ease, visibility ${transitionDuration} ease;
        pointer-events: none;
      }

      .drawer-backdrop.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .drawer {
        position: fixed;
        ${isLeft ? 'left' : 'right'}: 0;
        top: 0;
        height: 100vh;
        width: 320px;
        background: var(--ap-bg-primary);
        border-${isLeft ? 'right' : 'left'}: 1px solid var(--ap-border-accent);
        box-shadow: ${isLeft ? '' : '-'}4px 0 20px rgba(0, 0, 0, 0.5);
        transform: translateX(${isLeft ? '-100%' : '100%'});
        transition: transform ${transitionDuration} ${animation.easing.default};
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
        padding: ${spacing.lg} ${spacing.xl};
        border-bottom: 1px solid var(--ap-border-accent);
      }

      .drawer-title {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        font-size: ${typography.fontSize.lg};
        font-weight: ${typography.fontWeight.bold};
        color: var(--ap-text-primary);
      }

      .drawer-icon {
        color: var(--ap-accent);
        font-size: ${typography.fontSize.xl};
      }

      .close-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: var(--ap-border-primary);
        color: var(--ap-text-muted);
        border-radius: ${borderRadius.md};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all ${animation.duration.normal} ease;
      }

      .close-btn:hover {
        background: var(--ap-border-secondary);
        color: var(--ap-text-primary);
      }

      .close-btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .status-bar {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        padding: ${spacing.md} ${spacing.xl};
        background: var(--ap-accent-muted);
        border-bottom: 1px solid var(--ap-border-secondary);
        font-size: ${typography.fontSize.base};
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: ${borderRadius.full};
        flex-shrink: 0;
      }

      .status-dot.gray { background: #555; }
      .status-dot.amber { background: var(--ap-warning); box-shadow: 0 0 8px var(--ap-warning-muted); }
      .status-dot.green { background: var(--ap-success); box-shadow: 0 0 8px var(--ap-success-glow); }
      .status-dot.cyan { background: var(--ap-accent); box-shadow: 0 0 8px var(--ap-accent-glow); }

      .status-text {
        color: var(--ap-text-secondary);
        font-size: ${typography.fontSize.base};
      }

      .drawer-content {
        flex: 1;
        overflow-y: auto;
        padding: ${spacing.lg} ${spacing.xl};
      }

      .section {
        margin-bottom: ${spacing.xl};
      }

      .section-header {
        color: var(--ap-text-muted);
        font-size: ${typography.fontSize.xs};
        font-weight: ${typography.fontWeight.semibold};
        text-transform: uppercase;
        letter-spacing: ${typography.letterSpacing.widest};
        margin: 0 0 ${spacing.md} 0;
      }

      .lease-card {
        background: var(--ap-bg-tertiary);
        border: 1px solid rgba(0, 255, 157, 0.2);
        border-radius: ${borderRadius.lg};
        padding: ${spacing.md};
        margin-bottom: ${spacing.sm};
      }

      .request-card {
        background: var(--ap-bg-tertiary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.lg};
        padding: ${spacing.md};
        margin-bottom: ${spacing.sm};
      }

      .card-field {
        margin-bottom: ${spacing.sm};
      }

      .card-label {
        font-size: 9px;
        font-weight: ${typography.fontWeight.semibold};
        color: var(--ap-text-muted);
        text-transform: uppercase;
        margin-bottom: ${spacing.xs};
      }

      .card-value {
        font-size: ${typography.fontSize.base};
        color: var(--ap-text-secondary);
      }

      .card-value.agent {
        color: var(--ap-text-primary);
        font-weight: ${typography.fontWeight.semibold};
      }

      .card-value.countdown {
        font-size: ${typography.fontSize.xxl};
        font-weight: ${typography.fontWeight.bold};
        color: var(--ap-success);
        text-shadow: 0 0 10px var(--ap-success-glow);
      }

      .card-value.countdown.warning {
        color: var(--ap-danger);
        text-shadow: 0 0 10px var(--ap-danger-glow);
      }

      .scope-tags {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacing.xs};
      }

      .scope-tag {
        background: var(--ap-accent-muted);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.sm};
        padding: ${spacing.xs} ${spacing.sm};
        font-size: ${typography.fontSize.sm};
        color: var(--ap-accent);
      }

      .card-buttons {
        display: flex;
        gap: ${spacing.sm};
        margin-top: ${spacing.md};
      }

      .card-btn {
        flex: 1;
        padding: ${spacing.sm} ${spacing.md};
        border: none;
        border-radius: ${borderRadius.md};
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.semibold};
        cursor: pointer;
        font-family: inherit;
        transition: all ${animation.duration.normal} ease;
      }

      .card-btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .card-btn.grant {
        background: var(--ap-success-muted);
        color: var(--ap-success);
        border: 1px solid rgba(0, 255, 157, 0.3);
      }

      .card-btn.grant:hover {
        background: rgba(0, 255, 157, 0.25);
      }

      .card-btn.deny {
        background: var(--ap-danger-muted);
        color: var(--ap-danger);
        border: 1px solid rgba(255, 42, 109, 0.3);
      }

      .card-btn.deny:hover {
        background: rgba(255, 42, 109, 0.25);
      }

      .card-btn.revoke {
        background: var(--ap-border-primary);
        color: var(--ap-text-muted);
        border: 1px solid var(--ap-border-secondary);
      }

      .card-btn.revoke:hover {
        background: var(--ap-border-secondary);
        color: var(--ap-text-secondary);
      }

      .empty-state {
        text-align: center;
        color: var(--ap-text-muted);
        padding: ${spacing.xl} 0;
        font-size: ${typography.fontSize.sm};
      }

      .empty-icon {
        font-size: 32px;
        margin-bottom: ${spacing.sm};
        opacity: 0.3;
      }

      .drawer-footer {
        padding: ${spacing.lg} ${spacing.xl};
        border-top: 1px solid var(--ap-border-secondary);
      }

      .footer-link {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        color: var(--ap-accent);
        text-decoration: none;
        font-size: ${typography.fontSize.base};
        margin-bottom: ${spacing.sm};
        transition: color ${animation.duration.normal} ease;
      }

      .footer-link:hover {
        color: var(--ap-success);
      }

      .footer-link:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .version {
        color: var(--ap-text-muted);
        font-size: ${typography.fontSize.xs};
        text-align: center;
      }
    `;
  }

  /**
   * Toggle drawer visibility
   */
  toggle(): void {
    if (this._isVisible) {
      this.hide();
    } else {
      this.showDrawer();
    }
  }

  /**
   * Show drawer (without a specific lease request)
   */
  showDrawer(): void {
    this._isVisible = true;
    this.backdrop.classList.add('visible');
    this.keyboardManager.enable();

    if (this.focusTrap) {
      this.focusTrap.activate();
    }

    // Start refresh interval
    if (!this.refreshInterval) {
      this.refreshInterval = setInterval(() => {
        this.onStateRequest((state) => this.updateState(state));
      }, 2000);
    }

    this.announceToScreenReader('AgentPing drawer opened');
  }

  // Override show to auto-open drawer
  show(lease: LeaseRequest): void {
    super.show(lease);
    this.backdrop.classList.add('visible');

    // Start refresh interval
    if (!this.refreshInterval) {
      this.refreshInterval = setInterval(() => {
        this.onStateRequest((state) => this.updateState(state));
      }, 2000);
    }
  }

  // Override hide
  hide(fade = false): void {
    this._isVisible = false;
    this.backdrop.classList.remove('visible');
    this.keyboardManager.disable();

    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }

    // Clear intervals
    this.countdownIntervals.forEach(interval => clearInterval(interval));
    this.countdownIntervals.clear();

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    super.hide(false);
  }
}
