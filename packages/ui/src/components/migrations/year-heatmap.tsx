"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HeatmapEntry {
  date: string;
  value: number;
}

export interface YearHeatmapProps {
  data: HeatmapEntry[];
  year: number;
  colorScale?: string[];
  maxValue?: number;
  className?: string;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DEFAULT_SCALE = ["#0e1a1f", "#0e3d4a", "#0e6175", "#06849e", "#06b6d4"];

/**
 * YearHeatmap - 365-cell heatmap (GitHub contribution style)
 * @source packages/adapters/web-ui/src/components/YearHeatmap.tsx
 * @migration-status implemented
 */
export function YearHeatmap({
  data,
  year,
  colorScale = DEFAULT_SCALE,
  maxValue: maxProp,
  className,
}: YearHeatmapProps) {
  const cellSize = 12;
  const gap = 2;

  const valueMap = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of data) m[d.date] = d.value;
    return m;
  }, [data]);

  const maxValue = maxProp ?? Math.max(...data.map((d) => d.value), 1);
  const [tooltip, setTooltip] = React.useState<{ date: string; value: number; x: number; y: number } | null>(null);

  const startDate = React.useMemo(() => new Date(year, 0, 1), [year]);
  const startDay = startDate.getDay();
  const offset = startDay === 0 ? 6 : startDay - 1;

  const cells = React.useMemo(() => {
    const result: { date: string; value: number; week: number; dow: number }[] = [];
    const d = new Date(year, 0, 1);
    while (d.getFullYear() === year) {
      const iso = d.toISOString().slice(0, 10);
      const dayOfYear = Math.floor((d.getTime() - startDate.getTime()) / 86400000);
      const week = Math.floor((dayOfYear + offset) / 7);
      const dow = (dayOfYear + offset) % 7;
      result.push({ date: iso, value: valueMap[iso] ?? 0, week, dow });
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [year, valueMap, offset, startDate]);

  const getColor = (val: number) => {
    if (val === 0) return colorScale[0];
    const idx = Math.min(Math.ceil((val / maxValue) * (colorScale.length - 1)), colorScale.length - 1);
    return colorScale[idx];
  };

  const totalWeeks = cells.length > 0 ? cells[cells.length - 1].week + 1 : 53;
  const svgW = totalWeeks * (cellSize + gap) + 32;
  const svgH = 7 * (cellSize + gap) + 24;

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
        {year} Activity
      </div>
      <div className="overflow-x-auto relative">
        <svg width={svgW} height={svgH} className="font-mono">
          {DAY_LABELS.map((label, i) => (
            label && (
              <text key={i} x={0} y={24 + i * (cellSize + gap) + cellSize / 2} dy="0.35em" fill="#67e8f9" fontSize={9} opacity={0.5}>
                {label}
              </text>
            )
          ))}
          {cells.map((cell, i) => (
            <rect
              key={i}
              x={32 + cell.week * (cellSize + gap)}
              y={24 + cell.dow * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={2}
              fill={getColor(cell.value)}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={(e) => {
                const r = (e.target as SVGRectElement).getBoundingClientRect();
                setTooltip({ date: cell.date, value: cell.value, x: r.x, y: r.y });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
          {MONTH_LABELS.map((label, m) => {
            const firstOfMonth = new Date(year, m, 1);
            const dayOfYear = Math.floor((firstOfMonth.getTime() - startDate.getTime()) / 86400000);
            const week = Math.floor((dayOfYear + offset) / 7);
            return (
              <text key={m} x={32 + week * (cellSize + gap)} y={16} fill="#67e8f9" fontSize={9} opacity={0.5}>
                {label}
              </text>
            );
          })}
        </svg>
        {tooltip && (
          <div className="absolute pointer-events-none bg-black/90 border border-cyan-500/30 rounded px-2 py-1 text-[10px] font-mono text-cyan-300 -translate-y-full" style={{ left: 0, top: 16 }}>
            {tooltip.date}: {tooltip.value}
          </div>
        )}
      </div>
    </div>
  );
}
