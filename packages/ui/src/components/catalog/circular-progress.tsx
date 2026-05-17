"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

/**
 * CircularProgress - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/CircularProgress.tsx
 * @catalog-status candidate
 */
export function CircularProgress({ value, size = 64, strokeWidth = 4, label, className }: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-muted" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" className="text-primary transition-all duration-500"
          strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <span className="text-xs text-muted-foreground">{label ?? `${clamped}%`}</span>
    </div>
  );
}
