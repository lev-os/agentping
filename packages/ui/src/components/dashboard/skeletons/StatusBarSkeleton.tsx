/**
 * @kingly/ui - Status Bar Skeleton
 *
 * Horizontal status bar skeleton for widgets like QuickStatus
 */

"use client";

import { cn } from "../../../lib/utils";
import type { SkeletonProps } from "../types";

export function StatusBarSkeleton({
  animated = true,
  className,
}: SkeletonProps = {}) {
  return (
    <div className={cn("flex items-center gap-4 p-4", className)}>
      {/* Icon placeholder */}
      <div
        className={cn(
          "relative w-12 h-12 border-2 border-primary/20 bg-muted/20 rounded",
          animated && "animate-pulse"
        )}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-2 h-px bg-primary/40" />
        <div className="absolute top-0 left-0 w-px h-2 bg-primary/40" />
        <div className="absolute top-0 right-0 w-2 h-px bg-primary/40" />
        <div className="absolute top-0 right-0 w-px h-2 bg-primary/40" />
        <div className="absolute bottom-0 left-0 w-2 h-px bg-primary/40" />
        <div className="absolute bottom-0 left-0 w-px h-2 bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-2 h-px bg-primary/40" />
        <div className="absolute bottom-0 right-0 w-px h-2 bg-primary/40" />
      </div>

      {/* Text content */}
      <div className="flex-1 space-y-2">
        <div
          className={cn(
            "h-4 bg-muted/30 border border-primary/20 rounded",
            animated && "animate-pulse"
          )}
          style={{ width: "60%" }}
        />
        <div
          className={cn(
            "h-3 bg-muted/20 border border-primary/10 rounded",
            animated && "animate-pulse"
          )}
          style={{ width: "40%" }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-8 w-16 bg-muted/30 border border-primary/20 rounded",
            animated && "animate-pulse"
          )}
        />
        <div
          className={cn(
            "h-8 w-8 bg-muted/30 border border-primary/20 rounded",
            animated && "animate-pulse"
          )}
        />
      </div>
    </div>
  );
}

