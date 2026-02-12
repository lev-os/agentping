"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SqlResultTableProps {
  columns?: string[];
  rows?: string[][];
  query?: string;
  executionTime?: string;
  className?: string;
}

/**
 * SqlResultTable - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/SqlResultTable.tsx
 * @migration-status candidate
 */
export function SqlResultTable({ columns = [], rows = [], query, executionTime, className }: SqlResultTableProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      {query && (
        <div className="px-4 py-2 border-b border-cyan-500/10 bg-black/40">
          <pre className="text-xs font-mono text-cyan-300/80 whitespace-pre-wrap">{query}</pre>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              {columns.map((col, i) => (
                <th key={i} className="text-left px-3 py-2 text-cyan-400/80 uppercase">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1 text-cyan-300/80">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-1.5 border-t border-cyan-500/10 flex justify-between">
        <span className="text-[10px] font-mono text-cyan-500/40">{rows.length} rows</span>
        {executionTime && <span className="text-[10px] font-mono text-cyan-500/40">{executionTime}</span>}
      </div>
    </div>
  );
}
