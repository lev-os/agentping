"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SplitViewProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  ratio?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
}

/**
 * SplitView - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/SplitView.tsx
 * @catalog-status candidate
 */
export function SplitView({ left, right, ratio = 50, direction = "horizontal", className }: SplitViewProps) {
  return (
    <div className={cn("flex", direction === "vertical" ? "flex-col" : "flex-row", "border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div style={{ [direction === "horizontal" ? "width" : "height"]: `${ratio}%` }} className="overflow-auto p-2">
        {left}
      </div>
      <div className={cn(direction === "horizontal" ? "w-px" : "h-px", "bg-cyan-500/20")} />
      <div className="flex-1 overflow-auto p-2">{right}</div>
    </div>
  );
}
