"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../../lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    "aria-label"?: string;
  }
>(({ className, value, indicatorClassName, "aria-label": ariaLabel, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={value ?? 0}
    aria-label={ariaLabel}
    className={cn(
      "relative h-2 w-full overflow-hidden bg-muted border border-border",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300",
        "bg-gradient-to-r from-primary to-cyan-400",
        "shadow-[0_0_10px_var(--color-primary)]",
        indicatorClassName
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
