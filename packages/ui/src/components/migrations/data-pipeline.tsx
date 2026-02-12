"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PipelineStage {
  id: string;
  name: string;
  status: "idle" | "running" | "success" | "error";
  throughput?: string;
}

export interface DataPipelineProps {
  stages?: PipelineStage[];
  title?: string;
  className?: string;
}

/**
 * DataPipeline - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/DataPipeline.tsx
 * @migration-status candidate
 * @needs-review Complex pipeline visualization
 */
export function DataPipeline({ stages = [], title, className }: DataPipelineProps) {
  const stageColors: Record<string, string> = {
    idle: "border-zinc-600 text-zinc-400",
    running: "border-cyan-500 text-cyan-400 animate-pulse",
    success: "border-green-500 text-green-400",
    error: "border-red-500 text-red-400",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">{title || "DATA PIPELINE"}</div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {stages.map((stage, i) => (
          <React.Fragment key={stage.id}>
            {i > 0 && <div className="text-cyan-500/30 font-mono">{"\u2192"}</div>}
            <div className={cn("border rounded px-3 py-2 min-w-[120px] text-center", stageColors[stage.status])}>
              <div className="text-xs font-mono uppercase">{stage.name}</div>
              {stage.throughput && <div className="text-[10px] font-mono opacity-60 mt-1">{stage.throughput}</div>}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
