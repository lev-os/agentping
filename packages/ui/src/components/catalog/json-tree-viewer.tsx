"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface JsonTreeViewerProps {
  data?: unknown;
  title?: string;
  defaultExpanded?: boolean;
  className?: string;
}

function JsonNode({ name, value, depth = 0 }: { name?: string; value: unknown; depth?: number }) {
  const [expanded, setExpanded] = React.useState(depth < 2);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const entries = isObject ? Object.entries(value as Record<string, unknown>) : [];

  if (!isObject) {
    const color = typeof value === "string" ? "text-green-400" : typeof value === "number" ? "text-orange-400" : typeof value === "boolean" ? "text-violet-400" : "text-zinc-400";
    return (
      <div className="flex gap-1" style={{ paddingLeft: depth * 16 }}>
        {name && <span className="text-cyan-400">{name}:</span>}
        <span className={color}>{JSON.stringify(value)}</span>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div className="flex gap-1 cursor-pointer hover:bg-cyan-500/5 rounded px-1" onClick={() => setExpanded(!expanded)}>
        <span className="text-cyan-500/40">{expanded ? "\u25BC" : "\u25B6"}</span>
        {name && <span className="text-cyan-400">{name}:</span>}
        <span className="text-cyan-500/40">{isArray ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </div>
      {expanded && entries.map(([k, v]) => <JsonNode key={k} name={k} value={v} depth={depth + 1} />)}
    </div>
  );
}

/**
 * JsonTreeViewer - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/data/JsonTreeViewer.tsx
 * @catalog-status candidate
 */
export function JsonTreeViewer({ data, title, className }: JsonTreeViewerProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      {title && (
        <div className="px-4 py-2 border-b border-cyan-500/10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title}</span>
        </div>
      )}
      <div className="p-3 text-xs font-mono overflow-x-auto">
        <JsonNode value={data} />
      </div>
    </div>
  );
}
