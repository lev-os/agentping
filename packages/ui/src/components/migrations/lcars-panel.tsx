"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type LcarsPanelVariant = "default" | "outlined" | "filled";

export interface LcarsPanelProps {
  variant?: LcarsPanelVariant;
  title?: string;
  headerColor?: "blue" | "orange" | "tan" | "purple";
  showHeader?: boolean;
  borderColor?: "blue" | "orange" | "tan" | "none";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  footer?: React.ReactNode;
}

const headerColorMap: Record<string, string> = {
  blue: "bg-blue-500",
  orange: "bg-orange-400",
  tan: "bg-amber-300",
  purple: "bg-purple-500",
};

const borderColorMap: Record<string, string> = {
  blue: "border-blue-500/40",
  orange: "border-orange-400/40",
  tan: "border-amber-300/40",
  none: "border-transparent",
};

/**
 * LcarsPanel - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/lcars/LcarsPanel.tsx
 * @migration-status candidate
 */
export function LcarsPanel({
  variant = "default",
  title,
  headerColor = "tan",
  showHeader = true,
  borderColor = "blue",
  children,
  className,
  style,
  footer,
}: LcarsPanelProps) {
  return (
    <div
      className={cn(
        "rounded overflow-hidden border",
        borderColorMap[borderColor],
        variant === "filled" ? "bg-black/60" : "bg-transparent",
        className
      )}
      style={style}
    >
      {showHeader && (
        <div className={cn("flex items-center gap-2 px-3 py-1.5", headerColorMap[headerColor])}>
          {title && <span className="text-xs font-mono font-bold text-black uppercase tracking-wider">{title}</span>}
          <div className="flex-1" />
        </div>
      )}
      <div className="p-3">{children}</div>
      {footer && <div className="px-3 py-1.5 border-t border-cyan-500/10">{footer}</div>}
    </div>
  );
}
