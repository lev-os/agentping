/**
 * @kingly/ui - Action Model Types
 *
 * Universal interaction primitives for UI, analytics, and agent access
 */

import type { ElementType } from "react";

/**
 * Analytics metadata for action tracking
 */
export interface ActionMetadata {
  category: string;                // 'widget' | 'navigation' | 'crud'
  action: string;                  // 'collapse' | 'click' | 'delete'
  label?: string;                  // Widget/entity title
  value?: number;
  properties?: Record<string, unknown>;
}

/**
 * Context for analytics tracking
 */
export interface ActionContext {
  widgetId?: string;
  entityId?: string;
  entityType?: string;
  route?: string;
  sessionId?: string;
  userId?: string;
}

/**
 * Payload sent to analytics adapters
 */
export interface ActionPayload {
  type: string;
  label: string;
  metadata: ActionMetadata;
  timestamp: number;
}

/**
 * Base action descriptor - every interaction point
 */
export interface ActionDescriptor<T = unknown> {
  type: string;                    // 'widget_collapse' | 'episode_view'
  label: string;                   // Human readable
  callback: (payload?: T) => void | Promise<void>;
  analytics: ActionMetadata;
  ariaLabel: string;               // Accessibility label
  icon?: ElementType;
  disabled?: boolean;
  shortcut?: string;               // 'Cmd+K' keyboard shortcut
}

/**
 * Confirmation dialog configuration
 */
export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * Action wrapped with confirmation - for destructive actions
 */
export interface ActionConfirmation<T extends ActionDescriptor = ActionDescriptor> {
  action: T;
  confirmation: ConfirmationConfig;
}

/**
 * Type guard for ActionConfirmation
 */
export function isActionConfirmation<T extends ActionDescriptor>(
  action: T | ActionConfirmation<T>
): action is ActionConfirmation<T> {
  return "confirmation" in action && "action" in action;
}

/**
 * Analytics adapter interface
 */
export interface AnalyticsAdapter {
  track(event: ActionPayload, context: ActionContext): Promise<void>;
}

/**
 * Middleware function signature
 */
export type ActionMiddleware = (
  action: ActionDescriptor,
  context: ActionContext,
  next: () => Promise<void>
) => Promise<void>;

/**
 * Domain entity a11y mixin for agent discoverability
 */
export interface A11yMetadata<T extends readonly string[] = readonly string[]> {
  label: string;                    // "Episode #1234"
  description?: string;             // "Training run from Dec 16"
  actions: T;                       // ['view', 'replay', 'delete']
}

/**
 * Helper to generate a11y from entity
 */
export function entityA11y<T extends readonly string[]>(
  label: string,
  actions: T,
  description?: string
): A11yMetadata<T> {
  return { label, description, actions };
}

/**
 * Common action types for widgets
 */
export type WidgetActionType =
  | 'collapse'
  | 'expand'
  | 'refresh'
  | 'settings'
  | 'maximize'
  | 'minimize'
  | 'close';

/**
 * Common action types for CRUD entities
 */
export type CrudActionType =
  | 'view'
  | 'view_details'
  | 'edit'
  | 'delete'
  | 'archive'
  | 'duplicate'
  | 'export';

/**
 * Helper to create a basic ActionDescriptor
 */
export function createAction<T = void>(
  type: string,
  label: string,
  callback: (payload?: T) => void | Promise<void>,
  options: Partial<Omit<ActionDescriptor<T>, 'type' | 'label' | 'callback' | 'analytics'>> & {
    category?: string;
    actionName?: string;
  } = {}
): ActionDescriptor<T> {
  const { category = 'general', actionName = type, ...rest } = options;

  return {
    type,
    label,
    callback,
    ariaLabel: options.ariaLabel ?? label,
    analytics: {
      category,
      action: actionName,
      label,
    },
    ...rest,
  };
}

/**
 * Helper to wrap an action with confirmation
 */
export function withConfirmation<T extends ActionDescriptor>(
  action: T,
  confirmation: ConfirmationConfig
): ActionConfirmation<T> {
  return { action, confirmation };
}
