"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface DatePickerProProps {
  value?: string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
  className?: string;
}

/**
 * DatePickerPro - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/DatePickerPro.tsx
 * @migration-status candidate
 * @needs-review Advanced date picker with time support — verify feature parity
 */
export function DatePickerPro({
  value, onChange, label, placeholder = "Select date...",
  minDate, maxDate, showTime = false, className
}: DatePickerProProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="text-xs text-muted-foreground">{label}</label>}
      <input
        type={showTime ? "datetime-local" : "date"}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        min={minDate}
        max={maxDate}
        className="px-3 py-2 text-sm bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
