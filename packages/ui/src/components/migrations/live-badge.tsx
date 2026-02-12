"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LiveBadgeProps {
  label?: string;
  pulsing?: boolean;
  className?: string;
}

/**
 * LiveBadge - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LiveBadge.tsx
 * @migration-status candidate
 */
export function LiveBadge({ label = "LIVE", pulsing = true, className }: LiveBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium text-red-400", className)}>
      <span className={cn("h-2 w-2 rounded-full bg-red-500", pulsing && "animate-pulse")} />
      {label}
    </span>
  );
}
