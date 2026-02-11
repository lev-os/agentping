"use client";

/**
 * @kingly/ui - ActionProvider Component
 *
 * Provides action execution context and handles confirmations.
 */

import * as React from "react";
import { ActionReactContext, type ActionContextValue } from "../hooks/useAction";
import type { ActionContext as ActionContextType, ConfirmationConfig } from "../actions/types";
import { ActionPipeline } from "../actions/pipeline";
import {
  createAnalyticsMiddleware,
  getDefaultAnalyticsAdapter,
} from "../actions/middleware/analytics";
import {
  setConfirmationHandler,
  clearConfirmationHandler,
} from "../actions/middleware/confirmation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";

export interface ActionProviderProps {
  children: React.ReactNode;
  /** Global context merged with all actions */
  globalContext?: ActionContextType;
  /** Custom pipeline (uses default if not provided) */
  pipeline?: ActionPipeline;
  /** Disable analytics tracking */
  disableAnalytics?: boolean;
}

interface ConfirmationState {
  config: ConfirmationConfig;
  resolve: (confirmed: boolean) => void;
}

/**
 * ActionProvider - Wraps app with action execution context
 */
export function ActionProvider({
  children,
  globalContext = {},
  pipeline: customPipeline,
  disableAnalytics = false,
}: ActionProviderProps) {
  const [confirmation, setConfirmation] = React.useState<ConfirmationState | null>(null);

  // Create or use provided pipeline
  const pipeline = React.useMemo(() => {
    if (customPipeline) return customPipeline;

    const p = new ActionPipeline();

    if (!disableAnalytics) {
      const adapter = getDefaultAnalyticsAdapter();
      p.use(createAnalyticsMiddleware(adapter));
    }

    return p;
  }, [customPipeline, disableAnalytics]);

  // Confirmation handler
  const confirm = React.useCallback(
    (config: ConfirmationConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmation({ config, resolve });
      });
    },
    []
  );

  // Register global confirmation handler
  React.useEffect(() => {
    setConfirmationHandler(confirm);
    return () => clearConfirmationHandler();
  }, [confirm]);

  // Handle dialog actions
  const handleConfirm = () => {
    confirmation?.resolve(true);
    setConfirmation(null);
  };

  const handleCancel = () => {
    confirmation?.resolve(false);
    setConfirmation(null);
  };

  const contextValue: ActionContextValue = React.useMemo(
    () => ({
      execute: async (action, payload) => {
        // This is handled by useAction hook
        await pipeline.execute(action as never, globalContext, payload);
      },
      globalContext,
      pipeline,
      confirm,
    }),
    [globalContext, pipeline, confirm]
  );

  return (
    <ActionReactContext.Provider value={contextValue}>
      {children}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmation} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmation?.config.title ?? "Confirm Action"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmation?.config.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {confirmation?.config.cancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              destructive={confirmation?.config.destructive}
            >
              {confirmation?.config.confirmLabel ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ActionReactContext.Provider>
  );
}
