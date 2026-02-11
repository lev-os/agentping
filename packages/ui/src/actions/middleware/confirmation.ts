/**
 * @kingly/ui - Confirmation Middleware
 *
 * Shows confirmation dialogs for destructive actions
 */

import type {
  ActionDescriptor,
  ActionContext,
  ActionConfirmation,
  ConfirmationConfig,
} from "../types";
import { isActionConfirmation } from "../types";

/**
 * Confirmation handler function type
 */
export type ConfirmationHandler = (
  config: ConfirmationConfig
) => Promise<boolean>;

/**
 * State for pending confirmations
 */
interface PendingConfirmation {
  config: ConfirmationConfig;
  resolve: (confirmed: boolean) => void;
}

/**
 * Confirmation queue - managed by ActionProvider
 */
let confirmationQueue: PendingConfirmation[] = [];
let confirmationHandler: ConfirmationHandler | null = null;

/**
 * Set the confirmation handler (called by ActionProvider)
 */
export function setConfirmationHandler(handler: ConfirmationHandler): void {
  confirmationHandler = handler;

  // Process any queued confirmations
  processQueue();
}

/**
 * Clear the confirmation handler
 */
export function clearConfirmationHandler(): void {
  confirmationHandler = null;
}

/**
 * Process queued confirmations
 */
async function processQueue(): Promise<void> {
  while (confirmationQueue.length > 0 && confirmationHandler) {
    const pending = confirmationQueue.shift()!;
    const result = await confirmationHandler(pending.config);
    pending.resolve(result);
  }
}

/**
 * Request confirmation from the user
 */
export async function requestConfirmation(
  config: ConfirmationConfig
): Promise<boolean> {
  return new Promise((resolve) => {
    if (confirmationHandler) {
      confirmationHandler(config).then(resolve);
    } else {
      // Queue if no handler registered yet
      confirmationQueue.push({ config, resolve });
    }
  });
}

/**
 * Create confirmation middleware
 *
 * This middleware intercepts ActionConfirmation objects and shows
 * a confirmation dialog before executing the action.
 */
export function createConfirmationMiddleware(): (
  action: ActionDescriptor | ActionConfirmation,
  context: ActionContext,
  next: () => Promise<void>
) => Promise<void> {
  return async (action, context, next) => {
    // Check if this is an action with confirmation
    if (isActionConfirmation(action)) {
      const confirmed = await requestConfirmation(action.confirmation);

      if (!confirmed) {
        // User cancelled - don't execute
        return;
      }

      // User confirmed - the actual action.callback will be called by next()
      // But we need to make sure the unwrapped action is what gets executed
    }

    await next();
  };
}

/**
 * Get current pending confirmation (for testing)
 */
export function getPendingConfirmations(): readonly PendingConfirmation[] {
  return confirmationQueue;
}

/**
 * Clear pending confirmations (for testing)
 */
export function clearPendingConfirmations(): void {
  confirmationQueue.forEach((p) => p.resolve(false));
  confirmationQueue = [];
}
