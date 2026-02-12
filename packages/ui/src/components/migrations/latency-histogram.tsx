"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LatencyBucket {
  label: string;
  count: number;
}

export interface LatencyHistogramProps {
  data?: LatencyBucket[];
  height?: number;
  className?: string;
}

/**
 * LatencyHistogram - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LatencyHistogram.tsx
 * @migration-status candidate
 */
export function LatencyHistogram({ data = [], height = 200, className }: LatencyHistogramProps) {
  const maxCount = Math.max(...data.map((b) => b.count), 1);

  return (
    <div className={cn("flex items-end gap-1", className)} style={{ height }}>
      {data.map((bucket, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-primary/70 rounded-t-sm transition-all hover:bg-primary"
            style={{ height: `${(bucket.count / maxCount) * 100}%`, minHeight: 2 }}
            title={`${bucket.label}: ${bucket.count}`}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{bucket.label}</span>
        </div>
      ))}
    </div>
  );
}
