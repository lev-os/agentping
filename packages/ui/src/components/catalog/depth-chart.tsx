"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DepthLevel {
  price: number;
  amount: number;
  total: number;
}

export interface DepthChartProps {
  bids?: DepthLevel[];
  asks?: DepthLevel[];
  title?: string;
  className?: string;
}

/**
 * DepthChart - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/DepthChart.tsx
 * @catalog-status candidate
 * @needs-review Complex SVG area chart
 */
export function DepthChart({ bids = [], asks = [], title, className }: DepthChartProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "DEPTH CHART"}</span>
      </div>
      <div className="p-4 min-h-[200px] flex items-center justify-center">
        <div className="flex gap-8 text-xs font-mono">
          <div className="text-center">
            <div className="text-green-400 mb-1">BIDS</div>
            <div className="text-green-400/60">{bids.length} levels</div>
          </div>
          <div className="w-px bg-cyan-500/20" />
          <div className="text-center">
            <div className="text-red-400 mb-1">ASKS</div>
            <div className="text-red-400/60">{asks.length} levels</div>
          </div>
        </div>
      </div>
    </div>
  );
}
