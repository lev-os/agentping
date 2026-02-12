"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LogSearchQueryProps {
  onSearch?: (query: string) => void;
  results?: { line: string; timestamp: string; level: string }[];
  className?: string;
}

/**
 * LogSearchQuery - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/LogSearchQuery.tsx
 * @migration-status candidate
 */
export function LogSearchQuery({ onSearch, results = [], className }: LogSearchQueryProps) {
  const [query, setQuery] = React.useState("");

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch?.(query)}
            placeholder="Search logs..."
            className="flex-1 bg-black/40 border border-cyan-500/20 rounded px-3 py-1 text-xs font-mono text-cyan-300 placeholder:text-cyan-500/30 outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => onSearch?.(query)}
            className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs font-mono text-cyan-400 hover:bg-cyan-500/20"
          >
            SEARCH
          </button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto p-2 font-mono text-xs">
        {results.map((r, i) => (
          <div key={i} className="flex gap-2 px-1 py-0.5 hover:bg-cyan-500/5 rounded">
            <span className="text-cyan-500/30 shrink-0">{r.timestamp}</span>
            <span className="text-cyan-400/60 w-10 shrink-0 uppercase">{r.level}</span>
            <span className="text-cyan-300/80">{r.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
