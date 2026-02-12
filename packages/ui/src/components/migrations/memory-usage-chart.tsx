"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MemoryPoint {
  time: string;
  used: number;
  total: number;
}

export interface MemoryUsageChartProps {
  data: MemoryPoint[];
  height?: number;
  className?: string;
}

/**
 * MemoryUsageChart - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MemoryUsageChart.tsx
 * @migration-status candidate
 */
export function MemoryUsageChart({ data, height = 150, className }: MemoryUsageChartProps) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className={cn("flex items-end gap-px", className)} style={{ height }}>
      {data.map((pt, i) => {
        const pct = (pt.used / maxVal) * 100;
        const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500";
        return (
          <div key={i} className="flex-1 relative group" title={`${pt.time}: ${pt.used}/${pt.total}`}>
            <div className="w-full bg-muted rounded-t-sm" style={{ height: `${(pt.total / maxVal) * 100}%` }}>
              <div className={cn("w-full rounded-t-sm absolute bottom-0", color)} style={{ height: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
