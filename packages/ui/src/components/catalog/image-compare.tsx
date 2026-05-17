"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ImageCompareProps {
  before: string;
  after: string;
  height?: number;
  className?: string;
}

/**
 * ImageCompare - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ImageCompare.tsx
 * @catalog-status candidate
 */
export function ImageCompare({ before, after, height = 300, className }: ImageCompareProps) {
  const [split, setSplit] = React.useState(50);

  return (
    <div className={cn("relative overflow-hidden rounded-md border border-border", className)} style={{ height }}>
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${split}%` }}>
        <img src={before} alt="Before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${100 / (split / 100)}%` }} />
      </div>
      <input
        type="range"
        min={0} max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label="Image comparison slider"
        className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
      />
      <div className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none" style={{ left: `${split}%` }} />
    </div>
  );
}
