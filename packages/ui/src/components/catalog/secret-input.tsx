"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SecretInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function SecretInput({
  value = "",
  onChange,
  placeholder = "Enter secret...",
  label,
  className,
}: SecretInputProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("font-mono", className)}>
      {label && (
        <label className="block text-xs text-cyan-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2 text-sm text-cyan-100 placeholder:text-cyan-500/30 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="px-3 py-2 text-cyan-500/60 hover:text-cyan-300 transition-colors text-sm"
          aria-label={visible ? "Hide secret" : "Show secret"}
        >
          {visible ? "\u{1F441}" : "\u{1F512}"}
        </button>
      </div>
    </div>
  );
}
