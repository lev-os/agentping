"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface KnobProps {
  value: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
  label?: string;
  unit?: string;
  className?: string;
}

/**
 * Knob - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/Knob.tsx
 * @catalog-status candidate
 */
export function Knob({ value, min = 0, max = 100, onChange, size = 60, label, unit, className }: KnobProps) {
  const pct = (value - min) / (max - min);
  const angle = pct * 270 - 135;

  const handleWheel = (e: React.WheelEvent) => {
    const step = (max - min) / 50;
    const next = Math.max(min, Math.min(max, value + (e.deltaY < 0 ? step : -step)));
    onChange?.(Math.round(next));
  };

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)} onWheel={handleWheel}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" className="text-muted" strokeWidth="3" />
          <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3"
            strokeDasharray={`${pct * 163} 163`} strokeLinecap="round" transform="rotate(-135 30 30)"
          />
        </svg>
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="absolute left-1/2 top-1 h-2 w-1 -translate-x-1/2 rounded-full bg-primary" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
          {value}{unit}
        </div>
      </div>
      {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
    </div>
  );
}
