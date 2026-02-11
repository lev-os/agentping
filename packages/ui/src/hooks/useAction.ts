"use client";

/**
 * @kingly/ui - useAction Hook
 *
 * Execute actions through the ActionPipeline with context.
 */

import { useCallback, useContext, createContext } from "react";
import type {
  ActionDescriptor,
  ActionContext as ActionContextType,
  ActionConfirmation,
  ConfirmationConfig,
} from "../actions/types";
import { isActionConfirmation } from "../actions/types";
import {
  ActionPipeline,
  getDefaultPipeline,
} from "../actions/pipeline";

const EMPTY_CONTEXT: ActionContextType = {};

/**
 * Action context value provided by ActionProvider
 */
export interface ActionContextValue {
  /** Execute an action through the pipeline */
  execute: (
    action: ActionDescriptor | ActionConfirmation,
    payload?: unknown
  ) => Promise<void>;
  /** Global context merged with action context */
  globalContext: ActionContextType;
  /** The action pipeline instance */
  pipeline: ActionPipeline;
  /** Request confirmation (used by middleware) */
  confirm: (config: ConfirmationConfig) => Promise<boolean>;
}

/**
 * React context for action execution
 */
export const ActionReactContext = createContext<ActionContextValue | null>(null);

/**
 * useAction - Execute actions through the pipeline
 *
 * @param localContext - Context to merge with global context
 * @returns Action execution utilities
 */
export function useAction(localContext: ActionContextType = EMPTY_CONTEXT) {
  const ctx = useContext(ActionReactContext);

  // Fallback for when not wrapped in ActionProvider
  const pipeline = ctx?.pipeline ?? getDefaultPipeline();
  const globalContext = ctx?.globalContext ?? EMPTY_CONTEXT;
  const confirm = ctx?.confirm;

  const execute = useCallback(
    async (
      actionOrConfirmation: ActionDescriptor | ActionConfirmation,
      payload?: unknown
    ): Promise<void> => {
      const mergedContext = { ...globalContext, ...localContext };

      if (isActionConfirmation(actionOrConfirmation)) {
        // Handle confirmation
        if (confirm) {
          const confirmed = await confirm(actionOrConfirmation.confirmation);
          if (!confirmed) return;
        }
        // Execute the underlying action
        await pipeline.execute(
          actionOrConfirmation.action,
          mergedContext,
          payload
        );
      } else {
        await pipeline.execute(actionOrConfirmation, mergedContext, payload);
      }
    },
    [pipeline, globalContext, localContext, confirm]
  );

  /**
   * Create a bound executor for a specific action
   */
  const bind = useCallback(
    (action: ActionDescriptor) => {
      return (payload?: unknown) => execute(action, payload);
    },
    [execute]
  );

  /**
   * Create a bound executor with confirmation
   */
  const bindWithConfirmation = useCallback(
    (action: ActionDescriptor, confirmation: ConfirmationConfig) => {
      const wrapped: ActionConfirmation = { action, confirmation };
      return (payload?: unknown) => execute(wrapped, payload);
    },
    [execute]
  );

  return {
    execute,
    bind,
    bindWithConfirmation,
    pipeline,
    context: { ...globalContext, ...localContext },
  };
}

/**
 * useActionContext - Access the action context directly
 */
export function useActionContext(): ActionContextValue | null {
  return useContext(ActionReactContext);
}

// Re-export for backwards compatibility
export { ActionReactContext as ActionContext };
