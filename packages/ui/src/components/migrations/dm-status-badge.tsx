"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type DmStatusType = "starting" | "online" | "failed" | "stopped" | "unhealthy";

export interface DmStatusBadgeProps {
  status: "starting" | "online" | "failed" | "stopped";
  healthy?: boolean;
  className?: string;
}

const statusStyles: Record<DmStatusType, string> = {
  starting: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  online: "bg-green-500/20 text-green-400 border-green-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  stopped: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  unhealthy: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

/**
 * DmStatusBadge - Migrated from dashboard-manager-ui
 * @source packages/dashboard-manager-ui/src/components/StatusBadge.tsx
 * @migration-status candidate
 */
export function DmStatusBadge({ status, healthy, className }: DmStatusBadgeProps) {
  const displayStatus: DmStatusType =
    status === "online" && healthy === false ? "unhealthy" : status;

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-xs font-mono rounded border",
        statusStyles[displayStatus],
        className,
      )}
      data-status={displayStatus}
    >
      {displayStatus}
    </span>
  );
}
