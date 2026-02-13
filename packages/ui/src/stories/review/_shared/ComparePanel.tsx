"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";

const VARIANT_COLORS = {
  agentping: {
    indicator: "bg-amber-500",
    border: "border-amber-500/20",
    label: "text-amber-400",
  },
  sophia: {
    indicator: "bg-cyan-500",
    border: "border-cyan-500/20",
    label: "text-cyan-400",
  },
  combined: {
    indicator: "bg-purple-500",
    border: "border-purple-500/20",
    label: "text-purple-400",
  },
} as const;

interface CompareLane {
  id: string;
  label: string;
  content: React.ReactNode;
  variant?: "agentping" | "sophia" | "combined";
}

interface ComparePanelProps {
  title: string;
  lanes: CompareLane[];
  className?: string;
}

export function ComparePanel({ title, lanes, className }: ComparePanelProps) {
  const [visibleLanes, setVisibleLanes] = React.useState<Set<string>>(
    () => new Set(lanes.map((l) => l.id)),
  );

  const toggleLane = (id: string) => {
    setVisibleLanes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const activeLanes = lanes.filter((l) => visibleLanes.has(l.id));

  return (
    <div
      className={cn(
        "rounded-lg border border-cyan-500/10 bg-black/40 p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-mono text-sm font-medium text-cyan-300">
          {title}
        </h3>
        <div className="flex gap-1">
          {lanes.map((lane) => {
            const variant = lane.variant ?? "agentping";
            const colors = VARIANT_COLORS[variant];
            const active = visibleLanes.has(lane.id);
            return (
              <button
                key={lane.id}
                type="button"
                onClick={() => toggleLane(lane.id)}
                className={cn(
                  "rounded px-2 py-0.5 font-mono text-xs transition-opacity",
                  colors.label,
                  active ? "opacity-100" : "opacity-30",
                )}
              >
                {lane.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${activeLanes.length}, minmax(0, 1fr))`,
        }}
      >
        {activeLanes.map((lane) => {
          const variant = lane.variant ?? "agentping";
          const colors = VARIANT_COLORS[variant];
          return (
            <div
              key={lane.id}
              className={cn(
                "flex flex-col rounded-md border bg-black/30",
                colors.border,
              )}
            >
              <div className="flex items-center gap-2 border-b border-white/5 px-3 py-1.5">
                <span
                  className={cn("h-2 w-2 rounded-full", colors.indicator)}
                />
                <span className={cn("font-mono text-xs", colors.label)}>
                  {lane.label}
                </span>
              </div>
              <div className="max-h-[400px] overflow-auto p-3">
                {lane.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
