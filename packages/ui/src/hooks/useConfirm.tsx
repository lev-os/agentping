"use client";

/**
 * @kingly/ui - useConfirm Hook
 *
 * Ergonomic confirmation hook with Promise-based API.
 * Returns a confirm function and a ConfirmDialog component.
 */

import * as React from "react";
import type { ConfirmationConfig } from "../actions/types";
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

interface ConfirmState {
  isOpen: boolean;
  config: ConfirmationConfig | null;
  resolve: ((confirmed: boolean) => void) | null;
}

interface UseConfirmReturn {
  /**
   * Show a confirmation dialog and wait for user response
   * @returns Promise that resolves to true if confirmed, false if cancelled
   */
  confirm: (config: ConfirmationConfig) => Promise<boolean>;
  /**
   * The confirmation dialog component - render this in your component tree
   */
  ConfirmDialog: React.FC;
  /**
   * Whether a confirmation is currently pending
   */
  isPending: boolean;
}

/**
 * useConfirm - Ergonomic confirmation hook
 *
 * @example
 * ```tsx
 * function DeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
 *   const { confirm, ConfirmDialog } = useConfirm();
 *
 *   const handleDelete = async () => {
 *     const confirmed = await confirm({
 *       title: "Delete Item",
 *       message: "Are you sure? This action cannot be undone.",
 *       confirmLabel: "Delete",
 *       destructive: true,
 *     });
 *
 *     if (confirmed) {
 *       await onDelete();
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <Button variant="destructive" onClick={handleDelete}>
 *         Delete
 *       </Button>
 *       <ConfirmDialog />
 *     </>
 *   );
 * }
 * ```
 */
export function useConfirm(): UseConfirmReturn {
  const [state, setState] = React.useState<ConfirmState>({
    isOpen: false,
    config: null,
    resolve: null,
  });

  const resolve = state.resolve;

  const confirm = React.useCallback(
    (config: ConfirmationConfig): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          config,
          resolve,
        });
      });
    },
    []
  );

  const handleConfirm = React.useCallback(() => {
    resolve?.(true);
    setState({ isOpen: false, config: null, resolve: null });
  }, [resolve]);

  const handleCancel = React.useCallback(() => {
    resolve?.(false);
    setState({ isOpen: false, config: null, resolve: null });
  }, [resolve]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        handleCancel();
      }
    },
    [handleCancel]
  );

  const ConfirmDialog = React.useCallback(
    () => (
      <AlertDialog open={state.isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {state.config?.title ?? "Confirm"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {state.config?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {state.config?.cancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              destructive={state.config?.destructive}
            >
              {state.config?.confirmLabel ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [state.isOpen, state.config, handleOpenChange, handleCancel, handleConfirm]
  );

  return {
    confirm,
    ConfirmDialog,
    isPending: state.isOpen,
  };
}
