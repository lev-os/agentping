"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Trade {
  id: string;
  price: number;
  amount: number;
  side: "buy" | "sell";
  time: string;
}

export interface TradeHistoryProps {
  trades?: Trade[];
  pair?: string;
  className?: string;
}

/**
 * TradeHistory - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/TradeHistory.tsx
 * @migration-status candidate
 */
export function TradeHistory({ trades = [], pair = "BTC/USDT", className }: TradeHistoryProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">TRADE HISTORY</span>
        <span className="text-xs font-mono text-cyan-500/40">{pair}</span>
      </div>
      <div className="grid grid-cols-3 px-3 py-1 text-[10px] font-mono text-cyan-500/40 uppercase border-b border-cyan-500/5">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {trades.map((t) => (
          <div key={t.id} className="grid grid-cols-3 px-3 py-0.5 text-xs font-mono hover:bg-cyan-500/5">
            <span className={cn(t.side === "buy" ? "text-green-400" : "text-red-400")}>{t.price.toFixed(2)}</span>
            <span className="text-right text-cyan-300/60">{t.amount.toFixed(4)}</span>
            <span className="text-right text-cyan-500/40">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
