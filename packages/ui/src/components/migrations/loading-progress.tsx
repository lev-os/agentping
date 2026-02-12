"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface LoadingStage {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete" | "error";
}

export interface LoadingProgressProps {
  stages: LoadingStage[];
  className?: string;
}

/**
 * LoadingProgress - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/LoadingProgress.tsx
 * @migration-status candidate
 */
export function LoadingProgress({ stages, className }: LoadingProgressProps) {
  const statusIcon: Record<string, string> = { pending: "\u25CB", loading: "\u25D4", complete: "\u2713", error: "\u2717" };
  const statusColor: Record<string, string> = { pending: "text-muted-foreground", loading: "text-primary animate-spin", complete: "text-emerald-400", error: "text-red-400" };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {stages.map((stage) => (
        <div key={stage.id} className="flex items-center gap-3">
          <span className={cn("text-sm", statusColor[stage.status])}>{statusIcon[stage.status]}</span>
          <span className={cn("text-sm", stage.status === "complete" ? "text-foreground" : "text-muted-foreground")}>{stage.label}</span>
        </div>
      ))}
    </div>
  );
}
