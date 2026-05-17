"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface MindMapProps {
  data: MindMapNode;
  className?: string;
}

/**
 * MindMap - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MindMap.tsx
 * @catalog-status candidate
 * @needs-review Simplified tree view — original uses SVG rendering
 */
export function MindMap({ data, className }: MindMapProps) {
  const renderNode = (node: MindMapNode, depth: number = 0): React.ReactNode => (
    <div key={node.id} className="flex flex-col" style={{ marginLeft: depth * 24 }}>
      <div className="flex items-center gap-2 py-1">
        {depth > 0 && <span className="text-muted-foreground/30">&mdash;</span>}
        <span className={cn("text-sm px-2 py-0.5 rounded border", depth === 0 ? "border-primary text-primary font-medium" : "border-border text-foreground")}>
          {node.label}
        </span>
      </div>
      {node.children?.map((child) => renderNode(child, depth + 1))}
    </div>
  );

  return <div className={cn("", className)}>{renderNode(data)}</div>;
}
