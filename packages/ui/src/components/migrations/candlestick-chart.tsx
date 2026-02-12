"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandleStickChartProps {
  data?: CandleData[];
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * CandleStickChart - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/finance/CandleStickChart.tsx
 * @migration-status candidate
 * @needs-review Complex SVG candlestick rendering
 */
export function CandleStickChart({ data = [], title, width = 600, height = 300, className }: CandleStickChartProps) {
  const mockCandles = data.length > 0 ? data : Array.from({ length: 20 }, (_, i) => ({
    time: `T${i}`,
    open: 100 + Math.random() * 20,
    close: 100 + Math.random() * 20,
    high: 120 + Math.random() * 10,
    low: 90 + Math.random() * 10,
  }));

  const allValues = mockCandles.flatMap((c) => [c.high, c.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const candleWidth = width / mockCandles.length * 0.6;

  const scaleY = (v: number) => height - ((v - minVal) / range) * (height - 20) - 10;

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title || "CANDLESTICK"}</span>
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {mockCandles.map((c, i) => {
          const x = (i / mockCandles.length) * width + candleWidth / 2;
          const isUp = c.close >= c.open;
          const color = isUp ? "#22c55e" : "#ef4444";
          const bodyTop = scaleY(Math.max(c.open, c.close));
          const bodyBottom = scaleY(Math.min(c.open, c.close));
          return (
            <g key={i}>
              <line x1={x} y1={scaleY(c.high)} x2={x} y2={scaleY(c.low)} stroke={color} strokeWidth="1" />
              <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={Math.max(bodyBottom - bodyTop, 1)} fill={color} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
