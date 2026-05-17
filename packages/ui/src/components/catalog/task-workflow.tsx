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

export interface TaskWorkflowStep {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
}

export interface TaskWorkflowProps {
  stages?: WorkflowStage[];
  steps?: TaskWorkflowStep[];
  title?: string;
  description?: string;
  allowNotes?: boolean;
  onComplete?: (completedSteps: string[], notes: Record<string, string>) => void;
  onDismiss?: () => void;
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
 * @catalog-status implemented
 */
export function TaskWorkflow({ stages = [], steps, title, description, allowNotes, onComplete, onDismiss, className }: TaskWorkflowProps) {
  const [checkedSteps, setCheckedSteps] = React.useState<Set<string>>(new Set());
  const [notesText, setNotesText] = React.useState("");

  const toggleStep = (stepId: string) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && <div className="text-sm font-semibold text-foreground">{title}</div>}
          {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
        </div>
      )}

      {steps && steps.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">Steps</div>
          <ul className="flex flex-col gap-1">
            {steps.map((step) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className="flex items-center gap-2 w-full text-left py-1 px-1 rounded hover:bg-cyan-500/5 transition-colors"
                >
                  <span className={cn(
                    "flex items-center justify-center w-4 h-4 rounded border text-[10px]",
                    checkedSteps.has(step.id)
                      ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                      : "border-cyan-500/20 text-transparent",
                  )}>{"\u2713"}</span>
                  <span className={cn(
                    "text-sm transition-all",
                    checkedSteps.has(step.id) ? "text-cyan-500/40 line-through" : "text-cyan-300",
                  )}>{step.label}</span>
                  {step.required && <span className="text-[10px] text-red-400">required</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {allowNotes && (
        <div className="mb-4">
          <textarea
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Add notes..."
            className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-2 text-sm text-cyan-100 font-mono placeholder:text-cyan-500/30 resize-y min-h-[60px]"
          />
        </div>
      )}

      {stages.length > 0 && (
        <>
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
        </>
      )}

      {(onComplete || onDismiss) && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-cyan-500/10">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 text-xs font-mono border border-border text-foreground rounded hover:bg-muted transition-colors"
            >
              Dismiss
            </button>
          )}
          {onComplete && (
            <button
              onClick={() => {
                const notesRecord: Record<string, string> = {};
                if (notesText) notesRecord.general = notesText;
                checkedSteps.forEach((id) => { notesRecord[id] = "completed"; });
                onComplete(Array.from(checkedSteps), notesRecord);
              }}
              className="px-3 py-1.5 text-xs font-mono bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors ml-auto"
            >
              Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
