"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export type LcarsButtonVariant = "primary" | "secondary" | "danger" | "warning" | "success";
export type LcarsButtonSize = "sm" | "md" | "lg";
export type LcarsButtonColor = "blue" | "orange" | "tan" | "purple" | "violet" | "pink" | "red" | "green";

export interface LcarsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LcarsButtonVariant;
  size?: LcarsButtonSize;
  color?: LcarsButtonColor;
  pulse?: boolean;
  scanning?: boolean;
  endCap?: "both" | "left" | "right" | "none";
  children: React.ReactNode;
}

const sizeStyles: Record<LcarsButtonSize, string> = {
  sm: "h-7 px-4 text-xs",
  md: "h-9 px-6 text-sm",
  lg: "h-11 px-8 text-base",
};

const colorStyles: Record<LcarsButtonColor, string> = {
  blue: "bg-blue-500",
  orange: "bg-orange-400",
  tan: "bg-amber-300",
  purple: "bg-purple-500",
  violet: "bg-violet-500",
  pink: "bg-pink-500",
  red: "bg-red-500",
  green: "bg-green-500",
};

const capStyles: Record<string, string> = {
  both: "rounded-full",
  left: "rounded-l-full rounded-r-sm",
  right: "rounded-r-full rounded-l-sm",
  none: "rounded-sm",
};

/**
 * LcarsButton - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/lcars/LcarsButton.tsx
 * @migration-status candidate
 */
export function LcarsButton({
  variant = "primary",
  size = "md",
  color = "tan",
  pulse = false,
  scanning = false,
  endCap = "both",
  children,
  className,
  disabled,
  ...props
}: LcarsButtonProps) {
  return (
    <button
      className={cn(
        "font-mono uppercase tracking-wider font-bold text-black transition-all",
        sizeStyles[size],
        colorStyles[color],
        capStyles[endCap],
        pulse && "animate-pulse",
        scanning && "animate-[scan_2s_ease-in-out_infinite]",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
