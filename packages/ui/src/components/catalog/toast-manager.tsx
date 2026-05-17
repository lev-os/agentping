"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ToastMessage {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface ToastManagerProps {
  toasts?: ToastMessage[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  onDismiss?: (id: string) => void;
  className?: string;
}

const typeStyle: Record<ToastMessage["type"], string> = {
  info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
};

const typeIcon: Record<ToastMessage["type"], string> = {
  info: "\u2139",
  success: "\u2713",
  warning: "\u26A0",
  error: "\u2717",
};

const positionClass: Record<NonNullable<ToastManagerProps["position"]>, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

export function ToastManager({
  toasts = [],
  position = "top-right",
  onDismiss,
  className,
}: ToastManagerProps) {
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 w-80 font-mono",
        positionClass[position],
        className
      )}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-2 px-3 py-2.5 rounded-lg border text-sm",
            typeStyle[toast.type]
          )}
        >
          <span className="text-base leading-none mt-0.5">
            {typeIcon[toast.type]}
          </span>
          <span className="flex-1">{toast.message}</span>
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
