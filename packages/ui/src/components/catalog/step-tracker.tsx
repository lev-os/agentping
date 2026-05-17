"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Step {
  label: string;
  status: "pending" | "active" | "completed" | "error";
}

export interface StepTrackerProps {
  steps?: Step[];
  className?: string;
}

const statusIcon: Record<Step["status"], string> = {
  pending: "\u25CB",
  active: "\u25CF",
  completed: "\u2713",
  error: "\u2717",
};

const statusColor: Record<Step["status"], string> = {
  pending: "text-cyan-500/30 border-cyan-500/20",
  active: "text-cyan-400 border-cyan-400",
  completed: "text-emerald-400 border-emerald-400",
  error: "text-red-400 border-red-400",
};

const lineColor: Record<Step["status"], string> = {
  pending: "bg-cyan-500/15",
  active: "bg-cyan-400/40",
  completed: "bg-emerald-400/50",
  error: "bg-red-400/50",
};

export function StepTracker({ steps = [], className }: StepTrackerProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono",
        className
      )}
    >
      {steps.length === 0 && (
        <div className="text-xs text-cyan-500/30">No steps defined</div>
      )}
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded-full border text-xs",
                statusColor[step.status]
              )}
            >
              {statusIcon[step.status]}
            </span>
            {i < steps.length - 1 && (
              <div className={cn("w-px h-6 my-1", lineColor[step.status])} />
            )}
          </div>
          <span
            className={cn(
              "text-sm pt-0.5",
              step.status === "active"
                ? "text-cyan-100"
                : step.status === "completed"
                  ? "text-emerald-300/80"
                  : step.status === "error"
                    ? "text-red-300/80"
                    : "text-cyan-500/50"
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
