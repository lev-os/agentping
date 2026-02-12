/**
 * AgentPing Browser Extension - Content Script
 *
 * Orchestrates notification UIs for lease approval requests.
 * Uses configurable notification styles: modal, drawer, or toast.
 */

import {
  NotificationManager,
  type NotificationStyle,
  type DrawerState,
} from '../lib/ui/index';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',

  async main() {
    // ========================================================================
    // Configuration
    // ========================================================================

    // Load config from storage (synced from daemon via background)
    const stored = await chrome.storage.local.get(['notificationConfig', 'agentping_theme_config']);

    const notificationStyle: NotificationStyle = stored.notificationConfig?.style || 'drawer';
    const notificationConfig = {
      position: stored.notificationConfig?.position || 'right',
      maxStack: stored.notificationConfig?.maxStack || 5,
      soundEnabled: stored.notificationConfig?.soundEnabled ?? true,
      soundVolume: stored.notificationConfig?.soundVolume || 0.15,
    };

    // ========================================================================
    // Notification Manager
    // ========================================================================

    const manager = new NotificationManager({
      style: notificationStyle,
      notification: notificationConfig,
    });

    // Initialize the manager
    await manager.initialize();

    // ========================================================================
    // Callback Handlers
    // ========================================================================

    // Grant callback
    manager.onGrant = (requestId: string) => {
      chrome.runtime.sendMessage({ type: 'approveLease', requestId });
    };

    // Deny callback
    manager.onDeny = (requestId: string) => {
      chrome.runtime.sendMessage({ type: 'denyLease', requestId });
    };

    // Revoke callback (drawer only)
    manager.onRevoke = (token: string) => {
      chrome.runtime.sendMessage({ type: 'revokeLease', token });
    };

    // State request callback (drawer only)
    manager.onStateRequest = (callback: (state: DrawerState) => void) => {
      chrome.runtime.sendMessage({ type: 'getDrawerState' }, (response) => {
        if (response) {
          callback({
            connectionState: response.connectionState,
            activeLeases: response.activeLeases || [],
            pendingRequests: response.pendingLeases || [],
          });
        }
      });
    };

    // ========================================================================
    // Message Handlers
    // ========================================================================

    chrome.runtime.onMessage.addListener((msg) => {
      switch (msg.type) {
        case 'showLeaseOverlay':
          if (msg.lease) {
            manager.show(msg.lease);
          }
          break;

        case 'hideLeaseOverlay':
          manager.hide(false);
          break;

        case 'toggleDrawer':
          manager.toggleDrawer();
          break;

        case 'showDrawer':
          manager.showDrawer();
          break;

        case 'updateDrawerState':
          if (msg.state) {
            manager.updateDrawerState(msg.state);
          }
          break;

        case 'updateConfig':
          // Handle runtime config updates
          if (msg.config) {
            manager.updateConfig({
              style: msg.config.notification?.style,
              notification: msg.config.notification,
            });
          }
          break;
      }
    });

    // ========================================================================
    // Storage Change Listener
    // ========================================================================

    chrome.storage.onChanged.addListener((changes) => {
      // Update drawer state when leases change
      if (manager.style === 'drawer' && manager.isVisible) {
        if (changes.activeLeases || changes.pendingLeases) {
          manager.onStateRequest((state) => manager.updateDrawerState(state));
        }
      }

      // Handle config changes
      if (changes.notificationConfig) {
        const newConfig = changes.notificationConfig.newValue;
        if (newConfig) {
          manager.updateConfig({
            style: newConfig.style,
            notification: newConfig,
          });
        }
      }

      // Handle theme config changes
      if (changes.agentping_theme_config?.newValue) {
        manager.updateThemeConfig(changes.agentping_theme_config.newValue);
      }
    });

    // ========================================================================
    // Cleanup on Unload
    // ========================================================================

    window.addEventListener('unload', () => {
      manager.destroy();
    });
  },
});
