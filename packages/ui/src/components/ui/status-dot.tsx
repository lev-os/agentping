"use client";

/**
 * @kingly/ui - StatusDot Component
 *
 * Visual indicator for status states (online, offline, busy, etc.)
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusDotVariants = cva(
  "rounded-full flex-shrink-0",
  {
    variants: {
      status: {
        online: "bg-emerald-500",
        offline: "bg-muted-foreground/50",
        busy: "bg-amber-500",
        error: "bg-destructive",
        warning: "bg-yellow-500",
        info: "bg-cyan-500",
        primary: "bg-primary",
      },
      size: {
        default: "h-2.5 w-2.5",
        sm: "h-2 w-2",
        lg: "h-3 w-3",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      status: "offline",
      size: "default",
      pulse: false,
    },
  }
);

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {
  /** Accessible label for screen readers */
  label?: string;
}

const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status, size, pulse, label, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label || `Status: ${status}`}
        className={cn(statusDotVariants({ status, size, pulse, className }))}
        {...props}
      />
    );
  }
);
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
