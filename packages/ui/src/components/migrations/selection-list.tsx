"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SelectionItem {
  id: string;
  label: string;
  selected?: boolean;
}

export interface SelectionListProps {
  items?: SelectionItem[];
  onChange?: (items: SelectionItem[]) => void;
  selectAll?: boolean;
  className?: string;
}

export function SelectionList({
  items = [],
  onChange,
  selectAll = true,
  className,
}: SelectionListProps) {
  const selectedCount = items.filter((i) => i.selected).length;
  const allSelected = items.length > 0 && selectedCount === items.length;

  const toggle = (id: string) => {
    onChange?.(items.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
  };

  const toggleAll = () => {
    const next = !allSelected;
    onChange?.(items.map((i) => ({ ...i, selected: next })));
  };

  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg font-mono",
        className
      )}
    >
      {selectAll && items.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-500/10">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="accent-cyan-500"
          />
          <span className="text-xs text-cyan-400">
            {selectedCount}/{items.length} selected
          </span>
        </div>
      )}
      {items.length === 0 && (
        <div className="p-4 text-xs text-cyan-500/30">No items</div>
      )}
      {items.map((item) => (
        <label
          key={item.id}
          className="flex items-center gap-2 px-3 py-2 hover:bg-cyan-500/5 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            checked={!!item.selected}
            onChange={() => toggle(item.id)}
            className="accent-cyan-500"
          />
          <span className="text-sm text-cyan-100">{item.label}</span>
        </label>
      ))}
    </div>
  );
}
