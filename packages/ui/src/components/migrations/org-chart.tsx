"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface OrgChartProps {
  data?: OrgNode;
  className?: string;
}

function OrgTreeNode({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="border border-cyan-500/20 bg-black/60 rounded-lg p-2 text-center min-w-[100px]">
        <div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-1 flex items-center justify-center text-[10px] font-mono text-cyan-400">
          {node.name.charAt(0)}
        </div>
        <div className="text-xs font-mono text-cyan-300">{node.name}</div>
        <div className="text-[10px] font-mono text-cyan-500/40">{node.role}</div>
      </div>
      {node.children && node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-cyan-500/20" />
          <div className="flex gap-4">
            {node.children.map((child) => (
              <OrgTreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * OrgChart - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/OrgChart.tsx
 * @migration-status candidate
 * @needs-review Recursive tree rendering
 */
export function OrgChart({ data, className }: OrgChartProps) {
  if (!data) return null;
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4 overflow-x-auto", className)}>
      <OrgTreeNode node={data} />
    </div>
  );
}
