"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HexDumpViewProps {
  data?: number[];
  title?: string;
  bytesPerRow?: number;
  className?: string;
}

/**
 * HexDumpView - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/HexDumpView.tsx
 * @migration-status candidate
 */
export function HexDumpView({ data = [], title, bytesPerRow = 16, className }: HexDumpViewProps) {
  const rows: number[][] = [];
  for (let i = 0; i < data.length; i += bytesPerRow) {
    rows.push(data.slice(i, i + bytesPerRow));
  }

  const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  const toAscii = (n: number) => (n >= 32 && n < 127 ? String.fromCharCode(n) : ".");

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "HEX DUMP"}</span>
        <span className="text-xs font-mono text-cyan-500/40 ml-2">[{data.length} bytes]</span>
      </div>
      <div className="p-3 overflow-x-auto">
        <pre className="text-xs font-mono leading-5">
          {rows.map((row, i) => {
            const offset = (i * bytesPerRow).toString(16).padStart(8, "0").toUpperCase();
            const hex = row.map(toHex).join(" ");
            const ascii = row.map(toAscii).join("");
            return (
              <div key={i} className="flex gap-4">
                <span className="text-cyan-500/40">{offset}</span>
                <span className="text-cyan-300/80">{hex}</span>
                <span className="text-green-400/60">{ascii}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
