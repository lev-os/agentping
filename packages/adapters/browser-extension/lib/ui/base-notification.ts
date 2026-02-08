/**
 * AgentPing Base Notification Interface
 *
 * Defines the contract for all notification UI implementations.
 * Each notification style (modal, drawer, toast) implements this interface.
 */

import { FocusTrap, ScreenReaderAnnouncer, KeyboardManager } from '../a11y-utils';
import { ThemeManager, injectThemeIntoShadow } from '../theme-utils';

// ============================================================================
// Types
// ============================================================================

export interface LeaseRequest {
  requestId: string;
  agentName?: string;
  agentId?: string;
  scopes?: string[];
  ttl?: string | number;
  reason?: string;
  tabId?: number;
}

export interface ActiveLease {
  token: string;
  scopes: string[];
  expiresAt: number;
  tabId?: number;
}

export interface NotificationConfig {
  position: 'left' | 'right' | 'center';
  maxStack: number;
  soundEnabled: boolean;
  soundVolume: number;
}

// ============================================================================
// Base Notification Interface
// ============================================================================

export interface NotificationUI {
  /**
   * Show a lease request notification
   */
  show(lease: LeaseRequest): void;

  /**
   * Hide the notification (with optional fade animation)
   */
  hide(fade?: boolean): void;

  /**
   * Completely destroy the notification and clean up resources
   */
  destroy(): void;

  /**
   * Whether the notification is currently visible
   */
  readonly isVisible: boolean;

  /**
   * Number of pending notifications in the queue
   */
  readonly pendingCount: number;

  /**
   * Callback when user grants a lease request
   */
  onGrant: (requestId: string) => void;

  /**
   * Callback when user denies a lease request
   */
  onDeny: (requestId: string) => void;

  /**
   * Announce a message to screen readers
   */
  announceToScreenReader(message: string): void;
}

// ============================================================================
// Base Notification Implementation
// ============================================================================

/**
 * Abstract base class providing common functionality for notification UIs.
 * Handles theme injection, accessibility, and keyboard shortcuts.
 */
export abstract class BaseNotification implements NotificationUI {
  protected host: HTMLElement;
  protected shadow: ShadowRoot;
  protected themeManager: ThemeManager;
  protected focusTrap: FocusTrap | null = null;
  protected announcer: ScreenReaderAnnouncer;
  protected keyboardManager: KeyboardManager;
  protected themeCleanup: (() => void) | null = null;
  protected config: NotificationConfig;

  protected _isVisible = false;
  protected pendingRequests: LeaseRequest[] = [];
  protected currentRequest: LeaseRequest | null = null;

  onGrant: (requestId: string) => void = () => {};
  onDeny: (requestId: string) => void = () => {};

  constructor(
    hostTagName: string,
    themeManager: ThemeManager,
    config: NotificationConfig
  ) {
    this.themeManager = themeManager;
    this.config = config;

    // Create host element
    this.host = document.createElement(hostTagName);
    this.host.style.cssText = 'all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;';
    document.documentElement.appendChild(this.host);

    // Create shadow DOM
    this.shadow = this.host.attachShadow({ mode: 'closed' });

    // Inject theme
    this.themeCleanup = injectThemeIntoShadow(this.shadow, this.themeManager);

    // Setup accessibility
    this.announcer = new ScreenReaderAnnouncer(this.shadow);
    this.keyboardManager = new KeyboardManager(document);

    // Register common keyboard shortcuts
    this.registerKeyboardShortcuts();

    // NOTE: initializeUI() is NOT called here because subclass fields
    // aren't initialized yet. Subclasses must call this.initializeUI()
    // at the end of their own constructor.
  }

  /**
   * Initialize the UI elements (implemented by subclasses)
   */
  protected abstract initializeUI(): void;

  /**
   * Render the notification content (implemented by subclasses)
   */
  protected abstract renderContent(lease: LeaseRequest): void;

