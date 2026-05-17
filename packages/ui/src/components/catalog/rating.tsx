"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RatingProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

/**
 * Rating - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/Rating.tsx
 * @catalog-status candidate
 */
export function Rating({ value = 0, max = 5, onChange, readOnly = false, className }: RatingProps) {
  const [hover, setHover] = React.useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          className={cn(
            "text-lg transition-colors",
            i < display ? "text-cyan-400" : "text-cyan-500/20",
            !readOnly && "cursor-pointer hover:scale-110"
          )}
          onMouseEnter={() => !readOnly && setHover(i + 1)}
          onMouseLeave={() => setHover(null)}
          onClick={() => !readOnly && onChange?.(i + 1)}
          disabled={readOnly}
        >
          {"\u2605"}
        </button>
      ))}
    </div>
  );
}
