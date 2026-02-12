"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

/**
 * DatePicker - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DatePicker.tsx
 * @migration-status candidate
 */
export function DatePicker({ value, onChange, label, placeholder = "Select date...", className }: DatePickerProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      <input
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 text-sm bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
