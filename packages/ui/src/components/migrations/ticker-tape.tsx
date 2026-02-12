"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TickerItem {
  symbol: string;
  price: string;
  change: number;
}

export interface TickerTapeProps {
  items?: TickerItem[];
  speed?: number;
  className?: string;
}

/**
 * TickerTape - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/TickerTape.tsx
 * @migration-status candidate
 */
export function TickerTape({ items = [], speed = 30, className }: TickerTapeProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/80 overflow-hidden", className)}>
      <div
        className="flex gap-6 py-1.5 px-4 animate-[scroll_linear_infinite] whitespace-nowrap"
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono">
            <span className="text-cyan-400 font-bold">{item.symbol}</span>
            <span className="text-cyan-300/80">{item.price}</span>
            <span className={cn(item.change >= 0 ? "text-green-400" : "text-red-400")}>
              {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
