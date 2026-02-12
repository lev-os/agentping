"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export interface StepChecklistProps {
  items?: ChecklistItem[];
  onToggle?: (index: number) => void;
  className?: string;
}

export function StepChecklist({
  items = [],
  onToggle,
  className,
}: StepChecklistProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono",
        className,
      )}
    >
      {items.length === 0 && (
        <div className="text-xs text-cyan-500/30">No items</div>
      )}
      <ul className="flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onToggle?.(i)}
              className="flex items-center gap-2 w-full text-left py-1 px-1 rounded hover:bg-cyan-500/5 transition-colors"
            >
              <span
                className={cn(
                  "flex items-center justify-center w-4 h-4 rounded border text-[10px]",
                  item.checked
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                    : "border-cyan-500/20 text-transparent",
                )}
              >
                {"\u2713"}
              </span>
              <span
                className={cn(
                  "text-sm transition-all",
                  item.checked
                    ? "text-cyan-500/40 line-through"
                    : "text-cyan-300",
                )}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
