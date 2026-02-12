"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MetricPoint {
  time: string;
  value: number;
}

export interface MetricChartProps {
  title: string;
  data: MetricPoint[];
  color?: string;
  height?: number;
  className?: string;
}

/**
 * MetricChart - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MetricChart.tsx
 * @migration-status candidate
 */
export function MetricChart({ title, data, color = "var(--primary)", height = 150, className }: MetricChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const current = data[data.length - 1]?.value ?? 0;

  return (
    <div className={cn("border border-border rounded-md bg-card p-4", className)}>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs text-muted-foreground">{title}</span>
        <span className="text-lg font-bold text-foreground">{current}</span>
      </div>
      <div className="flex items-end gap-px" style={{ height }}>
        {data.map((pt, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all hover:opacity-80"
            style={{ height: `${(pt.value / maxVal) * 100}%`, backgroundColor: color, minHeight: 1 }}
            title={`${pt.time}: ${pt.value}`}
          />
        ))}
      </div>
    </div>
  );
}
