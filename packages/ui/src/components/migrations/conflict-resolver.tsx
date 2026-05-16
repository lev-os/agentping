"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ConflictResolverProps {
  base: string;
  current: string;
  incoming: string;
  filename: string;
  onResolve?: (resolved: string) => void;
  className?: string;
}

/**
 * ConflictResolver - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ConflictResolver.tsx
 * @migration-status candidate
 */
export function ConflictResolver({ base, current, incoming, filename, onResolve, className }: ConflictResolverProps) {
  const [selected, setSelected] = React.useState<"current" | "incoming" | "both">("current");

  const resolved = selected === "current" ? current : selected === "incoming" ? incoming : `${current}\n${incoming}`;

  return (
    <div className={cn("border border-border rounded-md bg-card overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-border bg-muted/50 text-sm font-medium text-foreground">{filename}</div>
      <div className="px-4 py-2 border-b border-border bg-muted/20">
        <div className="text-xs text-muted-foreground mb-1">Base</div>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-24 overflow-auto">{base}</pre>
      </div>
      <div className="grid grid-cols-2 gap-0 border-b border-border">
        <div className="p-3 border-r border-border">
          <div className="text-xs text-muted-foreground mb-1">Current</div>
          <pre className="text-xs text-foreground whitespace-pre-wrap">{current}</pre>
        </div>
        <div className="p-3">
          <div className="text-xs text-muted-foreground mb-1">Incoming</div>
          <pre className="text-xs text-foreground whitespace-pre-wrap">{incoming}</pre>
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2">
        {(["current", "incoming", "both"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={cn("px-3 py-1 text-xs rounded-md border transition-colors capitalize",
              selected === opt ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {opt}
          </button>
        ))}
        <button onClick={() => onResolve?.(resolved)} className="ml-auto px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground">
          Resolve
        </button>
      </div>
    </div>
  );
}
