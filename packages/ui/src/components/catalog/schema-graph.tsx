"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SchemaNode {
  id: string;
  name: string;
  fields?: { name: string; type: string }[];
  x: number;
  y: number;
}

export interface SchemaRelation {
  from: string;
  to: string;
  type?: "one-to-one" | "one-to-many" | "many-to-many";
}

export interface SchemaGraphProps {
  nodes?: SchemaNode[];
  relations?: SchemaRelation[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * SchemaGraph - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/SchemaGraph.tsx
 * @catalog-status candidate
 * @needs-review Complex SVG schema visualization
 */
export function SchemaGraph({ nodes = [], relations = [], width = 600, height = 400, className }: SchemaGraphProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">SCHEMA GRAPH</span>
      </div>
      <svg width={width} height={height} className="w-full" viewBox={`0 0 ${width} ${height}`}>
        {relations.map((rel, i) => {
          const from = nodes.find((n) => n.id === rel.from);
          const to = nodes.find((n) => n.id === rel.to);
          if (!from || !to) return null;
          return (
            <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="rgba(0,229,255,0.2)" strokeWidth="1" />
          );
        })}
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x - 50},${node.y - 20})`}>
            <rect width="100" height="40" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(0,229,255,0.3)" strokeWidth="1" />
            <text x="50" y="16" textAnchor="middle" fill="rgb(0,229,255)" fontSize="10" fontFamily="monospace">{node.name}</text>
            {node.fields?.slice(0, 2).map((f, i) => (
              <text key={i} x="50" y={28 + i * 10} textAnchor="middle" fill="rgba(0,229,255,0.4)" fontSize="8" fontFamily="monospace">
                {f.name}: {f.type}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
