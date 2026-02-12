"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SonarDisplayProps {
  pings?: { angle: number; distance: number }[];
  size?: number;
  className?: string;
}

/**
 * SonarDisplay - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/SonarDisplay.tsx
 * @migration-status candidate
 */
export function SonarDisplay({ pings = [], size = 200, className }: SonarDisplayProps) {
  const r = size / 2 - 10;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={cn("flex items-center justify-center bg-black/60 rounded-lg border border-cyan-500/10 p-4", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[1, 0.75, 0.5, 0.25].map((s) => (
          <circle key={s} cx={cx} cy={cy} r={r * s} fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
        ))}
        <line x1={cx} y1={10} x2={cx} y2={size - 10} stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
        <line x1={10} y1={cy} x2={size - 10} y2={cy} stroke="rgba(0,229,255,0.06)" strokeWidth="0.5" />
        {/* Sweep */}
        <circle cx={cx} cy={cy} r={r} fill="url(#sonarGrad)" className="animate-[spin_3s_linear_infinite]" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <defs>
          <radialGradient id="sonarGrad">
            <stop offset="0%" stopColor="rgba(0,229,255,0)" />
            <stop offset="50%" stopColor="rgba(0,229,255,0)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.08)" />
          </radialGradient>
        </defs>
        {pings.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const dist = (p.distance / 100) * r;
          return <circle key={i} cx={cx + Math.cos(rad) * dist} cy={cy - Math.sin(rad) * dist} r="2" fill="rgba(0,229,255,0.8)" />;
        })}
      </svg>
    </div>
  );
}
