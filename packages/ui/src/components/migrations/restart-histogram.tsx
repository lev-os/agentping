"use client";

/**
 * RestartHistogram — Migration candidate from Studio
 *
 * Stacked bar chart showing restart frequency grouped by day.
 * Original depends on recharts; this migration provides the visual shell
 * with stubbed data for Storybook display.
 *
 * @source packages/studio/src/renderer/components/charts/RestartHistogram.tsx
 * @migration-status needs-review — recharts dependency, runtime data coupling
 * @category chart
 */

import React from "react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types (extracted from source)                                       */
/* ------------------------------------------------------------------ */

export interface RestartDayData {
  date: string;
  crashes: number;
  manualRestarts: number;
  healthFailures: number;
  total: number;
}

export interface RestartHistogramProps {
  /** Pre-computed histogram data; original derived from DashboardMetrics */
  data: RestartDayData[];
  /** Chart height in px */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Visual Shell                                                        */
/* ------------------------------------------------------------------ */

const BAR_COLORS = {
  crashes: "bg-red-500",
  healthFailures: "bg-amber-500",
  manualRestarts: "bg-emerald-500",
} as const;

export function RestartHistogram({
  data,
  height = 300,
  className,
}: RestartHistogramProps) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className={cn("w-full", className)}>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
          Crashes
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
          Health Failures
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          Manual Restarts
        </span>
      </div>

      {/* Chart area */}
      <div
        className="flex items-end gap-1.5"
        style={{ height }}
        role="img"
        aria-label="Restart histogram"
      >
        {data.map((day) => {
          const pctCrashes = (day.crashes / maxTotal) * 100;
          const pctHealth = (day.healthFailures / maxTotal) * 100;
          const pctManual = (day.manualRestarts / maxTotal) * 100;

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col-reverse" style={{ height: height - 30 }}>
                <div
                  className={cn(BAR_COLORS.crashes, "w-full rounded-t-sm transition-all")}
                  style={{ height: `${pctCrashes}%` }}
                  title={`Crashes: ${day.crashes}`}
                />
                <div
                  className={cn(BAR_COLORS.healthFailures, "w-full transition-all")}
                  style={{ height: `${pctHealth}%` }}
                  title={`Health Failures: ${day.healthFailures}`}
                />
                <div
                  className={cn(BAR_COLORS.manualRestarts, "w-full rounded-t-sm transition-all")}
                  style={{ height: `${pctManual}%` }}
                  title={`Manual Restarts: ${day.manualRestarts}`}
                />
              </div>
              <span className="text-[10px] text-zinc-500 truncate max-w-full">
                {day.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
