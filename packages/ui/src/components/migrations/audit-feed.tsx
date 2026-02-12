"use client";

/**
 * AuditFeed — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/AuditFeed.tsx
 * @migration-status complete
 * @category root
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  Shield,
  Terminal,
  XCircle,
  Filter,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type EventType =
  | "tool_use"
  | "message"
  | "error"
  | "approval"
  | "file_change"
  | "system"
  | "security";

export interface AuditEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  timestamp: Date;
  severity?: "info" | "warning" | "error";
  metadata?: Record<string, unknown>;
}

export interface AuditFeedProps {
  events: AuditEvent[];
  maxEvents?: number;
  autoScroll?: boolean;
  showFilter?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Event config                                                        */
/* ------------------------------------------------------------------ */

const EVENT_ICONS: Record<EventType, React.ReactNode> = {
  tool_use: <Terminal size={14} />,
  message: <MessageSquare size={14} />,
  error: <XCircle size={14} />,
  approval: <CheckCircle size={14} />,
  file_change: <FileText size={14} />,
  system: <Activity size={14} />,
  security: <Shield size={14} />,
};

const EVENT_COLORS: Record<EventType, string> = {
  tool_use: "text-cyan-400",
  message: "text-blue-400",
  error: "text-red-400",
  approval: "text-emerald-400",
  file_change: "text-amber-400",
  system: "text-zinc-400",
  security: "text-purple-400",
};

/* ------------------------------------------------------------------ */
/* Relative time                                                       */
/* ------------------------------------------------------------------ */

function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function AuditFeed({
  events,
  maxEvents = 100,
  autoScroll = true,
  showFilter = true,
  className,
}: AuditFeedProps) {
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set());
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredEvents =
    activeFilters.size === 0
      ? events.slice(0, maxEvents)
      : events.filter((e) => activeFilters.has(e.type)).slice(0, maxEvents);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredEvents.length, autoScroll]);

  const toggleFilter = (type: EventType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const allTypes: EventType[] = [
    "tool_use",
    "message",
    "error",
    "approval",
    "file_change",
    "system",
    "security",
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-cyan-500" />
          <span className="text-xs font-medium text-zinc-300">Activity Feed</span>
          <span className="text-[10px] text-zinc-600">
            {filteredEvents.length} events
          </span>
        </div>

        {showFilter && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={cn(
              "p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors",
              showFilterPanel && "text-cyan-400",
            )}
            aria-label="Toggle filters"
          >
            <Filter size={12} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilterPanel && (
        <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-zinc-800">
          {allTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded text-[10px]",
                "border transition-colors",
                activeFilters.has(type)
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                  : "border-zinc-700/30 text-zinc-500 hover:text-zinc-300",
              )}
            >
              {EVENT_ICONS[type]}
              {type.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {/* Event list */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
            <Activity size={24} className="mb-2" />
            <span className="text-xs">No events to display</span>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={cn(
                "flex gap-2.5 px-3 py-2",
                "border-b border-zinc-800/50",
                "hover:bg-white/[0.01] transition-colors",
              )}
            >
              <span className={cn("mt-0.5 flex-shrink-0", EVENT_COLORS[event.type])}>
                {EVENT_ICONS[event.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-300 truncate">
                    {event.title}
                  </span>
                  <span className="text-[10px] text-zinc-600 flex-shrink-0">
                    {relativeTime(event.timestamp)}
                  </span>
                </div>
                {event.description && (
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
