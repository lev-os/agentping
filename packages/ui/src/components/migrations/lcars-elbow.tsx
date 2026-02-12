"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type ElbowPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type ElbowSize = "sm" | "md" | "lg";

export interface LcarsElbowProps {
  position: ElbowPosition;
  size?: ElbowSize;
  color?: "blue" | "orange" | "tan" | "purple" | "violet" | "pink";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showBar?: boolean;
  barHeight?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeMap: Record<ElbowSize, number> = { sm: 24, md: 40, lg: 60 };
const colorMap: Record<string, string> = {
  blue: "bg-blue-500",
  orange: "bg-orange-400",
  tan: "bg-amber-300",
  purple: "bg-purple-500",
  violet: "bg-violet-500",
  pink: "bg-pink-500",
};
const barHeightMap: Record<string, string> = { xs: "h-1", sm: "h-2", md: "h-3", lg: "h-4", xl: "h-6" };

/**
 * LcarsElbow - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/lcars/LcarsElbow.tsx
 * @migration-status candidate
 */
export function LcarsElbow({
  position,
  size = "md",
  color = "tan",
  children,
  className,
  style,
  showBar = true,
  barHeight = "md",
}: LcarsElbowProps) {
  const radius = sizeMap[size];
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");

  return (
    <div className={cn("relative", className)} style={style}>
      <div
        className={cn("absolute", colorMap[color])}
        style={{
          width: radius,
          height: radius,
          borderRadius: `${isTop && isLeft ? radius : 0}px ${isTop && !isLeft ? radius : 0}px ${!isTop && !isLeft ? radius : 0}px ${!isTop && isLeft ? radius : 0}px`,
          [isTop ? "top" : "bottom"]: 0,
          [isLeft ? "left" : "right"]: 0,
        }}
      />
      {showBar && (
        <div className={cn("absolute", barHeightMap[barHeight], colorMap[color], isLeft ? "left-0" : "right-0")} style={{ width: "100%", [isTop ? "top" : "bottom"]: 0 }} />
      )}
      {children && <div className="relative z-10 p-2">{children}</div>}
    </div>
  );
}
