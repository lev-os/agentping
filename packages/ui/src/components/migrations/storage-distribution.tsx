"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StorageSegment {
  label: string;
  value: number;
  color: string;
}

export interface StorageDistributionProps {
  segments?: StorageSegment[];
  total?: number;
  className?: string;
}

export function StorageDistribution({
  segments = [],
  total,
  className,
}: StorageDistributionProps) {
  const computedTotal = total ?? segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div className={cn("font-mono w-72", className)}>
      <div className="flex h-4 rounded-full overflow-hidden bg-cyan-500/10">
        {segments.map((seg, i) => {
          const pct = computedTotal > 0 ? (seg.value / computedTotal) * 100 : 0;
          return (
            <div
              key={i}
              className="h-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                backgroundColor: seg.color,
                opacity: 0.7,
              }}
              title={`${seg.label}: ${seg.value}`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="block w-2 h-2 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-[10px] text-cyan-500/50">{seg.label}</span>
            <span className="text-[10px] text-cyan-300 tabular-nums">
              {computedTotal > 0
                ? `${((seg.value / computedTotal) * 100).toFixed(0)}%`
                : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
