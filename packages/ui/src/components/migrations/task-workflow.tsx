"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface WorkflowTask {
  title: string;
  done: boolean;
}

export interface WorkflowStage {
  id: string;
  label: string;
  status: "pending" | "active" | "completed" | "failed";
  tasks: WorkflowTask[];
}

export interface TaskWorkflowProps {
  stages: WorkflowStage[];
  className?: string;
}

const STATUS_STYLE: Record<WorkflowStage["status"], { border: string; bg: string; dot: string; text: string }> = {
  pending: { border: "border-gray-500/20", bg: "bg-gray-500/5", dot: "bg-gray-500", text: "text-gray-400" },
  active: { border: "border-cyan-500/30", bg: "bg-cyan-500/5", dot: "bg-cyan-400", text: "text-cyan-300" },
  completed: { border: "border-green-500/30", bg: "bg-green-500/5", dot: "bg-green-400", text: "text-green-300" },
  failed: { border: "border-red-500/30", bg: "bg-red-500/5", dot: "bg-red-400", text: "text-red-300" },
};

/**
 * TaskWorkflow - Multi-stage pipeline with checklists
 * @source packages/adapters/web-ui/src/components/TaskWorkflow.tsx
 * @migration-status implemented
 */
export function TaskWorkflow({ stages, className }: TaskWorkflowProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4">
        Workflow Pipeline
      </div>

      <div className="flex gap-0 overflow-x-auto pb-2">
        {stages.map((stage, i) => {
          const style = STATUS_STYLE[stage.status];
          const doneCount = stage.tasks.filter((t) => t.done).length;
          return (
            <React.Fragment key={stage.id}>
              {i > 0 && (
                <div className="flex items-center px-1 flex-shrink-0">
                  <div className="w-6 h-px bg-cyan-500/20" />
                  <div className="text-cyan-500/30 text-[10px] font-mono">&#9654;</div>
                </div>
              )}
              <div className={cn("flex-shrink-0 w-48 rounded-lg border p-3", style.border, style.bg)}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-2 h-2 rounded-full", style.dot)} />
                  <span className={cn("text-xs font-mono font-semibold truncate", style.text)}>
                    {stage.label}
                  </span>
                </div>

                <div className="text-[9px] font-mono text-cyan-500/40 mb-2">
                  {doneCount}/{stage.tasks.length} tasks
                </div>

                <div className="space-y-1">
                  {stage.tasks.map((task, j) => (
                    <div key={j} className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0",
                        task.done
                          ? "border-green-500/40 bg-green-500/10"
                          : "border-cyan-500/10 bg-transparent"
                      )}>
                        {task.done && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3 5.5L6.5 2" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={cn(
                        "text-[10px] font-mono truncate",
                        task.done ? "text-gray-500 line-through" : "text-gray-300"
                      )}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
