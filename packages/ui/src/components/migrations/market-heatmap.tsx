"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MarketCell {
  symbol: string;
  change: number;
  volume?: number;
}

export interface MarketHeatmapProps {
  cells?: MarketCell[];
  title?: string;
  className?: string;
}

/**
 * MarketHeatmap - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/MarketHeatmap.tsx
 * @migration-status candidate
 */
export function MarketHeatmap({ cells = [], title, className }: MarketHeatmapProps) {
  const getColor = (change: number) => {
    if (change > 5) return "bg-green-600";
    if (change > 2) return "bg-green-700";
    if (change > 0) return "bg-green-900";
    if (change > -2) return "bg-red-900";
    if (change > -5) return "bg-red-700";
    return "bg-red-600";
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "MARKET HEATMAP"}</span>
      </div>
      <div className="p-3 grid grid-cols-4 gap-1">
        {cells.map((cell) => (
          <div key={cell.symbol} className={cn("rounded p-2 text-center", getColor(cell.change))}>
            <div className="text-xs font-mono text-white font-bold">{cell.symbol}</div>
            <div className="text-[10px] font-mono text-white/80">{cell.change > 0 ? "+" : ""}{cell.change.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
