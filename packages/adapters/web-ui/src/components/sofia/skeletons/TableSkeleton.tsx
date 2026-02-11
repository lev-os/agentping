/**
 * @kingly/ui - Table Skeleton
 *
 * Minimalist cyberpunk skeleton for table widgets
 */

"use client";

import { cn } from "../../../lib/utils";
import type { SkeletonProps } from "../dashboard/types";

export function TableSkeleton({
  rows = 8,
  animated = true,
  className,
}: SkeletonProps = {}) {
  return (
    <div className={cn("space-y-1", className)}>
      {/* Header row */}
      <div 
        className="h-8 border border-primary/25 bg-muted/15"
        style={{
          animation: animated ? "skeleton-breathe 4s ease-in-out infinite" : undefined,
        }}
      />

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 border border-primary/15 bg-muted/10"
          style={{
            animation: animated ? `skeleton-breathe 4s ease-in-out ${i * 0.15}s infinite` : undefined,
          }}
        />
      ))}
    </div>
  );
}
