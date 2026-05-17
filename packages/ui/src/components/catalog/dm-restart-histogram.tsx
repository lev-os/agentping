"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DmRestartHistogramProps {
  restarts: number;
  className?: string;
}

/**
 * DmRestartHistogram - Catalog component from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/charts/RestartHistogram.tsx
 * @catalog-status candidate
 * @needs-review Original uses recharts BarChart; catalog version uses CSS bar visualization
 */
export function DmRestartHistogram({ restarts, className }: DmRestartHistogramProps) {
  const maxHeight = 160;
  const barHeight = Math.min(maxHeight, Math.max(8, (restarts / 20) * maxHeight));

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <h3 className="text-sm font-semibold text-white/80 mb-4">Restart Count</h3>
      <div className="flex items-end justify-center gap-2" style={{ height: maxHeight }}>
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-16 rounded-t bg-green-500/80 transition-all duration-500"
            style={{ height: barHeight }}
          />
          <span className="text-xs font-mono text-white/50">Total</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <span className="text-2xl font-bold text-green-400 font-mono">{restarts}</span>
        <span className="text-xs text-white/40 ml-1">restarts</span>
      </div>
    </div>
  );
}
