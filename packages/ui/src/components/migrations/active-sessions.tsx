"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface Session {
  id: string;
  user: string;
  ip: string;
  duration: string;
  device: string;
  status: "active" | "idle";
}

export interface ActiveSessionsProps {
  sessions: Session[];
  className?: string;
  onTerminate?: (sessionId: string) => void;
}

/**
 * ActiveSessions - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ActiveSessions.tsx
 * @migration-status candidate
 */
export function ActiveSessions({ sessions, className, onTerminate }: ActiveSessionsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {sessions.map((session) => (
        <div key={session.id} className="flex items-center gap-3 px-3 py-2 rounded-md bg-card border border-border">
          <div
            className={cn(
              "h-2 w-2 rounded-full shrink-0",
              session.status === "active" ? "bg-emerald-500" : "bg-amber-500"
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{session.user}</div>
            <div className="text-xs text-muted-foreground truncate">
              {session.ip} &bull; {session.device}
            </div>
          </div>
          <div className="text-xs text-muted-foreground shrink-0">{session.duration}</div>
          <button
            className="text-muted-foreground hover:text-destructive text-lg leading-none shrink-0"
            title="Terminate Session"
            onClick={() => onTerminate?.(session.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
