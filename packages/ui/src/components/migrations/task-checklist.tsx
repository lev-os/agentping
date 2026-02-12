"use client";

/**
 * TaskChecklist — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/TaskChecklist.tsx
 * @migration-status needs-review — runtime coupled (window.coordinator, window.agentPing)
 * @category root
 */

import React from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type TaskStepStatus =
  | "pending"
  | "in_progress"
  | "complete"
  | "failed"
  | "waiting_approval";

export interface TaskStep {
  id: string;
  title: string;
  description?: string;
  status: TaskStepStatus;
  agent?: string;
}

export interface TaskChecklistProps {
  /** Task steps */
  steps: TaskStep[];
  /** Approve a step waiting for approval */
  onApproveStep?: (stepId: string) => void;
  /** Reject a step */
  onRejectStep?: (stepId: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status config                                                       */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  TaskStepStatus,
  { icon: React.ReactNode; color: string }
> = {
  pending: { icon: <Circle size={16} />, color: "text-zinc-500" },
  in_progress: {
    icon: <Loader2 size={16} className="animate-spin" />,
    color: "text-cyan-400",
  },
  complete: { icon: <CheckCircle size={16} />, color: "text-emerald-400" },
  failed: { icon: <AlertCircle size={16} />, color: "text-red-400" },
  waiting_approval: { icon: <Clock size={16} />, color: "text-amber-400" },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function TaskChecklist({
  steps,
  onApproveStep,
  onRejectStep,
  className,
}: TaskChecklistProps) {
  const completedCount = steps.filter((s) => s.status === "complete").length;

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-zinc-300">
          Task Progress
        </span>
        <span className="text-xs text-zinc-500">
          {completedCount}/{steps.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
          style={{
            width: `${steps.length > 0 ? (completedCount / steps.length) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const config = STATUS_CONFIG[step.status];
          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-3 px-3 py-2 rounded-lg",
                "transition-colors",
                step.status === "waiting_approval" && "bg-amber-500/5",
              )}
            >
              {/* Step number + connector */}
              <div className="flex flex-col items-center">
                <span className={cn("flex-shrink-0", config.color)}>
                  {config.icon}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-px h-full min-h-[16px] bg-zinc-800 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm",
                      step.status === "complete"
                        ? "text-zinc-500 line-through"
                        : "text-zinc-300",
                    )}
                  >
                    {step.title}
                  </span>
                  {step.agent && (
                    <span className="text-[10px] text-zinc-600 bg-zinc-800/50 px-1.5 rounded">
                      {step.agent}
                    </span>
                  )}
                </div>

                {step.description && (
                  <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
                )}

                {/* Approval actions */}
                {step.status === "waiting_approval" && (
                  <div className="flex items-center gap-2 mt-2">
                    {onApproveStep && (
                      <button
                        onClick={() => onApproveStep(step.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {onRejectStep && (
                      <button
                        onClick={() => onRejectStep(step.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
