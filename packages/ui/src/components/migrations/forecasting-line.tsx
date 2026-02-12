"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ForecastPoint {
  time: string;
  actual?: number;
  predicted?: number;
  lower?: number;
  upper?: number;
}

export interface ForecastingLineProps {
  data?: ForecastPoint[];
  title?: string;
  className?: string;
}

/**
 * ForecastingLine - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/ForecastingLine.tsx
 * @migration-status candidate
 * @needs-review Complex forecast visualization with confidence intervals
 */
export function ForecastingLine({ data = [], title, className }: ForecastingLineProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "FORECAST"}</span>
      </div>
      <div className="p-4 min-h-[200px] flex items-center justify-center">
        <div className="text-center text-xs font-mono text-cyan-500/40">
          <div className="text-lg text-cyan-500/20 mb-2">{"\u2248"}</div>
          <div>FORECASTING ENGINE</div>
          <div className="text-[10px] mt-1">{data.length} data points</div>
        </div>
      </div>
    </div>
  );
}
