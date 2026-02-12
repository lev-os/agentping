"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LogBucket {
  time: string;
  count: number;
  level?: "info" | "warn" | "error";
}

export interface LogHistogramProps {
  data: LogBucket[];
  height?: number;
  className?: string;
}

/**
 * LogHistogram - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LogHistogram.tsx
 * @migration-status candidate
 */
export function LogHistogram({ data, height = 200, className }: LogHistogramProps) {
  const maxCount = Math.max(...data.map((b) => b.count), 1);
  const levelColor = { info: "bg-blue-500", warn: "bg-amber-500", error: "bg-red-500" };

  return (
    <div className={cn("flex items-end gap-px", className)} style={{ height }}>
      {data.map((bucket, i) => (
        <div
          key={i}
          className={cn("flex-1 rounded-t-sm transition-all hover:opacity-80", levelColor[bucket.level ?? "info"])}
          style={{ height: `${(bucket.count / maxCount) * 100}%`, minHeight: 1 }}
          title={`${bucket.time}: ${bucket.count}`}
        />
      ))}
    </div>
  );
}
