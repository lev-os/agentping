"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * MultiSelect - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MultiSelect.tsx
 * @catalog-status candidate
 */
export function MultiSelect({ options = [], selected = [], onChange, placeholder = "Select...", className }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggle = (value: string) => {
    const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    onChange?.(next);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md bg-card text-left"
      >
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-1 flex-1">
            {selected.map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span key={v} className="inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">
                  {opt?.label ?? v}
                  <button onClick={(e) => { e.stopPropagation(); toggle(v); }} className="text-muted-foreground hover:text-foreground">&times;</button>
                </span>
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground flex-1">{placeholder}</span>
        )}
        <span className="text-muted-foreground text-xs shrink-0">{open ? "\u25B2" : "\u25BC"}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted transition-colors text-left"
            >
              <span className={cn("h-4 w-4 rounded border flex items-center justify-center text-[10px]",
                selected.includes(opt.value) ? "border-primary bg-primary text-primary-foreground" : "border-border"
              )}>
                {selected.includes(opt.value) && "\u2713"}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
