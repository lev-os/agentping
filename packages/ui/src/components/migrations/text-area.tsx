"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function TextArea({
  value = "",
  onChange,
  placeholder = "Enter text...",
  rows = 4,
  maxLength,
  label,
  disabled = false,
  className,
}: TextAreaProps) {
  return (
    <div className={cn("font-mono", className)}>
      {label && (
        <label className="block text-xs text-cyan-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          "w-full bg-black/60 border border-cyan-500/20 rounded-lg px-3 py-2 text-sm text-cyan-100 placeholder:text-cyan-500/30 resize-y",
          "focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      {maxLength !== undefined && (
        <div className="text-right text-[10px] text-cyan-500/40 mt-1">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}
