/**
 * @kingly/ui - Grid Skeleton
 *
 * Minimalist cyberpunk skeleton for grid widgets
 */

"use client";

import { cn } from "../../../lib/utils";
import type { SkeletonProps } from "../types";

export function GridSkeleton({
  rows = 7,
  cols = 6,
  animated = true,
  className,
}: SkeletonProps = {}) {
  const totalItems = rows * cols;

  return (
    <div 
      className={cn("grid gap-1", className)} 
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: totalItems }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const delay = (row * 0.1) + (col * 0.05);
        
        return (
          <div
            key={i}
            className="aspect-square border border-primary/15 bg-muted/10"
            style={{
              animation: animated ? `skeleton-breathe 4s ease-in-out ${delay}s infinite` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
