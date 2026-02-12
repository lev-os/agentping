"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SegmentedControlProps {
  options?: string[];
  selected?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options = [],
  selected,
  onChange,
  className,
}: SegmentedControlProps) {
  const [internal, setInternal] = React.useState(selected ?? options[0] ?? "");
  const current = selected ?? internal;

  const handleSelect = (opt: string) => {
    setInternal(opt);
    onChange?.(opt);
  };

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-cyan-500/20 bg-black/60 p-0.5 font-mono",
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => handleSelect(opt)}
          className={cn(
            "px-3 py-1.5 text-xs rounded-md transition-all duration-200",
            current === opt
              ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.2)]"
              : "text-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
