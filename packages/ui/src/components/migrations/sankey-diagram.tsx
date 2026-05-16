"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SankeyNode {
  id: string;
  label: string;
  column: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  className?: string;
}

const COLUMN_COLORS = [
  "#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899",
];
const SANKEY_PADDING = { top: 20, right: 20, bottom: 20, left: 20 };
const SANKEY_NODE_WIDTH = 18;

/**
 * SankeyDiagram - Flow diagram with weighted links
 * @source packages/adapters/web-ui/src/components/SankeyDiagram.tsx
 * @migration-status implemented
 */
export function SankeyDiagram({
  nodes,
  links,
  width = 600,
  height = 400,
  className,
}: SankeyDiagramProps) {
  const padding = SANKEY_PADDING;
  const nodeWidth = SANKEY_NODE_WIDTH;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const columns = Math.max(...nodes.map((n) => n.column), 0) + 1;
  const colX = React.useCallback(
    (col: number) =>
      padding.left + (col / Math.max(columns - 1, 1)) * (innerW - nodeWidth),
    [columns, innerW, padding.left, nodeWidth],
  );

  const nodesByCol = React.useMemo(() => {
    const grouped: Record<number, SankeyNode[]> = {};
    for (const n of nodes) {
      (grouped[n.column] ??= []).push(n);
    }
    return grouped;
  }, [nodes]);

  const nodePositions = React.useMemo(() => {
    const pos: Record<string, { x: number; y: number; h: number }> = {};
    for (const [colStr, colNodes] of Object.entries(nodesByCol)) {
      const col = Number(colStr);
      const x = colX(col);
      const gap = 8;
      const availH = innerH - gap * (colNodes.length - 1);

      const nodeValues = colNodes.map((n) => {
        const inVal = links.filter((l) => l.target === n.id).reduce((s, l) => s + l.value, 0);
        const outVal = links.filter((l) => l.source === n.id).reduce((s, l) => s + l.value, 0);
        return Math.max(inVal, outVal, 1);
      });
      const colTotal = nodeValues.reduce((s, v) => s + v, 0);

      let cy = padding.top;
      colNodes.forEach((n, i) => {
        const h = Math.max((nodeValues[i] / colTotal) * availH, 16);
        pos[n.id] = { x, y: cy, h };
        cy += h + gap;
      });
    }
    return pos;
  }, [nodesByCol, links, colX, innerH, padding.top]);

  const [hovered, setHovered] = React.useState<string | null>(null);

  const maxVal = Math.max(...links.map((l) => l.value), 1);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-3">
        Flow Diagram
      </div>
      <svg width={width} height={height} className="overflow-visible">
        {links.map((link, i) => {
          const src = nodePositions[link.source];
          const tgt = nodePositions[link.target];
          if (!src || !tgt) return null;
          const strokeW = Math.max((link.value / maxVal) * 24, 2);
          const sy = src.y + src.h / 2;
          const ty = tgt.y + tgt.h / 2;
          const sx = src.x + nodeWidth;
          const tx = tgt.x;
          const mx = (sx + tx) / 2;
          const isActive = hovered === link.source || hovered === link.target;
          return (
            <path
              key={`link-${i}`}
              d={`M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`}
              fill="none"
              stroke={isActive ? "#06b6d4" : "#06b6d440"}
              strokeWidth={strokeW}
              strokeOpacity={isActive ? 0.7 : 0.3}
              className="transition-all duration-200"
            />
          );
        })}
        {nodes.map((node) => {
          const p = nodePositions[node.id];
          if (!p) return null;
          const color = COLUMN_COLORS[node.column % COLUMN_COLORS.length];
          return (
            <g
              key={node.id}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <rect
                x={p.x}
                y={p.y}
                width={nodeWidth}
                height={p.h}
                rx={3}
                fill={color}
                opacity={hovered === node.id ? 1 : 0.8}
                className="transition-opacity duration-150"
              />
              <text
                x={p.x + nodeWidth + 6}
                y={p.y + p.h / 2}
                dy="0.35em"
                fill="#a5f3fc"
                fontSize={11}
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
