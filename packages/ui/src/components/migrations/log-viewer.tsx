"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LogViewerEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

export interface LogViewerProps {
  logs: LogViewerEntry[];
  allowSearch?: boolean;
  className?: string;
}

/**
 * LogViewer - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LogViewer.tsx
 * @migration-status candidate
 */
export function LogViewer({ logs, allowSearch = true, className }: LogViewerProps) {
  const [filter, setFilter] = React.useState("");
  const filtered = filter ? logs.filter((l) => l.message.toLowerCase().includes(filter.toLowerCase())) : logs;

  return (
    <div className={cn("flex flex-col border border-border rounded-md overflow-hidden", className)}>
      {allowSearch && (
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter logs..."
          className="px-3 py-2 text-xs bg-muted/50 border-b border-border text-foreground outline-none placeholder:text-muted-foreground"
        />
      )}
      <div className="font-mono text-xs overflow-auto max-h-72 p-2">
        {filtered.map((entry) => (
          <div key={entry.id} className="flex gap-2 py-0.5">
            <span className="text-muted-foreground shrink-0">{entry.timestamp}</span>
            <span className={cn("shrink-0 w-12", entry.level === "error" ? "text-red-400" : entry.level === "warn" ? "text-amber-400" : "text-muted-foreground")}>
              [{entry.level}]
            </span>
            <span className="text-foreground">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
