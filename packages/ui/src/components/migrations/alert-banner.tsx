"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AlertBannerProps {
  title?: string;
  message: string;
  type?: "success" | "warning" | "error" | "info";
  className?: string;
  onDismiss?: () => void;
}

const typeStyles = {
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  warning: "border-amber-500/50 bg-amber-500/10 text-amber-400",
  error: "border-red-500/50 bg-red-500/10 text-red-400",
  info: "border-blue-500/50 bg-blue-500/10 text-blue-400",
};

const icons = { success: "\u2713", warning: "\u26A0", error: "\u2717", info: "\u2139" };

/**
 * AlertBanner - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/AlertBanner.tsx
 * @migration-status candidate
 */
export function AlertBanner({ title, message, type = "info", className, onDismiss }: AlertBannerProps) {
  return (
    <div className={cn("flex items-start gap-3 px-4 py-3 rounded-md border", typeStyles[type], className)} role="alert">
      <span className="text-sm shrink-0 pt-0.5" aria-hidden="true">{icons[type]}</span>
      <div className="flex-1 min-w-0">
        {title && <div className="text-sm font-semibold">{title}</div>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {onDismiss && (
        <button className="text-current opacity-70 hover:opacity-100 shrink-0" onClick={onDismiss} aria-label="Dismiss alert">
          &times;
        </button>
      )}
    </div>
  );
}
