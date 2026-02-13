"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  status?: string;
}

export interface HistoryViewProps {
  entries?: HistoryEntry[];
  onSelectEntry?: (entry: HistoryEntry) => void;
  onSelectPing?: (entry: HistoryEntry) => void;
  className?: string;
}

/**
 * HistoryView - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/HistoryView.tsx
 * @migration-status candidate
 * @needs-review Original depends on @agentping/core Ping type and PingCard component. Simplified.
 */
export function HistoryView({ entries = [], onSelectEntry, onSelectPing, className }: HistoryViewProps) {
  const handleSelect = onSelectPing ?? onSelectEntry;
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => handleSelect?.(entry)}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left w-full"
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground truncate">{entry.title}</div>
            <div className="text-xs text-muted-foreground">{entry.timestamp}</div>
          </div>
          {entry.status && <span className="text-xs text-muted-foreground shrink-0">{entry.status}</span>}
        </button>
      ))}
      {entries.length === 0 && <div className="text-sm text-muted-foreground text-center py-4">No history</div>}
    </div>
  );
}
