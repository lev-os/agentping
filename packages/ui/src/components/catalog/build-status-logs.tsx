"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface BuildStep {
  id: string;
  name: string;
  status: "pending" | "running" | "success" | "failure" | "skipped";
  duration?: string;
  output?: string;
}

export interface BuildStatusLogsProps {
  steps?: BuildStep[];
  buildId?: string;
  className?: string;
}

/**
 * BuildStatusLogs - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/BuildStatusLogs.tsx
 * @catalog-status candidate
 */
export function BuildStatusLogs({ steps = [], buildId, className }: BuildStatusLogsProps) {
  const statusIcons: Record<string, string> = {
    pending: "\u25CB",
    running: "\u25D4",
    success: "\u2713",
    failure: "\u2717",
    skipped: "\u2212",
  };
  const statusColors: Record<string, string> = {
    pending: "text-zinc-400",
    running: "text-cyan-400 animate-pulse",
    success: "text-green-400",
    failure: "text-red-400",
    skipped: "text-zinc-500",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">BUILD LOG</span>
        {buildId && <span className="text-[10px] font-mono text-cyan-500/40">#{buildId}</span>}
      </div>
      <div className="divide-y divide-cyan-500/5">
        {steps.map((step) => (
          <div key={step.id} className="px-4 py-2 flex items-center gap-3">
            <span className={cn("text-sm", statusColors[step.status])}>{statusIcons[step.status]}</span>
            <span className="text-xs font-mono text-cyan-300 flex-1">{step.name}</span>
            {step.duration && <span className="text-[10px] font-mono text-cyan-500/40">{step.duration}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
