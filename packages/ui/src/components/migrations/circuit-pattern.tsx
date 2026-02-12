"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CircuitPatternProps {
  className?: string;
}

/**
 * CircuitPattern - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/CircuitPattern.tsx
 * @migration-status candidate
 */
export function CircuitPattern({ className }: CircuitPatternProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-black/60 border border-cyan-500/10", className)}>
      <svg width="100%" height="100%" className="absolute inset-0 opacity-40" viewBox="0 0 200 200">
        <path d="M10,10 L50,10 L50,50" fill="none" stroke="rgba(0,229,255,0.3)" strokeWidth="1" className="animate-[draw_3s_ease-in-out_infinite]" />
        <path d="M80,10 L80,30 L120,30 L120,80" fill="none" stroke="rgba(0,229,255,0.25)" strokeWidth="1" className="animate-[draw_4s_ease-in-out_infinite_0.5s]" />
        <path d="M10,120 L40,120 L40,80 L80,80" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1" className="animate-[draw_3.5s_ease-in-out_infinite_1s]" />
        <path d="M150,20 L150,60 L180,60 L180,100" fill="none" stroke="rgba(0,229,255,0.25)" strokeWidth="1" />
        <path d="M30,150 L70,150 L70,180" fill="none" stroke="rgba(0,229,255,0.2)" strokeWidth="1" />
        <circle cx="10" cy="10" r="2" fill="rgba(0,229,255,0.6)" />
        <circle cx="50" cy="50" r="2" fill="rgba(0,229,255,0.6)" />
        <circle cx="80" cy="10" r="2" fill="rgba(0,229,255,0.6)" />
        <circle cx="120" cy="80" r="2" fill="rgba(0,229,255,0.6)" />
        <circle cx="180" cy="100" r="2" fill="rgba(0,229,255,0.6)" />
      </svg>
      <div className="relative z-10 p-4 text-[10px] font-mono text-cyan-500/30 uppercase">PCB_LAYER_01</div>
    </div>
  );
}
