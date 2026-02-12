"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RadarBlip {
  angle: number;
  distance: number;
  label?: string;
}

export interface RadarSweepProps {
  blips?: RadarBlip[];
  size?: number;
  className?: string;
}

/**
 * RadarSweep - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/RadarSweep.tsx
 * @migration-status candidate
 */
export function RadarSweep({ blips = [], size = 200, className }: RadarSweepProps) {
  const r = size / 2 - 10;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" />
        <circle cx={size / 2} cy={size / 2} r={r * 0.66} fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
        <circle cx={size / 2} cy={size / 2} r={r * 0.33} fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
        <line x1={size / 2} y1={10} x2={size / 2} y2={size - 10} stroke="rgba(0,229,255,0.08)" strokeWidth="0.5" />
        <line x1={10} y1={size / 2} x2={size - 10} y2={size / 2} stroke="rgba(0,229,255,0.08)" strokeWidth="0.5" />
        {/* Sweep line */}
        <line
          x1={size / 2} y1={size / 2} x2={size / 2} y2={10}
          stroke="rgba(0,229,255,0.6)" strokeWidth="1"
          className="origin-center animate-[spin_4s_linear_infinite]"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        />
        {blips.map((b, i) => {
          const rad = (b.angle * Math.PI) / 180;
          const dist = (b.distance / 100) * r;
          const bx = size / 2 + Math.cos(rad) * dist;
          const by = size / 2 - Math.sin(rad) * dist;
          return <circle key={i} cx={bx} cy={by} r="3" fill="rgba(0,229,255,0.8)" className="animate-pulse" />;
        })}
      </svg>
    </div>
  );
}
