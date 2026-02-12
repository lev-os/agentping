"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

/**
 * HoverCard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/HoverCard.tsx
 * @migration-status candidate
 */
export function HoverCard({ trigger, children, align = "top", delayMs = 300, className }: HoverCardProps) {
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => { timerRef.current = setTimeout(() => setVisible(true), delayMs); };
  const hide = () => { clearTimeout(timerRef.current); setVisible(false); };

  const positionClass = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block" onMouseEnter={show} onMouseLeave={hide}>
      {trigger}
      {visible && (
        <div className={cn("absolute z-50 p-3 rounded-md bg-card border border-border shadow-lg text-sm", positionClass[align], className)}>
          {children}
        </div>
      )}
    </div>
  );
}
