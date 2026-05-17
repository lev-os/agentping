"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HexGridBackgroundProps {
  className?: string;
  opacity?: number;
}

/**
 * HexGridBackground - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/HexGridBackground.tsx
 * @catalog-status candidate
 */
export function HexGridBackground({ className, opacity = 0.1 }: HexGridBackgroundProps) {
  const hexes: { x: number; y: number }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 10; col++) {
      hexes.push({
        x: col * 36 + (row % 2 === 1 ? 18 : 0),
        y: row * 32,
      });
    }
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg width="100%" height="100%" viewBox="0 0 360 256" style={{ opacity }}>
        {hexes.map((h, i) => (
          <polygon
            key={i}
            points={`${h.x},${h.y - 12} ${h.x + 10},${h.y - 6} ${h.x + 10},${h.y + 6} ${h.x},${h.y + 12} ${h.x - 10},${h.y + 6} ${h.x - 10},${h.y - 6}`}
            fill="none"
            stroke="rgba(0,229,255,0.4)"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
