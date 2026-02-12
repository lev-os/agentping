"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps {
  variant?: "rect" | "circle" | "text";
  width?: number | string;
  height?: number | string;
  count?: number;
  className?: string;
}

export function Skeleton({
  variant = "rect",
  width,
  height,
  count = 3,
  className,
}: SkeletonProps) {
  if (variant === "circle") {
    const size = width ?? height ?? 40;
    return (
      <div
        className={cn("animate-pulse rounded-full bg-cyan-500/10", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === "text") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded bg-cyan-500/10 h-3"
            style={{
              width: i === count - 1 ? "60%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("animate-pulse rounded bg-cyan-500/10", className)}
      style={{
        width: width ?? "100%",
        height: height ?? 20,
      }}
    />
  );
}
