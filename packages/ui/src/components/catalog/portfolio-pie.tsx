"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PortfolioAsset {
  name: string;
  symbol: string;
  allocation: number;
  value?: string;
  color?: string;
}

export interface PortfolioPieProps {
  assets?: PortfolioAsset[];
  totalValue?: string;
  className?: string;
}

const defaultColors = ["#00e5ff", "#7c3aed", "#22c55e", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"];

/**
 * PortfolioPie - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/PortfolioPie.tsx
 * @catalog-status candidate
 * @needs-review SVG pie chart rendering
 */
export function PortfolioPie({ assets = [], totalValue, className }: PortfolioPieProps) {
  let cumulative = 0;
  const segments = assets.map((a, i) => {
    const start = cumulative;
    cumulative += a.allocation;
    return { ...a, start, color: a.color || defaultColors[i % defaultColors.length] };
  });

  const toArc = (start: number, end: number) => {
    const s = (start / 100) * Math.PI * 2 - Math.PI / 2;
    const e = (end / 100) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > 50 ? 1 : 0;
    return `M ${50 + 40 * Math.cos(s)} ${50 + 40 * Math.sin(s)} A 40 40 0 ${large} 1 ${50 + 40 * Math.cos(e)} ${50 + 40 * Math.sin(e)}`;
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">PORTFOLIO</div>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((seg, i) => (
              <path key={i} d={toArc(seg.start, seg.start + seg.allocation)} fill="none" stroke={seg.color} strokeWidth="8" />
            ))}
          </svg>
          {totalValue && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono text-cyan-300">{totalValue}</span>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          {assets.map((a, i) => (
            <div key={a.symbol} className="flex items-center gap-2 text-xs font-mono">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color || defaultColors[i % defaultColors.length] }} />
              <span className="text-cyan-300">{a.symbol}</span>
              <span className="text-cyan-500/40 ml-auto">{a.allocation}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
