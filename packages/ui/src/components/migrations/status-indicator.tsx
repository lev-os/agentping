"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StatusIndicatorProps {
  status?: "online" | "offline" | "busy" | "away";
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * StatusIndicator - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/StatusIndicator.tsx
 * @migration-status candidate
 */
export function StatusIndicator({ status = "offline", label, size = "md", className }: StatusIndicatorProps) {
  const dotColors: Record<string, string> = { online: "bg-green-500", offline: "bg-zinc-500", busy: "bg-red-500", away: "bg-yellow-500" };
  const sizes: Record<string, string> = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-3 h-3" };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className={cn("rounded-full", dotColors[status], sizes[size], status === "online" && "animate-pulse")} />
      {label && <span className="text-xs font-mono text-cyan-300/80">{label}</span>}
    </div>
  );
}
