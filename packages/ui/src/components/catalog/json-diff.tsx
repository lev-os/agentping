"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface JsonDiffProps {
  oldJson: unknown;
  newJson: unknown;
  className?: string;
}

/**
 * JsonDiff - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/JsonDiff.tsx
 * @catalog-status candidate
 */
export function JsonDiff({ oldJson = {}, newJson = {}, className }: JsonDiffProps) {
  const oldStr = JSON.stringify(oldJson, null, 2).split("\n");
  const newStr = JSON.stringify(newJson, null, 2).split("\n");

  return (
    <div className={cn("grid grid-cols-2 gap-0 border border-border rounded-md overflow-hidden font-mono text-xs", className)}>
      <div className="border-r border-border p-2 bg-red-500/5">
        <div className="text-[10px] text-muted-foreground mb-1">Old</div>
        {oldStr.map((line, i) => <div key={i} className="text-foreground/80 whitespace-pre">{line}</div>)}
      </div>
      <div className="p-2 bg-emerald-500/5">
        <div className="text-[10px] text-muted-foreground mb-1">New</div>
        {newStr.map((line, i) => <div key={i} className="text-foreground/80 whitespace-pre">{line}</div>)}
      </div>
    </div>
  );
}
