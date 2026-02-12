"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StatusCardProps {
  title?: string;
  value?: string | number;
  status?: "success" | "error" | "warning" | "info";
  description?: string;
  className?: string;
}

/**
 * StatusCard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/StatusCard.tsx
 * @migration-status candidate
 */
export function StatusCard({ title, value, status = "info", description, className }: StatusCardProps) {
  const statusColors: Record<string, string> = {
    success: "border-green-500/30",
    error: "border-red-500/30",
    warning: "border-yellow-500/30",
    info: "border-cyan-500/20",
  };
  const dotColors: Record<string, string> = { success: "bg-green-500", error: "bg-red-500", warning: "bg-yellow-500", info: "bg-cyan-400" };

  return (
    <div className={cn("border bg-black/60 rounded-lg p-4", statusColors[status], className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("w-2 h-2 rounded-full", dotColors[status])} />
        {title && <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{title}</span>}
      </div>
      {value !== undefined && <div className="text-xl font-mono text-cyan-300">{value}</div>}
      {description && <div className="text-xs font-mono text-cyan-500/60 mt-1">{description}</div>}
    </div>
  );
}
