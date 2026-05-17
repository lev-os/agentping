"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Exchange {
  name: string;
  status: "online" | "degraded" | "offline";
  latency?: number;
  pairs?: number;
}

export interface ExchangeStatusProps {
  exchanges?: Exchange[];
  className?: string;
}

/**
 * ExchangeStatus - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/ExchangeStatus.tsx
 * @catalog-status candidate
 */
export function ExchangeStatus({ exchanges = [], className }: ExchangeStatusProps) {
  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    degraded: "bg-yellow-400",
    offline: "bg-red-500",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">EXCHANGE STATUS</span>
      </div>
      <div className="divide-y divide-cyan-500/5">
        {exchanges.map((ex) => (
          <div key={ex.name} className="flex items-center gap-3 px-4 py-2">
            <div className={cn("w-2 h-2 rounded-full", statusColors[ex.status])} />
            <span className="text-xs font-mono text-cyan-300 flex-1">{ex.name}</span>
            {ex.latency !== undefined && <span className="text-[10px] font-mono text-cyan-500/40">{ex.latency}ms</span>}
            {ex.pairs !== undefined && <span className="text-[10px] font-mono text-cyan-500/40">{ex.pairs} pairs</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
