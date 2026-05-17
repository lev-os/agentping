"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface CountdownWidgetProps {
  targetDate: string;
  title?: string;
  className?: string;
}

/**
 * CountdownWidget - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/CountdownWidget.tsx
 * @catalog-status candidate
 */
export function CountdownWidget({ targetDate, title = "Countdown", className }: CountdownWidgetProps) {
  const [remaining, setRemaining] = React.useState({ d: 0, h: 0, m: 0, s: 0 });

  React.useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setRemaining({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className={cn("border border-border rounded-md bg-card p-4 text-center", className)}>
      <div className="text-xs text-muted-foreground mb-2">{title}</div>
      <div className="flex items-center justify-center gap-3">
        {(["d", "h", "m", "s"] as const).map((unit) => (
          <div key={unit} className="flex flex-col items-center">
            <span className="text-2xl font-mono font-bold text-foreground">{String(remaining[unit]).padStart(2, "0")}</span>
            <span className="text-[10px] text-muted-foreground uppercase">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
