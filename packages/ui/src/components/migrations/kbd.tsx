"use client";

/**
 * Kbd — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/ui/Kbd.tsx
 * @migration-status complete
 * @category ui-primitive
 */

import React from "react";
import { cn } from "../../lib/utils";

const KEY_SYMBOLS: Record<string, string> = {
  Mod: navigator?.platform?.includes("Mac") ? "\u2318" : "Ctrl",
  Ctrl: "\u2303",
  Alt: navigator?.platform?.includes("Mac") ? "\u2325" : "Alt",
  Shift: "\u21E7",
  Enter: "\u23CE",
  Backspace: "\u232B",
  Delete: "\u2326",
  Escape: "\u238B",
  Tab: "\u21E5",
  Space: "\u2423",
  Up: "\u2191",
  Down: "\u2193",
  Left: "\u2190",
  Right: "\u2192",
};

export interface KbdProps {
  /** Keyboard shortcut string, e.g. "Mod+K" or "Mod+Shift+Z" */
  keys: string;
  /** Additional CSS classes */
  className?: string;
}

export function Kbd({ keys, className }: KbdProps) {
  const parts = keys.split("+").map((key) => {
    const trimmed = key.trim();
    return KEY_SYMBOLS[trimmed] || trimmed.toUpperCase();
  });

  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-0.5 font-mono text-[11px] leading-none",
        "text-zinc-500",
        className,
      )}
    >
      {parts.map((part, i) => (
        <span
          key={i}
          className={cn(
            "inline-flex items-center justify-center",
            "min-w-[18px] h-[18px] px-1",
            "rounded border border-zinc-700/50 bg-zinc-800/50",
            "text-zinc-400",
          )}
        >
          {part}
        </span>
      ))}
    </kbd>
  );
}
