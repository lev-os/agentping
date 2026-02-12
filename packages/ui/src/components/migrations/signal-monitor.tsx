"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SignalChannel {
  id: string;
  name: string;
  frequency: string;
  strength: number;
  active: boolean;
}

export interface SignalMonitorProps {
  channels?: SignalChannel[];
  className?: string;
}

/**
 * SignalMonitor - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/SignalMonitor.tsx
 * @migration-status candidate
 */
export function SignalMonitor({ channels = [], className }: SignalMonitorProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">SIGNAL MONITOR</span>
      </div>
      <div className="p-3 space-y-2">
        {channels.map((ch) => (
          <div key={ch.id} className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full", ch.active ? "bg-green-500 animate-pulse" : "bg-zinc-600")} />
            <span className="text-xs font-mono text-cyan-300 w-24 truncate">{ch.name}</span>
            <span className="text-[10px] font-mono text-cyan-500/40 w-16">{ch.frequency}</span>
            <div className="flex-1 h-1.5 bg-black/40 rounded-full">
              <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${ch.strength}%` }} />
            </div>
            <span className="text-[10px] font-mono text-cyan-500/40 w-8 text-right">{ch.strength}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
