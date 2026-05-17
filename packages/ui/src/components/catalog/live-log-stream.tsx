"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LogLine {
  id: string;
  timestamp: string;
  level: "debug" | "info" | "warn" | "error" | "fatal";
  message: string;
  source?: string;
}

export interface LiveLogStreamProps {
  lines?: LogLine[];
  maxLines?: number;
  autoScroll?: boolean;
  className?: string;
}

/**
 * LiveLogStream - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/LiveLogStream.tsx
 * @catalog-status candidate
 */
export function LiveLogStream({ lines = [], maxLines = 100, autoScroll = true, className }: LiveLogStreamProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const displayLines = lines.slice(-maxLines);

  const levelColors: Record<string, string> = {
    debug: "text-zinc-400",
    info: "text-cyan-400",
    warn: "text-yellow-400",
    error: "text-red-400",
    fatal: "text-red-500 font-bold",
  };

  React.useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [lines.length, autoScroll]);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/80 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">LIVE LOG</span>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <div ref={ref} className="p-2 max-h-80 overflow-y-auto font-mono text-xs leading-5">
        {displayLines.map((line) => (
          <div key={line.id} className="flex gap-2 hover:bg-cyan-500/5 px-1 rounded">
            <span className="text-cyan-500/30 shrink-0">{line.timestamp}</span>
            <span className={cn("w-10 shrink-0 uppercase", levelColors[line.level])}>{line.level}</span>
            <span className="text-cyan-300/80">{line.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
