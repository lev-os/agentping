"use client";

/**
 * AgentStatusOverlay — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/AgentStatusOverlay.tsx
 * @migration-status needs-review — runtime coupled (window.coordinator)
 * @category root
 */

import React from "react";
import { Bot, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type OverlayAgentStatus = "idle" | "running" | "error" | "complete";

export interface OverlayAgent {
  sessionId: string;
  name: string;
  status: OverlayAgentStatus;
  currentTask?: string;
  progress?: number;
}

export interface AgentStatusOverlayProps {
  /** List of parallel agents */
  agents: OverlayAgent[];
  /** Close the overlay */
  onClose?: () => void;
  /** Whether the overlay is visible */
  visible?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status config                                                       */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<
  OverlayAgentStatus,
  { icon: React.ReactNode; color: string; label: string }
> = {
  idle: {
    icon: <Bot size={14} />,
    color: "text-zinc-400",
    label: "Idle",
  },
  running: {
    icon: <Loader2 size={14} className="animate-spin" />,
    color: "text-cyan-400",
    label: "Running",
  },
  error: {
    icon: <AlertCircle size={14} />,
    color: "text-red-400",
    label: "Error",
  },
  complete: {
    icon: <CheckCircle size={14} />,
    color: "text-emerald-400",
    label: "Complete",
  },
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function AgentStatusOverlay({
  agents,
  onClose,
  visible = true,
  className,
}: AgentStatusOverlayProps) {
  if (!visible || agents.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-40 w-72",
        "bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl",
        "shadow-xl shadow-black/30",
        "animate-in slide-in-from-right-2 fade-in duration-200",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-cyan-500" />
          <span className="text-xs font-medium text-zinc-300">
            Agent Squad ({agents.length})
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Agent list */}
      <div className="max-h-64 overflow-y-auto py-1">
        {agents.map((agent) => {
          const config = STATUS_CONFIG[agent.status];
          return (
            <div
              key={agent.sessionId}
              className="flex items-start gap-2.5 px-4 py-2"
            >
              <span className={cn("mt-0.5 flex-shrink-0", config.color)}>
                {config.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-300 truncate">
                    {agent.name}
                  </span>
                  <span className={cn("text-[10px]", config.color)}>
                    {config.label}
                  </span>
                </div>
                {agent.currentTask && (
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {agent.currentTask}
                  </p>
                )}
                {agent.progress != null && (
                  <div className="mt-1.5 h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${Math.min(agent.progress, 100)}%` }}
                    />
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
