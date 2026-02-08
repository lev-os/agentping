/**
 * AgentPing Toast Notification UI
 *
 * macOS-style toast stack for non-blocking notifications.
 * Multiple toasts stack vertically, new ones push existing down.
 */

import {
  BaseNotification,
  type LeaseRequest,
  type NotificationConfig,
} from './base-notification';
import { generateAriaId, setButtonAttributes, prefersReducedMotion } from '../a11y-utils';
import { ThemeManager, getThemeBoxShadow } from '../theme-utils';
import { getBaseStyles, typography, borderRadius, spacing, animation } from '../tokens';

// ============================================================================
// Toast Item
// ============================================================================

interface ToastItem {
  id: string;
  lease: LeaseRequest;
  element: HTMLElement;
  timeoutId?: ReturnType<typeof setTimeout>;
}

// ============================================================================
// Toast Notification UI
// ============================================================================

export class ToastNotificationUI extends BaseNotification {
  private container!: HTMLElement;
  private toasts: Map<string, ToastItem> = new Map();
  private autoDismissDelay = 30000; // 30 seconds

  constructor(themeManager: ThemeManager, config: NotificationConfig) {
    super('agentping-toast-container', themeManager, config);
    // Toast container doesn't block clicks
    this.host.style.pointerEvents = 'none';
    this.initializeUI();
  }

  protected initializeUI(): void {
    // Inject styles
    const styles = document.createElement('style');
    styles.textContent = this.getStyles();
    this.shadow.appendChild(styles);

    // Create container
    this.container = document.createElement('div');
    this.container.className = `toast-container position-${this.config.position}`;
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Notifications');
    this.container.setAttribute('aria-live', 'polite');
    this.shadow.appendChild(this.container);
  }

  protected renderContent(lease: LeaseRequest): void {
    // Create individual toast for this lease
    this.createToast(lease);
  }

  private createToast(lease: LeaseRequest): void {
    const toastId = generateAriaId('toast');
    const titleId = generateAriaId('toast-title');
    const descId = generateAriaId('toast-desc');

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alertdialog');
    toast.setAttribute('aria-labelledby', titleId);
    toast.setAttribute('aria-describedby', descId);
    toast.dataset.requestId = lease.requestId;

    toast.innerHTML = `
      <div class="toast-header">
        <div class="toast-icon" aria-hidden="true">🤖</div>
        <div class="toast-title" id="${titleId}">
          ${this.escapeHtml(lease.agentName || 'Unknown Agent')}
        </div>
        <button class="toast-close" data-action="dismiss" type="button" aria-label="Dismiss notification">
          ×
        </button>
      </div>

      <div class="toast-body" id="${descId}">
        <div class="toast-scopes" role="list" aria-label="Requested scopes">
          ${(lease.scopes || ['default']).map(s =>
            `<span class="scope-tag" role="listitem">${this.escapeHtml(s)}</span>`
          ).join('')}
        </div>
        <div class="toast-meta">
          <span class="toast-duration">${this.formatTtl(lease.ttl)}</span>
          ${lease.reason ? `<span class="toast-reason">${this.escapeHtml(lease.reason.slice(0, 50))}${lease.reason.length > 50 ? '...' : ''}</span>` : ''}
        </div>
      </div>

      <div class="toast-actions">
        <button class="toast-btn grant" data-action="grant" type="button">
          Grant
        </button>
        <button class="toast-btn deny" data-action="deny" type="button">
          Deny
        </button>
      </div>

      <div class="toast-progress" aria-hidden="true">
        <div class="toast-progress-bar"></div>
      </div>
    `;

    // Bind events
    this.bindToastEvents(toast, lease.requestId);

    // Add to container with animation
    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Setup auto-dismiss
    const timeoutId = setTimeout(() => {
      this.dismissToast(lease.requestId);
    }, this.autoDismissDelay);

    // Store toast reference
    const toastItem: ToastItem = {
      id: toastId,
      lease,
      element: toast,
      timeoutId,
    };
    this.toasts.set(lease.requestId, toastItem);

    // Limit visible toasts
    this.enforceMaxStack();
  }

