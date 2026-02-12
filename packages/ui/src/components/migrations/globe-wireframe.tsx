"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface GlobeWireframeProps {
  size?: number;
  className?: string;
}

/**
 * GlobeWireframe - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/GlobeWireframe.tsx
 * @migration-status candidate
 * @needs-review Complex SVG/CSS animation globe
 */
export function GlobeWireframe({ size = 200, className }: GlobeWireframeProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox="0 0 200 200" className="animate-[spin_20s_linear_infinite]">
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="80" ry="50" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="80" ry="70" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="30" ry="80" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="50" ry="80" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="70" ry="80" fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="3" fill="rgba(0,229,255,0.6)" />
      </svg>
    </div>
  );
}
