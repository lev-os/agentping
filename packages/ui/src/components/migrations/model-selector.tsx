"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ModelOption {
  id: string;
  name: string;
  provider?: string;
  description?: string;
}

export interface ModelSelectorProps {
  models: ModelOption[];
  selected?: string;
  onSelect?: (modelId: string) => void;
  className?: string;
}

/**
 * ModelSelector - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ModelSelector.tsx
 * @migration-status candidate
 */
export function ModelSelector({ models, selected, onSelect, className }: ModelSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onSelect?.(model.id)}
          className={cn(
            "flex items-start gap-3 px-3 py-2 rounded-md border transition-colors text-left",
            selected === model.id ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">{model.name}</div>
            {model.provider && <div className="text-xs text-muted-foreground">{model.provider}</div>}
            {model.description && <div className="text-xs text-muted-foreground mt-0.5">{model.description}</div>}
          </div>
          {selected === model.id && <span className="text-primary text-sm shrink-0">&#x2713;</span>}
        </button>
      ))}
    </div>
  );
}