  private bindToastEvents(toast: HTMLElement, requestId: string): void {
    // Grant button
    const grantBtn = toast.querySelector('[data-action="grant"]') as HTMLButtonElement;
    if (grantBtn) {
      setButtonAttributes(grantBtn, { label: 'Grant lease request' });
      grantBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleToastGrant(requestId);
      });
    }

    // Deny button
    const denyBtn = toast.querySelector('[data-action="deny"]') as HTMLButtonElement;
    if (denyBtn) {
      setButtonAttributes(denyBtn, { label: 'Deny lease request' });
      denyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleToastDeny(requestId);
      });
    }

    // Dismiss button
    const dismissBtn = toast.querySelector('[data-action="dismiss"]') as HTMLButtonElement;
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dismissToast(requestId);
      });
    }

    // Pause auto-dismiss on hover
    toast.addEventListener('mouseenter', () => {
      const item = this.toasts.get(requestId);
      if (item?.timeoutId) {
        clearTimeout(item.timeoutId);
        item.timeoutId = undefined;
      }
      // Pause progress bar
      const progressBar = toast.querySelector('.toast-progress-bar') as HTMLElement;
      if (progressBar) {
        progressBar.style.animationPlayState = 'paused';
      }
    });

    // Resume auto-dismiss on mouse leave
    toast.addEventListener('mouseleave', () => {
      const item = this.toasts.get(requestId);
      if (item) {
        item.timeoutId = setTimeout(() => {
          this.dismissToast(requestId);
        }, this.autoDismissDelay / 2); // Resume with half time
        // Resume progress bar
        const progressBar = toast.querySelector('.toast-progress-bar') as HTMLElement;
        if (progressBar) {
          progressBar.style.animationPlayState = 'running';
        }
      }
    });
  }

  private handleToastGrant(requestId: string): void {
    this.onGrant(requestId);
    this.removeToast(requestId, true);
  }

  private handleToastDeny(requestId: string): void {
    this.onDeny(requestId);
    this.removeToast(requestId, false);
  }

  private dismissToast(requestId: string): void {
    this.removeToast(requestId, false);
  }

  private removeToast(requestId: string, granted: boolean): void {
    const item = this.toasts.get(requestId);
    if (!item) return;

    // Clear timeout
    if (item.timeoutId) {
      clearTimeout(item.timeoutId);
    }

    // Animate out
    item.element.classList.add(granted ? 'exit-grant' : 'exit-deny');

    setTimeout(() => {
      item.element.remove();
      this.toasts.delete(requestId);

      // Update visibility
      if (this.toasts.size === 0) {
        this._isVisible = false;
        this.currentRequest = null;
      }
    }, 300);
  }

  private enforceMaxStack(): void {
    const toastElements = Array.from(this.container.children) as HTMLElement[];
    const excess = toastElements.length - this.config.maxStack;

    if (excess > 0) {
      // Remove oldest toasts
      for (let i = 0; i < excess; i++) {
        const oldest = toastElements[i];
        const requestId = oldest.dataset.requestId;
        if (requestId) {
          this.dismissToast(requestId);
        }
      }
    }
  }

  protected getStyles(): string {
    const reducedMotion = prefersReducedMotion();
    const transitionDuration = reducedMotion ? '0ms' : animation.duration.slow;

    return `
      ${getBaseStyles()}

      .toast-container {
        position: fixed;
        top: ${spacing.xl};
        display: flex;
        flex-direction: column;
        gap: ${spacing.sm};
        max-width: 380px;
        width: calc(100vw - 40px);
        max-height: calc(100vh - 40px);
        overflow: hidden;
        pointer-events: none;
        z-index: 2147483645;
      }

      .toast-container.position-right {
        right: ${spacing.xl};
        align-items: flex-end;
      }

      .toast-container.position-left {
        left: ${spacing.xl};
        align-items: flex-start;
      }

      .toast-container.position-center {
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
      }

      .toast {
        background: var(--ap-bg-primary);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.xl};
        box-shadow: ${getThemeBoxShadow(this.themeManager.getTheme(), 'toast')};
        width: 100%;
        max-width: 360px;
        overflow: hidden;
        pointer-events: auto;
        transform: translateX(100%) scale(0.95);
        opacity: 0;
        transition: transform ${transitionDuration} ${animation.easing.bounce},
                    opacity ${transitionDuration} ease;
      }

      .toast-container.position-left .toast {
        transform: translateX(-100%) scale(0.95);
      }

      .toast-container.position-center .toast {
        transform: translateY(-20px) scale(0.95);
      }

      .toast.visible {
        transform: translateX(0) scale(1);
        opacity: 1;
      }

      .toast-container.position-center .toast.visible {
        transform: translateY(0) scale(1);
      }

      .toast.exit-grant {
        transform: translateX(100%) scale(0.9);
        opacity: 0;
        border-color: var(--ap-success);
      }

      .toast.exit-deny {
        transform: translateX(-100%) scale(0.9);
        opacity: 0;
        border-color: var(--ap-danger);
      }

      .toast-header {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        padding: ${spacing.md} ${spacing.lg};
        border-bottom: 1px solid var(--ap-border-secondary);
      }

      .toast-icon {
        font-size: ${typography.fontSize.xl};
      }

      .toast-title {
        flex: 1;
        font-size: ${typography.fontSize.md};
        font-weight: ${typography.fontWeight.semibold};
        color: var(--ap-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .toast-close {
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        color: var(--ap-text-muted);
        cursor: pointer;
        border-radius: ${borderRadius.sm};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all ${animation.duration.fast} ease;
      }

      .toast-close:hover {
        background: var(--ap-border-primary);
        color: var(--ap-text-primary);
      }

      .toast-close:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .toast-body {
        padding: ${spacing.md} ${spacing.lg};
      }

      .toast-scopes {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacing.xs};
        margin-bottom: ${spacing.sm};
      }

      .scope-tag {
        background: var(--ap-accent-muted);
        border: 1px solid var(--ap-border-accent);
        border-radius: ${borderRadius.sm};
        padding: 2px ${spacing.sm};
        font-size: ${typography.fontSize.xs};
        color: var(--ap-accent);
      }

      .toast-meta {
        display: flex;
        align-items: center;
        gap: ${spacing.sm};
        font-size: ${typography.fontSize.xs};
        color: var(--ap-text-muted);
      }

      .toast-duration {
        font-weight: ${typography.fontWeight.medium};
      }

      .toast-reason {
        opacity: 0.7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }

      .toast-actions {
        display: flex;
        gap: ${spacing.sm};
        padding: 0 ${spacing.lg} ${spacing.md};
      }

      .toast-btn {
        flex: 1;
        padding: ${spacing.sm} ${spacing.md};
        border: none;
        border-radius: ${borderRadius.md};
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.semibold};
        cursor: pointer;
        font-family: inherit;
        transition: all ${animation.duration.fast} ease;
      }

      .toast-btn:focus-visible {
        outline: 2px solid var(--ap-accent);
        outline-offset: 2px;
      }

      .toast-btn.grant {
        background: var(--ap-success-muted);
        color: var(--ap-success);
        border: 1px solid rgba(0, 255, 157, 0.3);
      }

      .toast-btn.grant:hover {
        background: rgba(0, 255, 157, 0.25);
      }

      .toast-btn.deny {
        background: var(--ap-danger-muted);
        color: var(--ap-danger);
        border: 1px solid rgba(255, 42, 109, 0.3);
      }

      .toast-btn.deny:hover {
        background: rgba(255, 42, 109, 0.25);
      }

      .toast-progress {
        height: 3px;
        background: var(--ap-border-secondary);
        overflow: hidden;
      }

      .toast-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--ap-accent), var(--ap-success));
        width: 100%;
        transform-origin: left;
        animation: progress ${this.autoDismissDelay}ms linear forwards;
      }

      @keyframes progress {
        from { transform: scaleX(1); }
        to { transform: scaleX(0); }
      }
    `;
  }

  // Override keyboard handling for toast
  protected registerKeyboardShortcuts(): void {
    // Toasts use individual buttons, no global shortcuts
    // Still register Escape to dismiss all
    this.keyboardManager.register({
      key: 'Escape',
      handler: () => this.dismissAll(),
      description: 'Dismiss all notifications',
    });

    this.keyboardManager.disable();
  }

  private dismissAll(): void {
    const requestIds = Array.from(this.toasts.keys());
    for (const requestId of requestIds) {
      this.dismissToast(requestId);
    }
  }

  // Override show to not use focus trap
  show(lease: LeaseRequest): void {
    this._isVisible = true;
    this.currentRequest = lease;
    this.renderContent(lease);
    this.playSound();
    this.keyboardManager.enable();

    this.announceToScreenReader(
      `New lease request from ${lease.agentName || 'Unknown Agent'}. ` +
      `Scopes: ${(lease.scopes || ['default']).join(', ')}.`
    );
  }

  // Override hide
  hide(fade = false): void {
    this.dismissAll();
    this._isVisible = false;
    this.currentRequest = null;
    this.keyboardManager.disable();
  }

  get pendingCount(): number {
    return this.toasts.size;
  }
}
