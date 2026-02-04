/**
 * AgentPing Notification UI Factory
 *
 * Creates the appropriate notification UI based on configuration.
 * Provides a unified interface for all notification styles.
 */

import {
  type NotificationUI,
  type NotificationStyle,
  type NotificationConfig,
  type LeaseRequest,
  type ActiveLease,
} from './base-notification';
import { ModalNotificationUI } from './modal';
import { DrawerNotificationUI, type DrawerState } from './drawer';
import { ToastNotificationUI } from './toast';
import { ThemeManager, initGlobalThemeManager, loadThemeConfig } from '../theme-utils';

// Re-export types
export type {
  NotificationUI,
  NotificationStyle,
  NotificationConfig,
  LeaseRequest,
  ActiveLease,
  DrawerState,
};

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  position: 'right',
  maxStack: 5,
  soundEnabled: true,
  soundVolume: 0.15,
};

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a notification UI instance based on style
 */
export function createNotificationUI(
  style: NotificationStyle,
  themeManager: ThemeManager,
  config: NotificationConfig = DEFAULT_NOTIFICATION_CONFIG
): NotificationUI {
  switch (style) {
    case 'modal':
      return new ModalNotificationUI(themeManager, config);
    case 'drawer':
      return new DrawerNotificationUI(themeManager, config);
    case 'toast':
      return new ToastNotificationUI(themeManager, config);
    default:
      console.warn(`[AgentPing] Unknown notification style: ${style}, falling back to modal`);
      return new ModalNotificationUI(themeManager, config);
  }
}

// ============================================================================
// Unified Manager
// ============================================================================

export interface NotificationManagerConfig {
  style: NotificationStyle;
  notification: NotificationConfig;
}

/**
 * Unified notification manager that handles all UI styles
 * and provides a consistent API for the extension.
 */
export class NotificationManager {
  private ui: NotificationUI | null = null;
  private themeManager: ThemeManager | null = null;
  private config: NotificationManagerConfig;
  private initialized = false;

  // Callbacks
  onGrant: (requestId: string) => void = () => {};
  onDeny: (requestId: string) => void = () => {};
  onRevoke: (token: string) => void = () => {};
  onStateRequest: (callback: (state: DrawerState) => void) => void = () => {};

  constructor(config?: Partial<NotificationManagerConfig>) {
    this.config = {
      style: config?.style || 'modal',
      notification: { ...DEFAULT_NOTIFICATION_CONFIG, ...config?.notification },
    };
  }

  /**
   * Initialize the notification manager
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize theme manager
    this.themeManager = await initGlobalThemeManager();

    // Create UI
    this.ui = createNotificationUI(
      this.config.style,
      this.themeManager,
      this.config.notification
    );

    // Wire up callbacks
    this.ui.onGrant = (requestId) => this.onGrant(requestId);
    this.ui.onDeny = (requestId) => this.onDeny(requestId);

    // Wire drawer-specific callbacks
    if (this.ui instanceof DrawerNotificationUI) {
      (this.ui as DrawerNotificationUI).onRevoke = (token) => this.onRevoke(token);
      (this.ui as DrawerNotificationUI).onStateRequest = (cb) => this.onStateRequest(cb);
    }

    this.initialized = true;
  }

  /**
   * Update configuration and recreate UI if needed
   */
  async updateConfig(newConfig: Partial<NotificationManagerConfig>): Promise<void> {
    const styleChanged = newConfig.style && newConfig.style !== this.config.style;

    // Update config
    this.config = {
      style: newConfig.style || this.config.style,
      notification: { ...this.config.notification, ...newConfig.notification },
    };

    // Recreate UI if style changed
    if (styleChanged && this.initialized) {
      this.destroy();
      this.initialized = false;
      await this.initialize();
    }
  }

  /**
   * Show a lease request notification
   */
  show(lease: LeaseRequest): void {
    if (!this.ui) {
      console.warn('[AgentPing] NotificationManager not initialized');
      return;
    }
    this.ui.show(lease);
  }

  /**
   * Hide the notification
   */
  hide(fade = false): void {
    this.ui?.hide(fade);
  }

  /**
   * Toggle drawer visibility (drawer style only)
   */
  toggleDrawer(): void {
    if (this.ui instanceof DrawerNotificationUI) {
      (this.ui as DrawerNotificationUI).toggle();
    }
  }

  /**
   * Show drawer (drawer style only)
   */
  showDrawer(): void {
    if (this.ui instanceof DrawerNotificationUI) {
      (this.ui as DrawerNotificationUI).showDrawer();
    }
  }

  /**
   * Update drawer state (drawer style only)
   */
  updateDrawerState(state: DrawerState): void {
    if (this.ui instanceof DrawerNotificationUI) {
      (this.ui as DrawerNotificationUI).updateState(state);
    }
  }

  /**
   * Announce to screen reader
   */
  announce(message: string): void {
    this.ui?.announceToScreenReader(message);
  }

  /**
   * Check if notification is visible
   */
  get isVisible(): boolean {
    return this.ui?.isVisible ?? false;
  }

  /**
   * Get pending notification count
   */
  get pendingCount(): number {
    return this.ui?.pendingCount ?? 0;
  }

  /**
   * Get current style
   */
  get style(): NotificationStyle {
    return this.config.style;
  }

  /**
   * Destroy the notification manager
   */
  destroy(): void {
    this.ui?.destroy();
    this.ui = null;
    this.initialized = false;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let globalManager: NotificationManager | null = null;

/**
 * Get or create the global notification manager
 */
export async function getNotificationManager(
  config?: Partial<NotificationManagerConfig>
): Promise<NotificationManager> {
  if (!globalManager) {
    globalManager = new NotificationManager(config);
    await globalManager.initialize();
  } else if (config) {
    await globalManager.updateConfig(config);
  }
  return globalManager;
}

/**
 * Destroy the global notification manager
 */
export function destroyNotificationManager(): void {
  globalManager?.destroy();
  globalManager = null;
}
