/**
 * AgentPing Modal Notification UI
 *
 * Full-screen cinematic overlay with card stacking for multiple requests.
 * Provides the most immersive notification experience.
 */

import {
  BaseNotification,
  type LeaseRequest,
  type NotificationConfig,
} from './base-notification';
import { FocusTrap, generateAriaId, setDialogAttributes, setButtonAttributes, prefersReducedMotion } from '../a11y-utils';
import { ThemeManager, getVignetteGradient, getThemeBoxShadow } from '../theme-utils';
import { getBaseStyles, typography, borderRadius, spacing, animation } from '../tokens';

// ============================================================================
// Modal Notification UI
// ============================================================================

export class ModalNotificationUI extends BaseNotification {
  private overlay!: HTMLElement;
  private modal!: HTMLElement;
  private stackContainer!: HTMLElement;
  private cardStack: HTMLElement[] = [];

  private ids = {
    title: generateAriaId('modal-title'),
    desc: generateAriaId('modal-desc'),
    dialog: generateAriaId('modal-dialog'),
  };

  constructor(themeManager: ThemeManager, config: NotificationConfig) {
    super('agentping-modal-overlay', themeManager, config);
    this.initializeUI();
  }

  protected initializeUI(): void {
    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = this.getStyles();
    this.shadow.appendChild(styles);

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay';
    this.overlay.setAttribute('role', 'presentation');

    // Create stack container for background cards
    this.stackContainer = document.createElement('div');
    this.stackContainer.className = 'stack-container';
    this.overlay.appendChild(this.stackContainer);

    // Create main modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    setDialogAttributes(this.modal, {
      modal: true,
      labelledBy: this.ids.title,
      describedBy: this.ids.desc,
    });

    this.modal.innerHTML = this.getModalTemplate();
    this.overlay.appendChild(this.modal);
    this.shadow.appendChild(this.overlay);

    // Setup focus trap
    this.focusTrap = new FocusTrap(this.modal);

    // Bind button events
    this.bindEvents();
  }

  private getModalTemplate(): string {
    return `
      <div class="header">
        <div class="icon" aria-hidden="true">🤖</div>
        <div class="header-text">
          <h2 class="title" id="${this.ids.title}">Lease Request</h2>
          <div class="subtitle">Agent Authorization</div>
        </div>
        <div class="badge" aria-label="Pending requests count" data-badge></div>
      </div>

      <div id="${this.ids.desc}" class="sr-only">
        An agent is requesting access to browser capabilities. Review the details below and grant or deny the request.
      </div>

      <div class="field">
        <div class="field-label">Agent</div>
        <div class="field-value" data-agent-name>--</div>
      </div>

      <div class="field">
        <div class="field-label">Scopes</div>
        <div class="scopes" data-scope-list role="list" aria-label="Requested scopes"></div>
      </div>

      <div class="field">
        <div class="field-label">Duration</div>
        <div class="field-value" data-duration>--</div>
      </div>

      <div class="field">
        <div class="field-label">Reason</div>
        <div class="reason" data-reason>No reason provided</div>
      </div>

      <div class="buttons" role="group" aria-label="Actions">
        <button class="btn btn-grant" data-action="grant" type="button">
          Grant
        </button>
        <button class="btn btn-deny" data-action="deny" type="button">
          Deny
        </button>
      </div>

      <div class="hints" aria-hidden="true">
        <span class="hint"><kbd class="key">G</kbd> Grant</span>
        <span class="hint"><kbd class="key">D</kbd> Deny</span>
        <span class="hint"><kbd class="key">Esc</kbd> Dismiss</span>
      </div>
    `;
  }

  private bindEvents(): void {
    const grantBtn = this.modal.querySelector('[data-action="grant"]') as HTMLButtonElement;
    const denyBtn = this.modal.querySelector('[data-action="deny"]') as HTMLButtonElement;

    if (grantBtn) {
      setButtonAttributes(grantBtn, { label: 'Grant lease request' });
      grantBtn.addEventListener('click', () => this.handleGrant());
    }

    if (denyBtn) {
      setButtonAttributes(denyBtn, { label: 'Deny lease request' });
      denyBtn.addEventListener('click', () => this.handleDeny());
    }
  }

  protected renderContent(lease: LeaseRequest): void {
    const agentNameEl = this.modal.querySelector('[data-agent-name]') as HTMLElement;
    const scopeListEl = this.modal.querySelector('[data-scope-list]') as HTMLElement;
    const durationEl = this.modal.querySelector('[data-duration]') as HTMLElement;
    const reasonEl = this.modal.querySelector('[data-reason]') as HTMLElement;
    const badgeEl = this.modal.querySelector('[data-badge]') as HTMLElement;

    // Update content
    agentNameEl.textContent = lease.agentName || 'Unknown Agent';

    const scopes = lease.scopes || [];
    scopeListEl.innerHTML = scopes.length > 0
      ? scopes.map(s => `<span class="scope-tag" role="listitem">${this.escapeHtml(s)}</span>`).join('')
      : '<span class="scope-tag" role="listitem">default</span>';

    durationEl.textContent = this.formatTtl(lease.ttl);
    reasonEl.textContent = lease.reason || 'No reason provided';

    // Update badge for pending count
    const pendingCount = this.pendingRequests.length;
    if (pendingCount > 0) {
      badgeEl.textContent = `+${pendingCount}`;
      badgeEl.classList.add('visible');
    } else {
      badgeEl.classList.remove('visible');
    }

    // Update card stack visualization
    this.updateCardStack();
  }

  private updateCardStack(): void {
    // Clear existing stack cards
    this.stackContainer.innerHTML = '';
    this.cardStack = [];

    // Create stacked card representations
    const maxVisible = Math.min(this.pendingRequests.length, this.config.maxStack - 1);

    for (let i = 0; i < maxVisible; i++) {
      const card = document.createElement('div');
      card.className = 'stack-card';
      card.style.setProperty('--stack-index', String(i + 1));
      card.setAttribute('aria-hidden', 'true');
      this.stackContainer.appendChild(card);
      this.cardStack.push(card);
    }
  }

  protected getStyles(): string {
    const reducedMotion = prefersReducedMotion();
    const transitionDuration = reducedMotion ? '0ms' : animation.duration.slow;

    return `
      ${getBaseStyles()}

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: ${getVignetteGradient(this.themeManager.getTheme())};
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity ${transitionDuration} ease, visibility ${transitionDuration} ease;
        pointer-events: none;
      }

      .overlay.visible {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .overlay.fade-out {
        opacity: 0;
        transition: opacity ${animation.duration.slower} ease;
      }

      .stack-container {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .stack-card {
        position: absolute;
        background: var(--ap-bg-primary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.xl};
        max-width: 420px;
        width: 90%;
        height: 280px;
        transform: scale(calc(1 - var(--stack-index) * 0.05))
                   translateY(calc(var(--stack-index) * -10px));
        opacity: calc(0.3 - var(--stack-index) * 0.1);
        transition: transform ${transitionDuration} ease, opacity ${transitionDuration} ease;
      }

      .modal {
        position: relative;
        background: var(--ap-bg-primary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.xl};
        box-shadow: ${getThemeBoxShadow(this.themeManager.getTheme(), 'modal')};
        padding: ${spacing.xxl} ${spacing.xxxl};
        max-width: 420px;
        width: 90%;
        transform: scale(0.95) translateY(10px);
        transition: transform ${transitionDuration} ${animation.easing.bounce};
        z-index: 1;
      }

      .overlay.visible .modal {
        transform: scale(1) translateY(0);
      }

      .header {
        display: flex;
        align-items: center;
        gap: ${spacing.md};
        margin-bottom: ${spacing.xl};
        padding-bottom: ${spacing.lg};
        border-bottom: 1px solid var(--ap-border-accent);
      }

      .icon {
        width: 40px;
        height: 40px;
        border-radius: ${borderRadius.lg};
        background: linear-gradient(135deg, var(--ap-accent-muted) 0%, rgba(0, 229, 255, 0.05) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .header-text {
        flex: 1;
      }

      .title {
        color: var(--ap-accent);
        font-size: ${typography.fontSize.xl};
        font-weight: ${typography.fontWeight.semibold};
        letter-spacing: ${typography.letterSpacing.wide};
        margin: 0;
      }

      .subtitle {
        color: var(--ap-text-muted);
        font-size: ${typography.fontSize.sm};
        margin-top: 2px;
        text-transform: uppercase;
        letter-spacing: ${typography.letterSpacing.wider};
      }

      .badge {
        display: none;
        min-width: 24px;
        height: 24px;
        padding: 0 6px;
        background: var(--ap-danger-muted);
        border: 1px solid var(--ap-danger);
        border-radius: ${borderRadius.full};
        color: var(--ap-danger);
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.bold};
        line-height: 22px;
        text-align: center;
      }

      .badge.visible {
        display: block;
      }

      .field {
        margin-bottom: ${spacing.md};
      }

      .field-label {
        color: var(--ap-text-muted);
        font-size: ${typography.fontSize.xs};
        text-transform: uppercase;
        letter-spacing: ${typography.letterSpacing.widest};
        margin-bottom: ${spacing.xs};
      }

      .field-value {
        color: var(--ap-text-primary);
        font-size: ${typography.fontSize.lg};
        word-break: break-word;
      }

      .scopes {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacing.xs};
      }

      .scope-tag {
        background: var(--ap-accent-muted);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.sm};
        padding: ${spacing.xs} ${spacing.sm};
        font-size: ${typography.fontSize.base};
        color: var(--ap-accent);
      }

      .reason {
        background: rgba(255, 255, 255, 0.03);
        border-radius: ${borderRadius.md};
        padding: ${spacing.md};
        color: var(--ap-text-secondary);
        font-size: ${typography.fontSize.md};
        line-height: ${typography.lineHeight.normal};
        font-style: italic;
      }

      .buttons {
        display: flex;
        gap: ${spacing.md};
        margin-top: ${spacing.xl};
      }

      .btn {
        flex: 1;
        padding: ${spacing.md} ${spacing.xl};
        border: none;
        border-radius: ${borderRadius.lg};
        font-family: inherit;
        font-size: ${typography.fontSize.lg};
        font-weight: ${typography.fontWeight.semibold};
        cursor: pointer;
        transition: all ${animation.duration.normal} ease;
        text-transform: uppercase;
        letter-spacing: ${typography.letterSpacing.wider};
      }

      .btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .btn-grant {
        background: var(--ap-success-muted);
        border: 1px solid rgba(0, 255, 157, 0.3);
        color: var(--ap-success);
        box-shadow: 0 0 20px var(--ap-success-glow);
      }

      .btn-grant:hover {
        background: rgba(0, 255, 157, 0.2);
        box-shadow: 0 0 30px var(--ap-success-glow);
      }

      .btn-grant:active {
        transform: scale(0.98);
      }

      .btn-deny {
        background: var(--ap-danger-muted);
        border: 1px solid rgba(255, 42, 109, 0.3);
        color: var(--ap-danger);
        box-shadow: 0 0 20px var(--ap-danger-glow);
      }

      .btn-deny:hover {
        background: rgba(255, 42, 109, 0.2);
        box-shadow: 0 0 30px var(--ap-danger-glow);
      }

      .btn-deny:active {
        transform: scale(0.98);
      }

      .hints {
        display: flex;
        justify-content: center;
        gap: ${spacing.xl};
        margin-top: ${spacing.lg};
        color: var(--ap-text-muted);
        font-size: ${typography.fontSize.sm};
      }

      .hint {
        display: flex;
        align-items: center;
        gap: ${spacing.xs};
      }

      .key {
        background: var(--ap-border-primary);
        border: 1px solid var(--ap-border-secondary);
        border-radius: ${borderRadius.sm};
        padding: 2px ${spacing.sm};
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.medium};
      }
    `;
  }

  // Override show to manage overlay visibility
  show(lease: LeaseRequest): void {
    super.show(lease);
    this.overlay.classList.remove('fade-out');
    this.overlay.classList.add('visible');
  }

  // Override hide to manage overlay visibility
  hide(fade = false): void {
    if (fade) {
      this.overlay.classList.add('fade-out');
      setTimeout(() => {
        this.overlay.classList.remove('visible', 'fade-out');
        super.hide(false);
      }, 400);
    } else {
      this.overlay.classList.remove('visible');
      super.hide(false);
    }
  }
}
