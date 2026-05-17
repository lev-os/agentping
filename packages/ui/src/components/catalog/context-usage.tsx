"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ContextUsageProps {
  used: number;
  total: number;
  label?: string;
  className?: string;
}

/**
 * ContextUsage - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ContextUsage.tsx
 * @catalog-status candidate
 */
export function ContextUsage({ used = 0, total = 1, label = "Context", className }: ContextUsageProps) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 0;
  const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
