"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ConnectionSignalProps {
  strength: number;
  maxBars?: number;
  label?: string;
  className?: string;
}

/**
 * ConnectionSignal - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ConnectionSignal.tsx
 * @migration-status candidate
 */
export function ConnectionSignal({ strength, maxBars = 4, label, className }: ConnectionSignalProps) {
  const bars = Math.max(0, Math.min(maxBars, Math.round(strength)));

  return (
    <div className={cn("inline-flex items-end gap-0.5", className)} title={label ?? `Signal: ${bars}/${maxBars}`}>
      {Array.from({ length: maxBars }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm transition-colors",
            i < bars ? "bg-emerald-500" : "bg-muted"
          )}
          style={{ height: `${((i + 1) / maxBars) * 16}px` }}
        />
      ))}
    </div>
  );
}
