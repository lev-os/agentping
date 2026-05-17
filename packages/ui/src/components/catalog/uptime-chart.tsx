"use client";

/**
 * UptimeChart — Catalog component from Studio
 *
 * Area chart showing dashboard uptime over time.
 * Original depends on recharts; this catalog version provides a pure-CSS
 * visual shell with bar representation.
 *
 * @source packages/studio/src/renderer/components/charts/UptimeChart.tsx
 * @catalog-status needs-review — recharts dependency, runtime data coupling
 * @category chart
 */

import React from "react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types (extracted from source)                                       */
/* ------------------------------------------------------------------ */

export interface UptimeDataPoint {
  timestamp: string;
  uptimeHours: number;
}

export interface UptimeChartProps {
  /** Time-series uptime data */
  data: UptimeDataPoint[];
  /** Chart height in px */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Visual Shell (bar-based sparkline)                                   */
/* ------------------------------------------------------------------ */

export function UptimeChart({
  data,
  height = 300,
  className,
}: UptimeChartProps) {
  const maxUptime = Math.max(...data.map((d) => d.uptimeHours), 1);

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-sm text-zinc-500",
          className,
        )}
        style={{ height }}
      >
        No uptime data available
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Y-axis label */}
      <div className="text-xs text-zinc-500 mb-2">Uptime (hours)</div>

      {/* Chart area */}
      <div
        className="flex items-end gap-px rounded-lg overflow-hidden"
        style={{ height: height - 40 }}
        role="img"
        aria-label="Uptime chart"
      >
        {data.map((point, i) => {
          const pct = (point.uptimeHours / maxUptime) * 100;
          return (
            <div
              key={`${point.timestamp}-${i}`}
              className="flex-1 flex flex-col items-center justify-end"
            >
              <div
                className={cn(
                  "w-full rounded-t-sm transition-all duration-300",
                  "bg-gradient-to-t from-cyan-600/80 to-cyan-400/40",
                )}
                style={{ height: `${Math.max(pct, 2)}%` }}
                title={`${point.timestamp}: ${point.uptimeHours.toFixed(2)}h`}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels (show first, mid, last) */}
      <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
        <span>{data[0]?.timestamp ?? ""}</span>
        {data.length > 2 && (
          <span>{data[Math.floor(data.length / 2)]?.timestamp ?? ""}</span>
        )}
        <span>{data[data.length - 1]?.timestamp ?? ""}</span>
      </div>
    </div>
  );
}
