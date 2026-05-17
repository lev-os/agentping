"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StatItem {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export interface StatsGridProps {
  stats?: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * StatsGrid - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/StatsGrid.tsx
 * @catalog-status candidate
 */
export function StatsGrid({ stats = [], columns = 3, className }: StatsGridProps) {
  return (
    <div className={cn("grid gap-3", `grid-cols-${columns}`, className)}>
      {stats.map((s, i) => (
        <div key={i} className="border border-cyan-500/20 bg-black/60 rounded-lg p-3">
          <div className="text-[10px] font-mono text-cyan-500/60 uppercase">{s.label}</div>
          <div className="text-lg font-mono text-cyan-300 mt-1">{s.value}</div>
          {s.change !== undefined && (
            <div className={cn("text-xs font-mono mt-0.5", s.change >= 0 ? "text-green-400" : "text-red-400")}>
              {s.change >= 0 ? "+" : ""}{s.change}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
