"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ConfidenceMeterProps {
  value: number;
  label?: string;
  className?: string;
}

/**
 * ConfidenceMeter - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ConfidenceMeter.tsx
 * @catalog-status candidate
 */
export function ConfidenceMeter({ value, label, className }: ConfidenceMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = clamped > 80 ? "bg-emerald-500" : clamped > 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label ?? "Confidence"}</span>
        <span className="text-xs font-medium text-foreground">{clamped}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
