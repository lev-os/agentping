"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Task {
  id: string;
  title: string;
  status: "queued" | "running" | "done" | "failed";
  priority?: number;
}

export interface TaskQueueProps {
  tasks?: Task[];
  className?: string;
}

const statusBadge: Record<Task["status"], string> = {
  queued: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  running: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  done: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/10 text-red-400 border-red-500/30",
};

const priorityLabel = (p?: number) => {
  if (p === undefined) return null;
  if (p >= 8) return { text: "P0", cls: "text-red-400" };
  if (p >= 5) return { text: "P1", cls: "text-amber-400" };
  return { text: "P2", cls: "text-cyan-500/50" };
};

export function TaskQueue({ tasks = [], className }: TaskQueueProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg font-mono divide-y divide-cyan-500/10",
        className
      )}
    >
      {tasks.length === 0 && (
        <div className="p-4 text-xs text-cyan-500/30">Queue empty</div>
      )}
      {tasks.map((task) => {
        const pri = priorityLabel(task.priority);
        return (
          <div
            key={task.id}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-cyan-500/5 transition-colors"
          >
            {pri && (
              <span className={cn("text-[10px] font-bold w-6", pri.cls)}>
                {pri.text}
              </span>
            )}
            <span className="flex-1 text-sm text-cyan-100 truncate">
              {task.title}
            </span>
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider",
                statusBadge[task.status]
              )}
            >
              {task.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}
