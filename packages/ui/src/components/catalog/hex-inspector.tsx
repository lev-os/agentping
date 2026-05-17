"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HexInspectorProps {
  data: number[];
  className?: string;
}

/**
 * HexInspector - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/HexInspector.tsx
 * @catalog-status candidate
 */
export function HexInspector({ data = [], className }: HexInspectorProps) {
  const rows = [];
  for (let i = 0; i < data.length; i += 16) {
    rows.push(data.slice(i, i + 16));
  }

  return (
    <div className={cn("font-mono text-xs overflow-auto", className)}>
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-4 px-2 py-0.5 hover:bg-muted/30">
          <span className="text-muted-foreground w-12">{(ri * 16).toString(16).padStart(8, "0")}</span>
          <span className="text-foreground flex-1">{row.map((b) => b.toString(16).padStart(2, "0")).join(" ")}</span>
          <span className="text-muted-foreground">{row.map((b) => (b >= 32 && b < 127) ? String.fromCharCode(b) : ".").join("")}</span>
        </div>
      ))}
    </div>
  );
}
