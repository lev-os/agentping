"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DataMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
}

export interface DataMetricsBoardProps {
  metrics?: DataMetric[];
  title?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * DataMetricsBoard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/DataMetricsBoard.tsx
 * @migration-status candidate
 */
export function DataMetricsBoard({ metrics = [], title, columns = 3, className }: DataMetricsBoardProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      {title && (
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">{title}</div>
      )}
      <div className={cn("grid gap-3", `grid-cols-${columns}`)}>
        {metrics.map((m) => (
          <div key={m.id} className="bg-black/40 rounded border border-cyan-500/10 p-3">
            <div className="text-xs font-mono text-cyan-500/60 uppercase mb-1">{m.label}</div>
            <div className="text-xl font-mono text-cyan-300">
              {m.value}{m.unit && <span className="text-xs text-cyan-500/40 ml-1">{m.unit}</span>}
            </div>
            {m.change !== undefined && (
              <div className={cn("text-xs font-mono mt-1", m.change >= 0 ? "text-green-400" : "text-red-400")}>
                {m.change >= 0 ? "+" : ""}{m.change}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
