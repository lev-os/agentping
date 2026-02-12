"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface NetworkNode {
  id: string;
  label?: string;
  x: number;
  y: number;
  type?: "primary" | "secondary" | "hub";
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkGraphProps {
  nodes?: NetworkNode[];
  links?: NetworkLink[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * NetworkGraph - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/NetworkGraph.tsx
 * @migration-status candidate
 * @needs-review Complex SVG network visualization
 */
export function NetworkGraph({ nodes = [], links = [], width = 600, height = 400, className }: NetworkGraphProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const typeColors: Record<string, string> = { primary: "#00e5ff", secondary: "#7c3aed", hub: "#f59e0b" };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {links.map((link, i) => {
          const src = nodes.find((n) => n.id === link.source);
          const tgt = nodes.find((n) => n.id === link.target);
          if (!src || !tgt) return null;
          const active = selected && (selected === link.source || selected === link.target);
          return <line key={i} x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} stroke={active ? "rgba(0,229,255,0.6)" : "rgba(0,229,255,0.15)"} strokeWidth={active ? 2 : 1} />;
        })}
        {nodes.map((node) => (
          <g key={node.id} onClick={() => setSelected(selected === node.id ? null : node.id)} className="cursor-pointer">
            <circle cx={node.x} cy={node.y} r={selected === node.id ? 8 : 5} fill={typeColors[node.type || "primary"]} opacity={0.8} />
            {node.label && <text x={node.x} y={node.y + 16} textAnchor="middle" fill="rgba(0,229,255,0.6)" fontSize="9" fontFamily="monospace">{node.label}</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}
