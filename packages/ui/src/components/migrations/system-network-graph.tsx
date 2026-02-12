"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SystemNetworkNode {
  id: string;
  label: string;
  type: "server" | "firewall" | "switch" | "endpoint";
  status: "online" | "offline" | "warning";
  x: number;
  y: number;
}

export interface SystemNetworkLink {
  source: string;
  target: string;
  encrypted?: boolean;
}

export interface SystemNetworkGraphProps {
  nodes?: SystemNetworkNode[];
  links?: SystemNetworkLink[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * NetworkGraph (System) - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/NetworkGraph.tsx
 * @migration-status candidate
 * @needs-review Complex SVG network visualization
 */
export function SystemNetworkGraph({ nodes = [], links = [], width = 600, height = 400, className }: SystemNetworkGraphProps) {
  const statusColors: Record<string, string> = {
    online: "fill-green-500",
    offline: "fill-red-500",
    warning: "fill-yellow-500",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">NETWORK MAP</span>
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {links.map((link, i) => {
          const src = nodes.find((n) => n.id === link.source);
          const tgt = nodes.find((n) => n.id === link.target);
          if (!src || !tgt) return null;
          return (
            <line key={i} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
              stroke={link.encrypted ? "rgba(34,197,94,0.3)" : "rgba(0,229,255,0.15)"}
              strokeWidth="1" strokeDasharray={link.encrypted ? "" : "4 2"} />
          );
        })}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="6" className={statusColors[node.status]} opacity="0.8" />
            <text x={node.x} y={node.y + 16} textAnchor="middle" fill="rgb(0,229,255)" fontSize="8" fontFamily="monospace" opacity="0.6">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
