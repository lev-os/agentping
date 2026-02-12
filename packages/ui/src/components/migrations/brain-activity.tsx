"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface BrainActivityProps {
  regions: { name: string; activity: number }[];
  className?: string;
}

/**
 * BrainActivity - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/BrainActivity.tsx
 * @migration-status candidate
 */
export function BrainActivity({ regions = [], className }: BrainActivityProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {regions.map((region) => {
        const clamped = Math.max(0, Math.min(100, region.activity));
        const color = clamped > 80 ? "bg-red-500" : clamped > 50 ? "bg-amber-500" : "bg-emerald-500";
        return (
          <div key={region.name} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 truncate">{region.name}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${clamped}%` }} />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{clamped}%</span>
          </div>
        );
      })}
    </div>
  );
}
