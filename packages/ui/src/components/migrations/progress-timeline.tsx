"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProgressStep {
  id: string;
  label: string;
  status: "completed" | "active" | "pending";
  description?: string;
}

export interface ProgressTimelineProps {
  steps?: ProgressStep[];
  className?: string;
}

/**
 * ProgressTimeline - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ProgressTimeline.tsx
 * @migration-status candidate
 */
export function ProgressTimeline({ steps = [], className }: ProgressTimelineProps) {
  const statusStyles: Record<string, { dot: string; text: string }> = {
    completed: { dot: "bg-green-500 border-green-500", text: "text-green-400" },
    active: { dot: "bg-cyan-400 border-cyan-400 animate-pulse", text: "text-cyan-300" },
    pending: { dot: "bg-transparent border-cyan-500/30", text: "text-cyan-500/40" },
  };

  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, i) => {
        const s = statusStyles[step.status];
        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("w-3 h-3 rounded-full border-2", s.dot)} />
              {i < steps.length - 1 && <div className="w-px flex-1 min-h-[24px] bg-cyan-500/10" />}
            </div>
            <div className="pb-4">
              <div className={cn("text-xs font-mono", s.text)}>{step.label}</div>
              {step.description && <div className="text-[10px] font-mono text-cyan-500/30 mt-0.5">{step.description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
