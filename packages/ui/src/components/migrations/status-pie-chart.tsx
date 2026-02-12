"use client";

/**
 * StatusPieChart — Migration candidate from Studio
 *
 * Pie chart showing distribution of dashboard statuses.
 * Original depends on recharts; this migration provides a pure-CSS
 * visual shell with conic-gradient rendering.
 *
 * @source packages/studio/src/renderer/components/charts/StatusPieChart.tsx
 * @migration-status needs-review — recharts dependency, runtime data coupling
 * @category chart
 */

import React from "react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types (extracted from source)                                       */
/* ------------------------------------------------------------------ */

export interface StatusPieData {
  name: string;
  value: number;
  color: string;
}

export interface StatusPieChartProps {
  /** Pie chart data slices */
  data: StatusPieData[];
  /** Chart height in px */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Visual Shell (conic-gradient approach)                               */
/* ------------------------------------------------------------------ */

export function StatusPieChart({
  data,
  height = 300,
  className,
}: StatusPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-sm text-zinc-500",
          className,
        )}
        style={{ height }}
      >
        No dashboard data available
      </div>
    );
  }

  // Build conic-gradient stops
  let cumulative = 0;
  const stops = data.flatMap((d) => {
    const start = cumulative;
    const pct = (d.value / total) * 100;
    cumulative += pct;
    return [`${d.color} ${start}%`, `${d.color} ${cumulative}%`];
  });

  return (
    <div className={cn("flex items-center gap-8", className)} style={{ height }}>
      {/* Donut chart */}
      <div
        className="relative rounded-full flex-shrink-0"
        style={{
          width: height * 0.6,
          height: height * 0.6,
          background: `conic-gradient(${stops.join(", ")})`,
        }}
        role="img"
        aria-label="Status distribution pie chart"
      >
        {/* Inner hole for donut effect */}
        <div className="absolute inset-[25%] rounded-full bg-zinc-900" />
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-zinc-100">{total}</span>
          <span className="text-xs text-zinc-500">total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map((d) => {
          const pct = ((d.value / total) * 100).toFixed(1);
          return (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-zinc-300">
                {d.name}: {d.value}
              </span>
              <span className="text-zinc-500">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
