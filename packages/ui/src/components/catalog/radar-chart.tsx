"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RadarAxis {
  label: string;
  value: number;
  max?: number;
}

export interface RadarChartProps {
  axes?: RadarAxis[];
  size?: number;
  className?: string;
}

/**
 * RadarChart - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/RadarChart.tsx
 * @catalog-status candidate
 * @needs-review SVG radar/spider chart
 */
export function RadarChart({ axes = [], size = 200, className }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;
  const n = axes.length;

  const getPoint = (i: number, val: number, max: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (val / max) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const points = axes.map((a, i) => getPoint(i, a.value, a.max || 100));
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {[1, 0.75, 0.5, 0.25].map((s) => (
          <polygon key={s} points={Array.from({ length: n }, (_, i) => { const p = getPoint(i, s * 100, 100); return `${p.x},${p.y}`; }).join(" ")}
            fill="none" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
        ))}
        {axes.map((a, i) => {
          const p = getPoint(i, 100, 100);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,229,255,0.08)" strokeWidth="0.5" />
              <text x={p.x} y={p.y} textAnchor="middle" fill="rgba(0,229,255,0.5)" fontSize="8" fontFamily="monospace" dy={p.y < cy ? -6 : 12}>{a.label}</text>
            </g>
          );
        })}
        {n > 0 && <polygon points={polygon} fill="rgba(0,229,255,0.1)" stroke="rgba(0,229,255,0.6)" strokeWidth="1.5" />}
      </svg>
    </div>
  );
}
