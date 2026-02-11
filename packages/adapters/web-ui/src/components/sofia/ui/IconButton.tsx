"use client";

/**
 * @kingly/ui - IconButton Component
 *
 * Accessible button for icon-only actions with required aria-label.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-muted",
        outline: "border border-border hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-9 w-9 [&_svg]:size-4",
        sm: "h-7 w-7 [&_svg]:size-3.5",
        lg: "h-11 w-11 [&_svg]:size-5",
        xs: "h-6 w-6 [&_svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required accessibility label for screen readers */
  "aria-label": string;
  /** Render as child element */
  asChild?: boolean;
  /** Optional tooltip text (if different from aria-label) */
  title?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, asChild = false, title, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, className }))}
        title={title || props["aria-label"]}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
