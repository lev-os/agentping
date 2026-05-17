"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ErrorGroup {
  id: string;
  message: string;
  count: number;
  lastSeen: string;
}

export interface ErrorClusterProps {
  errors: ErrorGroup[];
  className?: string;
}

/**
 * ErrorCluster - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ErrorCluster.tsx
 * @catalog-status candidate
 */
export function ErrorCluster({ errors = [], className }: ErrorClusterProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {errors.map((err) => (
        <div key={err.id} className="flex items-start gap-3 px-3 py-2 rounded-md border border-destructive/30 bg-destructive/5">
          <span className="text-xs font-mono font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">{err.count}x</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-foreground truncate">{err.message}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{err.lastSeen}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
