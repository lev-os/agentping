"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ToolInvocationProps {
  name?: string;
  args?: Record<string, unknown>;
  result?: unknown;
  status?: "pending" | "running" | "success" | "error";
  duration?: number;
  className?: string;
}

const statusBadge: Record<string, string> = {
  pending: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  running: "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  error: "bg-red-500/10 text-red-400 border-red-500/30",
};

export function ToolInvocation({
  name = "unknown",
  args,
  result,
  status = "pending",
  duration,
  className,
}: ToolInvocationProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg font-mono",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-cyan-500/5 transition-colors text-left"
      >
        <span className="text-cyan-500/40 text-xs">{expanded ? "\u25BE" : "\u25B8"}</span>
        <span className="text-sm text-cyan-100 flex-1 truncate">{name}</span>
        <span
          className={cn(
            "text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider",
            statusBadge[status]
          )}
        >
          {status}
        </span>
        {duration !== undefined && (
          <span className="text-[10px] text-cyan-500/40">{duration}ms</span>
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-cyan-500/10 pt-2">
          {args && Object.keys(args).length > 0 && (
            <div>
              <div className="text-[10px] text-cyan-500/50 uppercase tracking-wider mb-1">
                Args
              </div>
              <pre className="text-xs text-cyan-300/80 bg-black/40 rounded p-2 overflow-x-auto max-h-32">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}
          {result !== undefined && (
            <div>
              <div className="text-[10px] text-cyan-500/50 uppercase tracking-wider mb-1">
                Result
              </div>
              <pre className="text-xs text-emerald-300/80 bg-black/40 rounded p-2 overflow-x-auto max-h-32">
                {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
