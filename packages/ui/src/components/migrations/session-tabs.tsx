"use client";

/**
 * SessionTabs — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/chat/SessionTabs.tsx
 * @migration-status needs-review — runtime coupled (agent state)
 * @category chat
 */

import React, { useState } from "react";
import { Plus, X, MessageSquare, Bot } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type AgentStatus = "idle" | "running" | "error" | "waiting";

export interface SessionAgent {
  sessionId: string;
  name?: string;
  status: AgentStatus;
}

export interface SessionTabsProps {
  /** Available agents/sessions */
  agents: SessionAgent[];
  /** Currently active session id */
  activeSession?: string;
  /** Session display names */
  sessionNames?: Record<string, string>;
  /** Tab select handler */
  onSelectSession?: (sessionId: string) => void;
  /** New session handler */
  onNewSession?: () => void;
  /** Close session handler */
  onCloseSession?: (sessionId: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Status indicator                                                    */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<AgentStatus, string> = {
  idle: "bg-zinc-500",
  running: "bg-cyan-500 animate-pulse",
  error: "bg-red-500",
  waiting: "bg-amber-500 animate-pulse",
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function SessionTabs({
  agents,
  activeSession,
  sessionNames = {},
  onSelectSession,
  onNewSession,
  onCloseSession,
  className,
}: SessionTabsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 px-2 py-1",
        "border-b border-zinc-800 bg-zinc-900/30",
        "overflow-x-auto scrollbar-none",
        className,
      )}
      role="tablist"
    >
      {agents.map((agent) => {
        const isActive = agent.sessionId === activeSession;
        const name =
          sessionNames[agent.sessionId] ?? agent.name ?? agent.sessionId;

        return (
          <div
            key={agent.sessionId}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "group flex items-center gap-1.5 px-3 py-1.5 rounded-md",
              "text-xs cursor-pointer transition-all duration-150",
              "max-w-[160px]",
              isActive
                ? "bg-zinc-800 text-zinc-200 border border-zinc-700/50"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]",
            )}
            onClick={() => onSelectSession?.(agent.sessionId)}
          >
            {/* Status dot */}
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0",
                STATUS_STYLES[agent.status],
              )}
            />

            {/* Icon */}
            {agent.status === "running" ? (
              <Bot size={12} className="text-cyan-400 flex-shrink-0" />
            ) : (
              <MessageSquare size={12} className="flex-shrink-0" />
            )}

            {/* Name */}
            <span className="truncate">{name}</span>

            {/* Close button */}
            {onCloseSession && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseSession(agent.sessionId);
                }}
                className={cn(
                  "ml-auto p-0.5 rounded",
                  "opacity-0 group-hover:opacity-100",
                  "text-zinc-500 hover:text-zinc-300 hover:bg-white/5",
                  "transition-all",
                )}
                aria-label={`Close ${name}`}
              >
                <X size={10} />
              </button>
            )}
          </div>
        );
      })}

      {/* New session button */}
      {onNewSession && (
        <button
          onClick={onNewSession}
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 rounded-md",
            "text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]",
            "transition-colors",
          )}
          aria-label="New session"
        >
          <Plus size={12} />
        </button>
      )}
    </div>
  );
}
