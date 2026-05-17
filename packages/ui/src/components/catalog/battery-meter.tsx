"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface BatteryMeterProps {
  level: number;
  charging?: boolean;
  label?: string;
  className?: string;
}

/**
 * BatteryMeter - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/BatteryMeter.tsx
 * @catalog-status candidate
 */
export function BatteryMeter({ level, charging = false, label, className }: BatteryMeterProps) {
  const clamped = Math.max(0, Math.min(100, level));
  const color = clamped > 50 ? "bg-emerald-500" : clamped > 20 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="relative flex items-center">
        <div className="w-10 h-5 border-2 border-foreground/40 rounded-sm overflow-hidden">
          <div className={cn("h-full transition-all duration-500", color)} style={{ width: `${clamped}%` }} />
        </div>
        <div className="w-1 h-2.5 bg-foreground/40 rounded-r-sm" />
      </div>
      <span className="text-xs text-muted-foreground">
        {clamped}%{charging ? " \u26A1" : ""}{label ? ` ${label}` : ""}
      </span>
    </div>
  );
}
