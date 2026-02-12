"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ResourceGaugeProps {
  value?: number;
  label?: string;
  variant?: "bar" | "circle";
  color?: string;
  className?: string;
}

function getAutoColor(value: number): string {
  if (value < 50) return "#22c55e";
  if (value < 80) return "#eab308";
  return "#ef4444";
}

export function ResourceGauge({
  value = 0,
  label,
  variant = "bar",
  color,
  className,
}: ResourceGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const fillColor = color ?? getAutoColor(clamped);

  if (variant === "circle") {
    const r = 36;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (clamped / 100) * circumference;

    return (
      <div className={cn("inline-flex flex-col items-center gap-1 font-mono", className)}>
        <svg width={88} height={88} viewBox="0 0 88 88">
          <circle
            cx={44}
            cy={44}
            r={r}
            fill="none"
            stroke="rgba(6,182,212,0.1)"
            strokeWidth={6}
          />
          <circle
            cx={44}
            cy={44}
            r={r}
            fill="none"
            stroke={fillColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 44 44)"
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
          <text
            x={44}
            y={44}
            textAnchor="middle"
            dominantBaseline="central"
            fill={fillColor}
            fontSize={16}
            fontFamily="monospace"
          >
            {clamped}%
          </text>
        </svg>
        {label && (
          <span className="text-[10px] text-cyan-500/50 uppercase tracking-wider">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("font-mono w-48", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-cyan-500/50 uppercase tracking-wider">
            {label}
          </span>
          <span className="text-xs tabular-nums" style={{ color: fillColor }}>
            {clamped}%
          </span>
        </div>
      )}
      <div className="h-2 rounded-full bg-cyan-500/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-400"
          style={{ width: `${clamped}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
}
