"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TopologyNode {
  id: string;
  label: string;
  type: "server" | "db" | "client" | "service";
  status: "healthy" | "warning" | "error";
  x: number;
  y: number;
}

export interface TopologyLink {
  source: string;
  target: string;
  traffic?: number;
}

export interface NetworkTopologyProps {
  nodes?: TopologyNode[];
  links?: TopologyLink[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * NetworkTopology - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/NetworkTopology.tsx
 * @migration-status candidate
 * @needs-review Complex SVG topology visualization
 */
export function NetworkTopology({ nodes = [], links = [], width = 600, height = 400, className }: NetworkTopologyProps) {
  const statusColors: Record<string, string> = { healthy: "#22c55e", warning: "#eab308", error: "#ef4444" };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">NETWORK TOPOLOGY</span>
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {links.map((l, i) => {
          const s = nodes.find((n) => n.id === l.source);
          const t = nodes.find((n) => n.id === l.target);
          if (!s || !t) return null;
          return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="rgba(0,229,255,0.15)" strokeWidth="1" />;
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="8" fill="rgba(0,0,0,0.6)" stroke={statusColors[n.status]} strokeWidth="2" />
            <text x={n.x} y={n.y + 18} textAnchor="middle" fill="rgba(0,229,255,0.6)" fontSize="8" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
