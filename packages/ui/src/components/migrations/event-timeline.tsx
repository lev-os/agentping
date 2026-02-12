"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  type?: "info" | "warning" | "error" | "success";
  source?: string;
}

export interface EventTimelineProps {
  events?: TimelineEvent[];
  title?: string;
  className?: string;
}

/**
 * EventTimeline - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/EventTimeline.tsx
 * @migration-status candidate
 */
export function EventTimeline({ events = [], title, className }: EventTimelineProps) {
  const dotColors: Record<string, string> = {
    info: "bg-cyan-400",
    warning: "bg-yellow-400",
    error: "bg-red-400",
    success: "bg-green-400",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "EVENT TIMELINE"}</span>
      </div>
      <div className="p-4 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn("w-2 h-2 rounded-full mt-1", dotColors[event.type || "info"])} />
              <div className="w-px flex-1 bg-cyan-500/10" />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-300">{event.title}</span>
                <span className="text-[10px] font-mono text-cyan-500/40 ml-auto">{event.timestamp}</span>
              </div>
              {event.description && <div className="text-xs font-mono text-cyan-500/60 mt-0.5">{event.description}</div>}
              {event.source && <div className="text-[10px] font-mono text-cyan-500/30 mt-0.5">{event.source}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
