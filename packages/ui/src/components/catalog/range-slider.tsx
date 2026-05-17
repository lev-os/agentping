"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RangeSliderProps {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
}

/**
 * RangeSlider - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/RangeSlider.tsx
 * @catalog-status candidate
 */
export function RangeSlider({ min = 0, max = 100, value = 50, onChange, label, className }: RangeSliderProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-cyan-500/60">{label}</span>
          <span className="text-xs font-mono text-cyan-300">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full h-1.5 bg-black/40 rounded-full appearance-none cursor-pointer accent-cyan-400"
      />
    </div>
  );
}
