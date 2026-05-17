"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface OrderLevel {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookProps {
  bids?: OrderLevel[];
  asks?: OrderLevel[];
  pair?: string;
  className?: string;
}

/**
 * OrderBook - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/OrderBook.tsx
 * @catalog-status candidate
 */
export function OrderBook({ bids = [], asks = [], pair = "BTC/USDT", className }: OrderBookProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">ORDER BOOK</span>
        <span className="text-xs font-mono text-cyan-500/40">{pair}</span>
      </div>
      <div className="grid grid-cols-3 gap-0 px-3 py-1 text-[10px] font-mono text-cyan-500/40 uppercase border-b border-cyan-500/5">
        <span>Price</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>
      <div className="max-h-40 overflow-y-auto">
        {asks.slice().reverse().map((a, i) => (
          <div key={`ask-${i}`} className="grid grid-cols-3 px-3 py-0.5 text-xs font-mono hover:bg-red-500/5">
            <span className="text-red-400">{a.price.toFixed(2)}</span>
            <span className="text-right text-cyan-300/60">{a.amount.toFixed(4)}</span>
            <span className="text-right text-cyan-300/40">{a.total.toFixed(4)}</span>
          </div>
        ))}
      </div>
      <div className="px-3 py-1 border-y border-cyan-500/10 text-center text-xs font-mono text-cyan-400">
        {bids[0]?.price.toFixed(2) || "---"}
      </div>
      <div className="max-h-40 overflow-y-auto">
        {bids.map((b, i) => (
          <div key={`bid-${i}`} className="grid grid-cols-3 px-3 py-0.5 text-xs font-mono hover:bg-green-500/5">
            <span className="text-green-400">{b.price.toFixed(2)}</span>
            <span className="text-right text-cyan-300/60">{b.amount.toFixed(4)}</span>
            <span className="text-right text-cyan-300/40">{b.total.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
