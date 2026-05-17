"use client";

/**
 * Tooltip — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/ui/Tooltip.tsx
 * @catalog-status complete
 * @category ui-primitive
 */

import React from "react";
import { cn } from "../../lib/utils";

export interface TooltipProps {
  /** Tooltip text content */
  text: string;
  /** Optional keyboard shortcut to display */
  shortcut?: string;
  /** Tooltip position relative to trigger */
  position?: "top" | "bottom" | "left" | "right";
  /** Whether the tooltip is visible */
  visible?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const positionStyles: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({
  text,
  shortcut,
  position = "top",
  visible = true,
  className,
}: TooltipProps) {
  if (!visible) return null;

  return (
    <div
      role="tooltip"
      className={cn(
        "absolute z-50 pointer-events-none",
        "px-2 py-1 rounded-md",
        "bg-zinc-900 border border-zinc-700/50",
        "text-xs text-zinc-300 whitespace-nowrap",
        "shadow-lg shadow-black/20",
        "animate-in fade-in zoom-in-95 duration-150",
        positionStyles[position],
        className,
      )}
    >
      <span>{text}</span>
      {shortcut && (
        <span className="ml-2 text-zinc-500 font-mono text-[10px]">
          {shortcut}
        </span>
      )}
    </div>
  );
}
