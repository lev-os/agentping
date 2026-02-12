"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ColorPickerProps {
  value: string;
  onChange?: (color: string) => void;
  label?: string;
  palette?: string[];
  className?: string;
}

const DEFAULT_PALETTE = ["#00ffff", "#ff00ff", "#00ff88", "#ffcc00", "#ff4444", "#4488ff", "#ffffff", "#888888"];

/**
 * ColorPicker - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ColorPicker.tsx
 * @migration-status candidate
 */
export function ColorPicker({ value, onChange, label, palette = DEFAULT_PALETTE, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      <div className="flex items-center gap-2 flex-wrap">
        {palette.map((color) => (
          <button
            key={color}
            className={cn(
              "h-6 w-6 rounded-full border-2 transition-all",
              value === color ? "border-primary scale-110" : "border-transparent hover:scale-105"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onChange?.(color)}
            title={color}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded border border-border" style={{ backgroundColor: value }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent border border-border rounded px-2 py-1 text-xs text-foreground"
        />
      </div>
    </div>
  );
}
