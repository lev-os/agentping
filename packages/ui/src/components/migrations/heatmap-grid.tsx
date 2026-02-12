"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HeatmapGridProps {
  data: number[][];
  cellSize?: number;
  labels?: { rows?: string[]; cols?: string[] };
  className?: string;
}

/**
 * HeatmapGrid - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/HeatmapGrid.tsx
 * @migration-status candidate
 */
export function HeatmapGrid({ data = [], cellSize = 24, labels, className }: HeatmapGridProps) {
  const maxVal = Math.max(...data.flat(), 1);

  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      {labels?.cols && (
        <div className="flex gap-0.5" style={{ paddingLeft: labels.rows ? 60 : 0 }}>
          {labels.cols.map((c, i) => (
            <div key={i} className="text-[10px] text-muted-foreground text-center" style={{ width: cellSize }}>{c}</div>
          ))}
        </div>
      )}
      {data.map((row, ri) => (
        <div key={ri} className="flex items-center gap-0.5">
          {labels?.rows?.[ri] && <span className="text-[10px] text-muted-foreground w-14 truncate text-right pr-1">{labels.rows[ri]}</span>}
          {row.map((val, ci) => {
            const intensity = val / maxVal;
            return (
              <div
                key={ci}
                className="rounded-sm"
                style={{ width: cellSize, height: cellSize, backgroundColor: `rgba(0, 255, 200, ${intensity * 0.8 + 0.1})` }}
                title={`${val}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
