"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ConnectionStatusProps {
  connected: boolean;
  className?: string;
}

/**
 * ConnectionStatus - Catalog component from canvas package
 * @source packages/canvas/src/components/ConnectionStatus.tsx
 * @catalog-status candidate
 */
export function ConnectionStatus({ connected = false, className }: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs font-mono", className)}>
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          connected ? "bg-[#00ff9d]" : "bg-[#ff2a6d] animate-pulse",
        )}
      />
      <span className={connected ? "text-[#00ff9d]" : "text-[#ff2a6d]"}>
        {connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}
