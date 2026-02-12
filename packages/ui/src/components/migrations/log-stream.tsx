"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

export interface LogStreamProps {
  entries: LogEntry[];
  autoScroll?: boolean;
  maxLines?: number;
  className?: string;
}

const levelColor = { info: "text-blue-400", warn: "text-amber-400", error: "text-red-400", debug: "text-muted-foreground" };

/**
 * LogStream - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LogStream.tsx
 * @migration-status candidate
 */
export function LogStream({ entries, autoScroll = true, maxLines = 200, className }: LogStreamProps) {
  const endRef = React.useRef<HTMLDivElement>(null);
  const visible = entries.slice(-maxLines);

  React.useEffect(() => {
    if (autoScroll) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length, autoScroll]);

  return (
    <div className={cn("font-mono text-xs overflow-auto bg-card border border-border rounded-md p-2 max-h-80", className)}>
      {visible.map((entry) => (
        <div key={entry.id} className="flex gap-2 py-0.5">
          <span className="text-muted-foreground shrink-0">{entry.timestamp}</span>
          <span className={cn("shrink-0 uppercase w-12", levelColor[entry.level])}>[{entry.level}]</span>
          <span className="text-foreground">{entry.message}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
