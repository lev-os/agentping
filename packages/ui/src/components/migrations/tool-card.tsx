"use client";

/**
 * ToolCard — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/chat/ToolCard.tsx
 * @migration-status needs-review — runtime coupled (tool approval flow)
 * @category chat
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Terminal,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ToolStatus = "pending" | "running" | "success" | "error" | "rejected";

export interface ToolInfo {
  id: string;
  name: string;
  input?: Record<string, unknown>;
  result?: string;
  status: ToolStatus;
  duration?: number;
}

export interface ToolCardProps {
  tool: ToolInfo;
  /** Approve pending tool use */
  onApprove?: (toolId: string) => void;
  /** Reject pending tool use */
  onReject?: (toolId: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status config                                                       */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  ToolStatus,
  { icon: React.ReactNode; label: string; color: string }
> = {
  pending: {
    icon: <Clock size={14} />,
    label: "Pending",
    color: "text-amber-400",
  },
  running: {
    icon: <Loader2 size={14} className="animate-spin" />,
    label: "Running",
    color: "text-cyan-400",
  },
  success: {
    icon: <CheckCircle size={14} />,
    label: "Success",
    color: "text-emerald-400",
  },
  error: {
    icon: <XCircle size={14} />,
    label: "Error",
    color: "text-red-400",
  },
  rejected: {
    icon: <XCircle size={14} />,
    label: "Rejected",
    color: "text-zinc-500",
  },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ToolCard({
  tool,
  onApprove,
  onReject,
  className,
}: ToolCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[tool.status];

  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-800 bg-zinc-900/50",
        "overflow-hidden transition-colors",
        tool.status === "pending" && "border-amber-500/20",
        className,
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2",
          "text-sm text-left hover:bg-white/[0.02] transition-colors",
        )}
      >
        {expanded ? (
          <ChevronDown size={12} className="text-zinc-500" />
        ) : (
          <ChevronRight size={12} className="text-zinc-500" />
        )}

        <Terminal size={12} className="text-zinc-500" />
        <span className="font-mono text-xs text-cyan-400">{tool.name}</span>

        <span className={cn("ml-auto flex items-center gap-1", config.color)}>
          {config.icon}
          <span className="text-[10px]">{config.label}</span>
        </span>

        {tool.duration != null && (
          <span className="text-[10px] text-zinc-600 ml-1">
            {tool.duration}ms
          </span>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-800 px-3 py-2 space-y-2">
          {/* Input */}
          {tool.input && (
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Input
              </span>
              <pre className="mt-1 text-xs text-zinc-400 bg-zinc-950/50 rounded p-2 overflow-x-auto">
                {JSON.stringify(tool.input, null, 2)}
              </pre>
            </div>
          )}

          {/* Result */}
          {tool.result && (
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Result
              </span>
              <pre className="mt-1 text-xs text-zinc-400 bg-zinc-950/50 rounded p-2 overflow-x-auto max-h-40">
                {tool.result}
              </pre>
            </div>
          )}

          {/* Approval actions */}
          {tool.status === "pending" && (onApprove || onReject) && (
            <div className="flex items-center gap-2 pt-1">
              {onApprove && (
                <button
                  onClick={() => onApprove(tool.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium",
                    "bg-emerald-600/20 text-emerald-400",
                    "hover:bg-emerald-600/30 transition-colors",
                  )}
                >
                  Approve
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(tool.id)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium",
                    "bg-red-600/20 text-red-400",
                    "hover:bg-red-600/30 transition-colors",
                  )}
                >
                  Reject
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
