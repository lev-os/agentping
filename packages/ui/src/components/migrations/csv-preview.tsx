"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CsvPreviewProps {
  headers?: string[];
  rows?: string[][];
  filename?: string;
  maxRows?: number;
  className?: string;
}

/**
 * CsvPreview - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/CsvPreview.tsx
 * @migration-status candidate
 */
export function CsvPreview({ headers = [], rows = [], filename, maxRows = 20, className }: CsvPreviewProps) {
  const displayRows = rows.slice(0, maxRows);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{filename || "CSV PREVIEW"}</span>
        <span className="text-xs font-mono text-cyan-500/40">{rows.length} rows</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-cyan-500/10">
              {headers.map((h, i) => (
                <th key={i} className="text-left px-3 py-2 text-cyan-400/80 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, i) => (
              <tr key={i} className="border-b border-cyan-500/5 hover:bg-cyan-500/5">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-1 text-cyan-300/80">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length > maxRows && (
          <div className="px-4 py-2 text-xs font-mono text-cyan-500/40 text-center">
            Showing {maxRows} of {rows.length} rows
          </div>
        )}
      </div>
    </div>
  );
}
