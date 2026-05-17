"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export { cn };

export interface SharedComponentsProps {
  className?: string;
}

/**
 * SharedComponents - Barrel re-export module
 *
 * This module serves as a re-export barrel for shared primitives
 * used across the catalog component library. The visual component
 * below is an informational placeholder for Storybook.
 */
export function SharedComponents({ className }: SharedComponentsProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-5 font-mono max-w-sm",
        className,
      )}
    >
      <div className="text-xs text-cyan-400 uppercase tracking-wider mb-2">
        Shared Components
      </div>
      <div className="text-xs text-cyan-500/50 leading-relaxed">
        Barrel re-export module for shared primitives. Exports:{" "}
        <code className="text-cyan-400/70">cn</code> (className merger).
      </div>
      <div className="mt-3 flex gap-2">
        <span className="inline-block px-2 py-0.5 text-[10px] rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          cn()
        </span>
      </div>
    </div>
  );
}
