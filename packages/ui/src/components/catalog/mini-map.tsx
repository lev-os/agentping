"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MiniMapProps {
  viewportWidth: number;
  viewportHeight: number;
  contentWidth: number;
  contentHeight: number;
  scrollX?: number;
  scrollY?: number;
  className?: string;
}

/**
 * MiniMap - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MiniMap.tsx
 * @catalog-status candidate
 */
export function MiniMap({
  viewportWidth, viewportHeight, contentWidth, contentHeight,
  scrollX = 0, scrollY = 0, className
}: MiniMapProps) {
  const scale = Math.min(120 / contentWidth, 80 / contentHeight);
  const vpW = viewportWidth * scale;
  const vpH = viewportHeight * scale;
  const offX = scrollX * scale;
  const offY = scrollY * scale;

  return (
    <div
      className={cn("relative border border-border rounded bg-muted/50", className)}
      style={{ width: contentWidth * scale, height: contentHeight * scale }}
    >
      <div
        className="absolute border-2 border-primary/60 rounded-sm bg-primary/10"
        style={{ width: vpW, height: vpH, left: offX, top: offY }}
      />
    </div>
  );
}
