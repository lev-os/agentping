"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CsvViewerProps {
  data: string[][];
  hasHeader?: boolean;
  className?: string;
}

/**
 * CsvViewer - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/CsvViewer.tsx
 * @migration-status candidate
 */
export function CsvViewer({ data, hasHeader = true, className }: CsvViewerProps) {
  const header = hasHeader ? data[0] : undefined;
  const rows = hasHeader ? data.slice(1) : data;

  return (
    <div className={cn("border border-border rounded-md overflow-auto", className)}>
      <table className="w-full text-sm">
        {header && (
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {header.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-0 hover:bg-muted/30">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-foreground whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
