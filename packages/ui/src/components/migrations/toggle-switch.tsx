"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  checked: controlledChecked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleSwitchProps) {
  const [internal, setInternal] = React.useState(controlledChecked ?? false);
  const isOn = controlledChecked ?? internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    setInternal(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-3 font-mono text-sm select-none",
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors duration-200",
          isOn
            ? "bg-emerald-500/60 border-emerald-400"
            : "bg-white/10 border-cyan-500/20",
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full shadow-md transition-transform duration-200 mt-0.5",
            isOn
              ? "translate-x-5 bg-emerald-300"
              : "translate-x-0.5 bg-cyan-500/40",
          )}
        />
      </span>
      {label && <span className="text-cyan-300">{label}</span>}
    </button>
  );
}
