"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AssetCardProps {
  symbol?: string;
  name?: string;
  price?: string;
  change?: number;
  icon?: string;
  sparklineData?: number[];
  className?: string;
}

function sparklinePath(points: number[]): string {
  if (points.length < 2) {
    return "M0,25 L10,20 L20,22 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,5";
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 29 - ((point - min) / range) * 28;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

/**
 * AssetCard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/AssetCard.tsx
 * @migration-status candidate
 */
export function AssetCard({ symbol = "BTC", name = "Bitcoin", price = "$68,492.10", change = 4.2, icon = "\u20BF", sparklineData, className }: AssetCardProps) {
  const isUp = change >= 0;
  const sparkline = sparklinePath(sparklineData ?? []);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4 w-64", className)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm">
          {icon}
        </div>
        <div>
          <div className="text-xs font-mono text-cyan-300">{name}</div>
          <div className="text-[10px] font-mono text-cyan-500/40">{symbol}</div>
        </div>
      </div>
      <div className="h-8 mb-3">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
          <path d={sparkline} fill="none" stroke={isUp ? "#00e5ff" : "#ef4444"} strokeWidth="2" />
        </svg>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-sm font-mono text-cyan-300">{price}</div>
        <div className={cn("text-xs font-mono", isUp ? "text-green-400" : "text-red-400")}>
          {isUp ? "+" : ""}{change}%
        </div>
      </div>
    </div>
  );
}
