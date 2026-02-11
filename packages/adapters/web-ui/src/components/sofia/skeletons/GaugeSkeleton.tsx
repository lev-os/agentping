/**
 * @kingly/ui - Gauge Skeleton
 *
 * Minimalist cyberpunk skeleton for gauge widgets
 */

"use client";

import { cn } from "../../../lib/utils";
import type { SkeletonProps } from "../dashboard/types";

export function GaugeSkeleton({
  animated = true,
  className,
}: SkeletonProps = {}) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Circular gauge outline */}
      <div
        className="w-32 h-32 rounded-full border border-primary/20 bg-muted/10"
        style={{
          animation: animated ? "skeleton-breathe 4s ease-in-out infinite" : undefined,
        }}
      />

      {/* Label placeholder */}
      <div 
        className="h-3 w-20 border border-primary/15 bg-muted/10"
        style={{
          animation: animated ? "skeleton-breathe 4s ease-in-out 0.5s infinite" : undefined,
        }}
      />

      {/* Stats row */}
      <div className="flex gap-4">
        <div 
          className="h-10 w-16 border border-primary/15 bg-muted/10"
          style={{
            animation: animated ? "skeleton-breathe 4s ease-in-out 1s infinite" : undefined,
          }}
        />
        <div 
          className="h-10 w-16 border border-primary/15 bg-muted/10"
          style={{
            animation: animated ? "skeleton-breathe 4s ease-in-out 1.5s infinite" : undefined,
          }}
        />
      </div>
    </div>
  );
}
