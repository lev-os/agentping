"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface KeyValueEntry {
  key: string;
  value: string;
  type?: "string" | "number" | "boolean" | "json";
  ttl?: number;
}

export interface KeyValueStoreProps {
  entries?: KeyValueEntry[];
  title?: string;
  onDelete?: (key: string) => void;
  className?: string;
}

/**
 * KeyValueStore - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/KeyValueStore.tsx
 * @migration-status candidate
 */
export function KeyValueStore({ entries = [], title, onDelete, className }: KeyValueStoreProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10 flex items-center justify-between">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "KV STORE"}</span>
        <span className="text-xs font-mono text-cyan-500/40">{entries.length} keys</span>
      </div>
      <div className="divide-y divide-cyan-500/5">
        {entries.map((entry) => (
          <div key={entry.key} className="flex items-center gap-3 px-4 py-2 hover:bg-cyan-500/5">
            <span className="text-xs font-mono text-cyan-400 w-32 truncate">{entry.key}</span>
            <span className="text-xs font-mono text-cyan-300/80 flex-1 truncate">{entry.value}</span>
            {entry.type && <span className="text-[10px] font-mono text-cyan-500/40 uppercase">{entry.type}</span>}
            {onDelete && (
              <button onClick={() => onDelete(entry.key)} className="text-red-400/60 hover:text-red-400 text-xs">x</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
