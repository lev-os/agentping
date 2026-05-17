"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ClusterPoint {
  x: number;
  y: number;
  label?: string;
  cluster: number;
}

export interface VectorClusterProps {
  points?: ClusterPoint[];
  width?: number;
  height?: number;
  className?: string;
}

const clusterColors = [
  "#06b6d4", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316",
];

export function VectorCluster({
  points = [],
  width = 400,
  height = 300,
  className,
}: VectorClusterProps) {
  const [hover, setHover] = React.useState<number | null>(null);

  const xMin = points.length ? Math.min(...points.map((p) => p.x)) : 0;
  const xMax = points.length ? Math.max(...points.map((p) => p.x)) : 1;
  const yMin = points.length ? Math.min(...points.map((p) => p.y)) : 0;
  const yMax = points.length ? Math.max(...points.map((p) => p.y)) : 1;
  const pad = 24;
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;

  const scale = (p: ClusterPoint) => ({
    cx: pad + ((p.x - xMin) / xRange) * (width - 2 * pad),
    cy: pad + ((yMax - p.y) / yRange) * (height - 2 * pad),
  });

  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-2 font-mono inline-block",
        className
      )}
    >
      {points.length === 0 ? (
        <div className="text-xs text-cyan-500/30 p-4" style={{ width, height }}>
          No data points
        </div>
      ) : (
        <svg width={width} height={height}>
          {points.map((p, i) => {
            const { cx, cy } = scale(p);
            const color = clusterColors[p.cluster % clusterColors.length];
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={hover === i ? 6 : 4}
                  fill={color}
                  opacity={0.8}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="transition-all cursor-pointer"
                />
                {hover === i && p.label && (
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="#cffafe"
                    fontSize={10}
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
