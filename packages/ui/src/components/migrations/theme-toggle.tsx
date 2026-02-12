"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ThemeToggleProps {
  theme?: "light" | "dark";
  onToggle?: (theme: "light" | "dark") => void;
  className?: string;
}

export function ThemeToggle({
  theme: controlledTheme,
  onToggle,
  className,
}: ThemeToggleProps) {
  const [internal, setInternal] = React.useState<"light" | "dark">(
    controlledTheme ?? "dark",
  );
  const current = controlledTheme ?? internal;
  const isDark = current === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setInternal(next);
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors duration-200 font-mono text-lg",
        isDark
          ? "border-cyan-500/20 bg-black/60 text-cyan-400 hover:bg-cyan-500/10"
          : "border-amber-400/40 bg-amber-50 text-amber-500 hover:bg-amber-100",
        className,
      )}
    >
      {isDark ? "\u263D" : "\u2600"}
    </button>
  );
}
