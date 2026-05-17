"use client";

/**
 * AgentDropdown — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/AgentDropdown.tsx
 * @catalog-status needs-review — runtime coupled (window.coordinator, window.claudeCode)
 * @category root
 */

import React, { useState, useRef, useEffect } from "react";
import { Bot, ChevronDown, Plus, Square, Trash2, Users } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AgentRunStatus = "idle" | "running" | "error" | "stopped";

export interface AgentState {
  sessionId: string;
  name: string;
  status: AgentRunStatus;
  model?: string;
  turnCount?: number;
}

export interface AgentDropdownProps {
  /** List of active agents */
  agents?: AgentState[];
  /** Currently active agent session */
  activeSessionId?: string;
  /** Select an agent session */
  onSelectAgent?: (sessionId: string) => void;
  /** Create a new agent */
  onCreateAgent?: () => void;
  /** Terminate an agent */
  onTerminateAgent?: (sessionId: string) => void;
  /** Stop an agent */
  onStopAgent?: (sessionId: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status styles                                                       */
/* ------------------------------------------------------------------ */

const STATUS_DOT: Record<AgentRunStatus, string> = {
  idle: "bg-zinc-500",
  running: "bg-cyan-500 animate-pulse",
  error: "bg-red-500",
  stopped: "bg-zinc-600",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function AgentDropdown({
  agents = [],
  activeSessionId,
  onSelectAgent,
  onCreateAgent,
  onTerminateAgent,
  onStopAgent,
  className,
}: AgentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const runningCount = agents.filter((a) => a.status === "running").length;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg",
          "bg-zinc-800/50 border border-zinc-700/50",
          "text-sm text-zinc-200 hover:border-zinc-600/50",
          "transition-colors",
        )}
      >
        <Users size={14} className="text-cyan-400" />
        <span>{agents.length} Agent{agents.length !== 1 ? "s" : ""}</span>
        {runningCount > 0 && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400">
            {runningCount} running
          </span>
        )}
        <ChevronDown
          size={12}
          className={cn("text-zinc-500 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 top-full mt-1 z-50 w-72",
            "bg-zinc-900 border border-zinc-700/50 rounded-xl",
            "shadow-xl shadow-black/30",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          )}
        >
          {/* Agent list */}
          <div className="max-h-64 overflow-y-auto py-1">
            {agents.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-500">
                No agents active
              </div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.sessionId}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 cursor-pointer",
                    "hover:bg-white/[0.03] transition-colors",
                    agent.sessionId === activeSessionId && "bg-cyan-500/5",
                  )}
                  onClick={() => {
                    onSelectAgent?.(agent.sessionId);
                    setIsOpen(false);
                  }}
                >
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", STATUS_DOT[agent.status])} />
                  <Bot size={14} className="text-zinc-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-300 truncate">{agent.name}</div>
                    {agent.model && (
                      <div className="text-[10px] text-zinc-600">{agent.model}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {agent.status === "running" && onStopAgent && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onStopAgent(agent.sessionId); }}
                        className="p-1 text-zinc-500 hover:text-amber-400"
                        title="Stop"
                      >
                        <Square size={10} />
                      </button>
                    )}
                    {onTerminateAgent && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onTerminateAgent(agent.sessionId); }}
                        className="p-1 text-zinc-500 hover:text-red-400"
                        title="Terminate"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {onCreateAgent && (
            <div className="border-t border-zinc-800 p-1">
              <button
                onClick={() => { onCreateAgent(); setIsOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg",
                  "text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]",
                  "transition-colors",
                )}
              >
                <Plus size={12} className="text-cyan-500" />
                New Agent
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
