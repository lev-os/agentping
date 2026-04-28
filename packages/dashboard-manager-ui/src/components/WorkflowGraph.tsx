import { useEffect, useMemo, useRef, useState } from "react";

import type { WorkflowEdge, WorkflowNode } from "../api/workflows";

interface WorkflowGraphProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  compact?: boolean;
}

interface GraphLine {
  id: string;
  path: string;
  kind: WorkflowEdge["kind"];
}

function nodeTone(type: string, terminal: boolean): string {
  if (terminal || type === "terminal") return "workflow-node--terminal";
  if (type === "gate") return "workflow-node--gate";
  if (type === "agent") return "workflow-node--agent";
  if (type === "workflow") return "workflow-node--workflow";
  if (type === "subgraph") return "workflow-node--subgraph";
  if (type === "exec" || type === "function") return "workflow-node--exec";
  return "workflow-node--default";
}

export function WorkflowGraph({ nodes, edges, compact = false }: WorkflowGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<GraphLine[]>([]);

  const levels = useMemo(() => {
    const grouped = new Map<number, WorkflowNode[]>();
    for (const node of nodes) {
      const bucket = grouped.get(node.level) ?? [];
      bucket.push(node);
      grouped.set(node.level, bucket);
    }
    return [...grouped.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([level, entries]) => ({
        level,
        nodes: entries.sort((a, b) => a.order - b.order),
      }));
  }, [nodes]);

  useEffect(() => {
    function recompute() {
      if (!containerRef.current) return;
      const frame = containerRef.current.getBoundingClientRect();
      const nextLines: GraphLine[] = [];

      for (const edge of edges) {
        const source = nodeRefs.current[edge.source];
        const target = nodeRefs.current[edge.target];
        if (!source || !target) continue;

        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const x1 = sourceRect.right - frame.left;
        const y1 = sourceRect.top - frame.top + sourceRect.height / 2;
        const x2 = targetRect.left - frame.left;
        const y2 = targetRect.top - frame.top + targetRect.height / 2;
        const midX = x1 + Math.max(24, (x2 - x1) / 2);
        const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

        nextLines.push({
          id: edge.id,
          path,
          kind: edge.kind,
        });
      }

      setLines(nextLines);
    }

    recompute();

    const observer = new ResizeObserver(() => recompute());
    if (containerRef.current) observer.observe(containerRef.current);
    for (const node of Object.values(nodeRefs.current)) {
      if (node) observer.observe(node);
    }
    window.addEventListener("resize", recompute);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [edges, levels]);

  return (
    <div
      ref={containerRef}
      className={`workflow-graph${compact ? " workflow-graph--compact" : ""}`}
    >
      <svg className="workflow-graph__svg" aria-hidden="true">
        {lines.map((line) => (
          <path
            key={line.id}
            d={line.path}
            className={`workflow-graph__edge workflow-graph__edge--${line.kind}`}
          />
        ))}
      </svg>

      <div className="workflow-graph__columns">
        {levels.map((column) => (
          <div key={column.level} className="workflow-graph__column">
            <div className="workflow-graph__column-label">L{column.level}</div>
            {column.nodes.map((node) => (
              <div
                key={node.id}
                ref={(element) => {
                  nodeRefs.current[node.id] = element;
                }}
                className={`workflow-node ${nodeTone(node.type, node.terminal)}`}
              >
                <div className="workflow-node__id">{node.id}</div>
                <div className="workflow-node__label">{node.label}</div>
                <div className="workflow-node__meta">
                  <span className="workflow-node__type">{node.type}</span>
                  {node.terminal ? (
                    <span className="workflow-node__terminal">terminal</span>
                  ) : null}
                </div>
                {!compact && node.description ? (
                  <div className="workflow-node__description">{node.description}</div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
