"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps {
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  onChange?: (value: number) => void;
  label?: string;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  value: controlledValue,
  step = 1,
  onChange,
  label,
  className,
}: SliderProps) {
  const [internal, setInternal] = React.useState(controlledValue ?? min);
  const current = controlledValue ?? internal;
  const pct = ((current - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setInternal(v);
    onChange?.(v);
  };

  return (
    <div className={cn("font-mono w-64", className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cyan-400 uppercase tracking-wider">{label}</span>
          <span className="text-xs text-cyan-300 tabular-nums">{current}</span>
        </div>
      )}
      <div className="relative h-2 rounded-full bg-cyan-500/10">
        <div
          className="absolute h-full rounded-full bg-cyan-500/60"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black shadow-[0_0_6px_rgba(6,182,212,0.5)] pointer-events-none"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      {!label && (
        <div className="text-right mt-1">
          <span className="text-xs text-cyan-300/60 tabular-nums">{current}</span>
        </div>
      )}
    </div>
  );
}
