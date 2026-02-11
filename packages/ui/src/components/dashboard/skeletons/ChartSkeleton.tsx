/**
 * @kingly/ui - Chart Skeleton
 *
 * Minimalist cyberpunk skeleton for chart widgets
 */

"use client";

import { cn } from "../../../lib/utils";
import type { SkeletonProps } from "../types";

export function ChartSkeleton({
  height = "16rem",
  animated = true,
  className,
}: SkeletonProps = {}) {
  return (
    <div
      className={cn(
        "relative border border-primary/20 bg-muted/10",
        className
      )}
      style={{ 
        height,
        animation: animated ? "skeleton-breathe 4s ease-in-out infinite" : undefined,
      }}
    >
      {/* Corner lines */}
      <div className="absolute top-0 left-0 w-4 h-px bg-primary/40" />
      <div className="absolute top-0 left-0 w-px h-4 bg-primary/40" />
      <div className="absolute top-0 right-0 w-4 h-px bg-primary/40" />
      <div className="absolute top-0 right-0 w-px h-4 bg-primary/40" />
      <div className="absolute bottom-0 left-0 w-4 h-px bg-primary/40" />
      <div className="absolute bottom-0 left-0 w-px h-4 bg-primary/40" />
      <div className="absolute bottom-0 right-0 w-4 h-px bg-primary/40" />
      <div className="absolute bottom-0 right-0 w-px h-4 bg-primary/40" />

      {/* Subtle horizontal lines suggesting chart axes */}
      <div className="absolute inset-4 flex flex-col justify-between opacity-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-px bg-primary/30" />
        ))}
      </div>
    </div>
  );
}
