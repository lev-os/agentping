"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DiffStatSummaryProps {
  added: number;
  removed: number;
  modified: number;
  files: number;
  className?: string;
}

/**
 * DiffStatSummary - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DiffStatSummary.tsx
 * @catalog-status candidate
 */
export function DiffStatSummary({ added, removed, modified, files, className }: DiffStatSummaryProps) {
  return (
    <div className={cn("flex items-center gap-4 text-sm", className)}>
      <span className="text-muted-foreground">{files} files</span>
      <span className="text-emerald-400">+{added}</span>
      <span className="text-red-400">-{removed}</span>
      <span className="text-amber-400">~{modified}</span>
    </div>
  );
}
