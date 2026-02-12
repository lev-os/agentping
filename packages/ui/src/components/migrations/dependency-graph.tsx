"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DependencyNode {
  id: string;
  label: string;
  deps: string[];
  status?: "ok" | "warning" | "error";
}

export interface DependencyGraphProps {
  nodes: DependencyNode[];
  onNodeClick?: (node: DependencyNode) => void;
  className?: string;
}

/**
 * DependencyGraph - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DependencyGraph.tsx
 * @migration-status candidate
 * @needs-review Uses simplified list layout — original uses SVG graph rendering
 */
export function DependencyGraph({ nodes, onNodeClick, className }: DependencyGraphProps) {
  const statusColor = { ok: "border-emerald-500", warning: "border-amber-500", error: "border-red-500" };

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {nodes.map((node) => (
        <button
          key={node.id}
          onClick={() => onNodeClick?.(node)}
          className={cn(
            "px-3 py-2 rounded-md border-2 bg-card text-sm text-foreground hover:bg-muted transition-colors text-left",
            statusColor[node.status ?? "ok"]
          )}
        >
          <div className="font-medium">{node.label}</div>
          {node.deps.length > 0 && (
            <div className="text-xs text-muted-foreground mt-1">
              deps: {node.deps.join(", ")}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
