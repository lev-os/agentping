/**
 * @kingly/ui - Stat Grid Skeleton
 *
 * Minimalist cyberpunk skeleton - just clean boxes with subtle corner accents
 * and a very slow, gentle glow animation
 */

"use client";

import { cn } from "../../../lib/utils";
import type { SkeletonProps } from "../dashboard/types";

export function StatGridSkeleton({
  rows = 2,
  cols = 2,
  animated = true,
  className,
}: SkeletonProps = {}) {
  const totalItems = rows * cols;

  return (
    <div 
      className={cn("grid gap-3", className)} 
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: totalItems }).map((_, i) => (
        <SkeletonBox key={i} index={i} animated={animated} />
      ))}
    </div>
  );
}

function SkeletonBox({ index, animated }: { index: number; animated: boolean }) {
  const delay = index * 0.5; // Stagger by half second
  
  return (
    <div
      className={cn(
        "relative h-16 border border-primary/20",
        "bg-muted/20"
      )}
      style={{
        animation: animated ? `skeleton-breathe 4s ease-in-out ${delay}s infinite` : undefined,
      }}
    >
      {/* Corner lines - top left */}
      <div className="absolute top-0 left-0 w-3 h-px bg-primary/40" />
      <div className="absolute top-0 left-0 w-px h-3 bg-primary/40" />
      
      {/* Corner lines - top right */}
      <div className="absolute top-0 right-0 w-3 h-px bg-primary/40" />
      <div className="absolute top-0 right-0 w-px h-3 bg-primary/40" />
      
      {/* Corner lines - bottom left */}
      <div className="absolute bottom-0 left-0 w-3 h-px bg-primary/40" />
      <div className="absolute bottom-0 left-0 w-px h-3 bg-primary/40" />
      
      {/* Corner lines - bottom right */}
      <div className="absolute bottom-0 right-0 w-3 h-px bg-primary/40" />
      <div className="absolute bottom-0 right-0 w-px h-3 bg-primary/40" />
    </div>
  );
}
