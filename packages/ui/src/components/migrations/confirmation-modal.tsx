"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}

/**
 * ConfirmationModal - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ConfirmationModal.tsx
 * @migration-status candidate
 */
export function ConfirmationModal({
  isOpen, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel",
  variant = "default", onConfirm, onCancel, className
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
      <div className="fixed inset-0 bg-black/60" />
      <div className={cn("relative bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-2xl", className)} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-md border border-border text-foreground hover:bg-muted transition-colors">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 text-sm rounded-md font-medium transition-colors",
              variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
