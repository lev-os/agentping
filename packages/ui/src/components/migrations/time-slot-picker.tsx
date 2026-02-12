"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selected?: string[];
  onSelect?: (time: string) => void;
  columns?: number;
  className?: string;
}

/**
 * TimeSlotPicker - Grid of time slot buttons
 * @source packages/adapters/web-ui/src/components/TimeSlotPicker.tsx
 * @migration-status implemented
 */
export function TimeSlotPicker({
  slots,
  selected = [],
  onSelect,
  columns = 4,
  className,
}: TimeSlotPickerProps) {
  const selectedCount = selected.length;
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
          Time Slots
        </div>
        <div className="text-[10px] font-mono text-cyan-500/50">
          {selectedCount} selected / {availableCount} available
        </div>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {slots.map((slot) => {
          const isSel = selected.includes(slot.time);
          return (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => slot.available && onSelect?.(slot.time)}
              className={cn(
                "rounded-md border px-2 py-2 text-xs font-mono transition-all duration-150",
                "focus:outline-none focus:ring-1 focus:ring-cyan-400/50",
                !slot.available && "border-red-500/20 bg-red-500/5 text-red-400/50 cursor-not-allowed line-through",
                slot.available && !isSel && "border-green-500/20 bg-green-500/5 text-green-400 hover:bg-green-500/10 cursor-pointer",
                isSel && "border-cyan-400/40 bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30 cursor-pointer"
              )}
            >
              {slot.time}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4 mt-3 text-[9px] font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-green-500/30" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-cyan-500/30" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-red-500/20" /> Taken
        </span>
      </div>
    </div>
  );
}
