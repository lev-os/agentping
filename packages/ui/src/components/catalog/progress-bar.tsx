"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  variant?: "default" | "success" | "warning" | "error";
  showValue?: boolean;
  className?: string;
}

/**
 * ProgressBar - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ProgressBar.tsx
 * @catalog-status candidate
 */
export function ProgressBar({ value = 0, max = 100, label, variant = "default", showValue = true, className }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const colors: Record<string, string> = {
    default: "bg-cyan-400",
    success: "bg-green-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1">
          {label && <span className="text-xs font-mono text-cyan-500/60">{label}</span>}
          {showValue && <span className="text-xs font-mono text-cyan-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 bg-black/40 rounded-full border border-cyan-500/10">
        <div className={cn("h-full rounded-full transition-all", colors[variant])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
