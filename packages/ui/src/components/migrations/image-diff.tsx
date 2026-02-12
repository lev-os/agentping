"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ImageDiffProps {
  before: string;
  after: string;
  mode?: "side-by-side" | "overlay" | "slider";
  className?: string;
}

/**
 * ImageDiff - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ImageDiff.tsx
 * @migration-status candidate
 */
export function ImageDiff({ before, after, mode = "side-by-side", className }: ImageDiffProps) {
  const [opacity, setOpacity] = React.useState(50);

  if (mode === "overlay") {
    return (
      <div className={cn("relative border border-border rounded-md overflow-hidden", className)}>
        <img src={before} alt="Before" className="w-full" />
        <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: opacity / 100 }} />
        <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="absolute bottom-2 left-2 right-2" />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <div className="border border-border rounded-md overflow-hidden">
        <div className="text-xs text-muted-foreground px-2 py-1 bg-muted/50">Before</div>
        <img src={before} alt="Before" className="w-full" />
      </div>
      <div className="border border-border rounded-md overflow-hidden">
        <div className="text-xs text-muted-foreground px-2 py-1 bg-muted/50">After</div>
        <img src={after} alt="After" className="w-full" />
      </div>
    </div>
  );
}
