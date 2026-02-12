"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TraceSpan {
  id: string;
  name: string;
  service: string;
  duration: number;
  start: number;
  status: "ok" | "error" | "timeout";
  children?: TraceSpan[];
}

export interface DistributedTraceProps {
  spans?: TraceSpan[];
  traceId?: string;
  totalDuration?: number;
  className?: string;
}

/**
 * DistributedTrace - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/DistributedTrace.tsx
 * @migration-status candidate
 * @needs-review Complex waterfall trace visualization
 */
export function DistributedTrace({ spans = [], traceId, totalDuration = 1000, className }: DistributedTraceProps) {
  const statusColors: Record<string, string> = { ok: "bg-green-500", error: "bg-red-500", timeout: "bg-yellow-500" };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">DISTRIBUTED TRACE</span>
        {traceId && <span className="text-[10px] font-mono text-cyan-500/40">{traceId}</span>}
      </div>
      <div className="p-3 space-y-1">
        {spans.map((span) => {
          const left = (span.start / totalDuration) * 100;
          const width = Math.max((span.duration / totalDuration) * 100, 1);
          return (
            <div key={span.id} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-500/60 w-20 truncate">{span.service}</span>
              <div className="flex-1 h-4 relative bg-black/40 rounded">
                <div
                  className={cn("absolute h-full rounded", statusColors[span.status] || "bg-cyan-500")}
                  style={{ left: `${left}%`, width: `${width}%`, opacity: 0.8 }}
                />
              </div>
              <span className="text-[10px] font-mono text-cyan-500/40 w-12 text-right">{span.duration}ms</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