  /**
   * Get styles for this notification type (implemented by subclasses)
   */
  protected abstract getStyles(): string;

  /**
   * Register keyboard shortcuts
   */
  protected registerKeyboardShortcuts(): void {
    this.keyboardManager.register({
      key: 'g',
      handler: () => this.handleGrant(),
      description: 'Grant the current lease request',
    });

    this.keyboardManager.register({
      key: 'd',
      handler: () => this.handleDeny(),
      description: 'Deny the current lease request',
    });

    this.keyboardManager.register({
      key: 'Escape',
      handler: () => this.handleEscape(),
      description: 'Dismiss the notification',
    });

    // Disable by default, enable when visible
    this.keyboardManager.disable();
  }

  /**
   * Handle grant action
   */
  protected handleGrant(): void {
    if (!this._isVisible || !this.currentRequest) return;
    this.onGrant(this.currentRequest.requestId);
    this.processNextOrHide();
  }

  /**
   * Handle deny action
   */
  protected handleDeny(): void {
    if (!this._isVisible || !this.currentRequest) return;
    this.onDeny(this.currentRequest.requestId);
    this.processNextOrHide();
  }

  /**
   * Handle escape action
   */
  protected handleEscape(): void {
    if (!this._isVisible) return;
    this.hide(false);
  }

  /**
   * Process next pending request or hide
   */
  protected processNextOrHide(): void {
    if (this.pendingRequests.length > 0) {
      const nextRequest = this.pendingRequests.shift()!;
      this.currentRequest = nextRequest;
      this.renderContent(nextRequest);
    } else {
      this.hide(true);
    }
  }

  /**
   * Play notification sound
   */
  protected playSound(): void {
    if (!this.config.soundEnabled) return;

    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);      // A5
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.1); // D6

      gain.gain.setValueAtTime(this.config.soundVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn('[AgentPing] Could not play notification sound:', err);
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  protected escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Format TTL for display
   */
  protected formatTtl(ttl?: string | number): string {
    if (typeof ttl === 'number') {
      return `${ttl} minute${ttl !== 1 ? 's' : ''}`;
    }
    if (typeof ttl === 'string') {
      return this.escapeHtml(ttl);
    }
    return '--';
  }

  // ============================================================================
  // NotificationUI Interface Implementation
  // ============================================================================

  show(lease: LeaseRequest): void {
    // If already showing, queue this request
    if (this._isVisible && this.currentRequest) {
      this.pendingRequests.push(lease);
      this.announceToScreenReader(`New lease request queued. ${this.pendingRequests.length} pending.`);
      return;
    }

    this.currentRequest = lease;
    this.renderContent(lease);
    this.playSound();

    this._isVisible = true;
    this.keyboardManager.enable();

    if (this.focusTrap) {
      this.focusTrap.activate();
    }

    // Announce to screen reader
    this.announceToScreenReader(
      `Lease request from ${lease.agentName || 'Unknown Agent'}. ` +
      `Scopes: ${(lease.scopes || ['default']).join(', ')}. ` +
      `Press G to grant or D to deny.`
    );
  }

  hide(fade = false): void {
    this._isVisible = false;
    this.currentRequest = null;
    this.pendingRequests = [];
    this.keyboardManager.disable();

    if (this.focusTrap) {
      this.focusTrap.deactivate();
    }
  }

  destroy(): void {
    this.hide();

    if (this.themeCleanup) {
      this.themeCleanup();
    }

    this.keyboardManager.detach();
    this.announcer.destroy();
    this.host.remove();
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  get pendingCount(): number {
    return this.pendingRequests.length;
  }

  announceToScreenReader(message: string): void {
    this.announcer.announceUrgent(message);
  }
}

// ============================================================================
// Factory Types
// ============================================================================

export type NotificationStyle = 'modal' | 'drawer' | 'toast';

export interface NotificationUIFactory {
  create(
    style: NotificationStyle,
    themeManager: ThemeManager,
    config: NotificationConfig
  ): NotificationUI;
}
