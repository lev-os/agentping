"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TransferItem {
  id: string;
  label: string;
}

export interface TransferListProps {
  available?: TransferItem[];
  selected?: TransferItem[];
  onChange?: (available: TransferItem[], selected: TransferItem[]) => void;
  className?: string;
}

export function TransferList({
  available = [],
  selected = [],
  onChange,
  className,
}: TransferListProps) {
  const [leftPicked, setLeftPicked] = React.useState<Set<string>>(new Set());
  const [rightPicked, setRightPicked] = React.useState<Set<string>>(new Set());

  const moveRight = () => {
    const moving = available.filter((i) => leftPicked.has(i.id));
    onChange?.(
      available.filter((i) => !leftPicked.has(i.id)),
      [...selected, ...moving]
    );
    setLeftPicked(new Set());
  };

  const moveLeft = () => {
    const moving = selected.filter((i) => rightPicked.has(i.id));
    onChange?.(
      [...available, ...moving],
      selected.filter((i) => !rightPicked.has(i.id))
    );
    setRightPicked(new Set());
  };

  const toggleSet = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setFn(next);
  };

  const renderColumn = (
    items: TransferItem[],
    picked: Set<string>,
    setPicked: React.Dispatch<React.SetStateAction<Set<string>>>,
    title: string
  ) => (
    <div className="flex-1 border border-cyan-500/20 rounded-lg overflow-hidden">
      <div className="px-3 py-1.5 bg-cyan-500/5 text-[10px] text-cyan-400 uppercase tracking-wider">
        {title} ({items.length})
      </div>
      <div className="max-h-48 overflow-y-auto divide-y divide-cyan-500/5">
        {items.length === 0 && (
          <div className="p-3 text-xs text-cyan-500/30">Empty</div>
        )}
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-cyan-500/5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={picked.has(item.id)}
              onChange={() => toggleSet(picked, setPicked, item.id)}
              className="accent-cyan-500"
            />
            <span className="text-sm text-cyan-100 truncate">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("flex items-center gap-2 font-mono bg-black/60 rounded-lg p-3", className)}>
      {renderColumn(available, leftPicked, setLeftPicked, "Available")}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={moveRight}
          disabled={leftPicked.size === 0}
          className="px-2 py-1 text-xs border border-cyan-500/20 rounded hover:bg-cyan-500/10 text-cyan-400 disabled:opacity-30 transition-colors"
        >
          &rarr;
        </button>
        <button
          type="button"
          onClick={moveLeft}
          disabled={rightPicked.size === 0}
          className="px-2 py-1 text-xs border border-cyan-500/20 rounded hover:bg-cyan-500/10 text-cyan-400 disabled:opacity-30 transition-colors"
        >
          &larr;
        </button>
      </div>
      {renderColumn(selected, rightPicked, setRightPicked, "Selected")}
    </div>
  );
}
