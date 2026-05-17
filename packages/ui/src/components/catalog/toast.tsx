"use client";

/**
 * Toast — Catalog component from Studio
 *
 * Toast notification system with variants, auto-dismiss, and stacking.
 *
 * @source packages/studio/src/renderer/components/ui/Toast.tsx
 * @catalog-status complete
 * @category ui-primitive
 */

import React, { useState, useEffect, useCallback } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ToastVariant = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  id?: string;
  variant?: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
  action?: ToastAction;
  onDismiss?: (id: string) => void;
  className?: string;
}

export interface ToastContainerProps {
  position?: ToastPosition;
  children: React.ReactNode;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function createToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ReactNode; accent: string; border: string }
> = {
  success: {
    icon: <CheckCircle size={18} />,
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  error: {
    icon: <XCircle size={18} />,
    accent: "text-red-400",
    border: "border-red-500/20",
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    accent: "text-amber-400",
    border: "border-amber-500/20",
  },
  info: {
    icon: <Info size={18} />,
    accent: "text-cyan-400",
    border: "border-cyan-500/20",
  },
};

const POSITION_STYLES: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

export function Toast({
  id,
  variant = "info",
  title,
  description,
  duration = 5000,
  dismissible = true,
  action,
  onDismiss,
  className,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const toastId = id ?? createToastId();

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(toastId), 200);
  }, [onDismiss, toastId]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleDismiss]);

  const config = VARIANT_CONFIG[variant];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "w-80 rounded-lg border bg-zinc-900/95 backdrop-blur-sm",
        "shadow-lg shadow-black/20",
        "transition-all duration-200",
        config.border,
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none",
        className,
      )}
    >
      <div className="flex gap-3 p-3">
        <span className={cn("flex-shrink-0 mt-0.5", config.accent)}>
          {config.icon}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-100">{title}</p>
          {description && (
            <p className="mt-1 text-xs text-zinc-400">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "mt-2 text-xs font-medium",
                config.accent,
                "hover:underline",
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast Container                                                     */
/* ------------------------------------------------------------------ */

export function ToastContainer({
  position = "top-right",
  children,
  className,
}: ToastContainerProps) {
  return (
    <div
      className={cn(
        "fixed z-[100] flex flex-col gap-2",
        POSITION_STYLES[position],
        className,
      )}
    >
      {children}
    </div>
  );
}
