import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display uppercase tracking-wider cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 border border-primary shadow-[var(--glow-primary,none)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 border border-destructive",
        outline:
          "border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary/20 text-secondary border border-secondary/50 shadow-sm hover:bg-secondary/30",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New variants for UI Kit Polish
        "menu-item":
          "w-full justify-start text-left font-normal normal-case tracking-normal hover:bg-muted/50 rounded-md",
        "nav-item":
          "justify-start gap-2 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md",
        tab:
          "rounded-none border-b-2 border-transparent hover:border-muted-foreground/30 data-[state=active]:border-primary data-[state=active]:text-primary",
        unstyled:
          "h-auto p-0 font-normal normal-case tracking-normal hover:opacity-80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component props.
 *
 * @remarks
 * **Accessibility Requirements:**
 * - When using `size="icon"` or icon-only buttons without visible text, you MUST provide an `aria-label` prop
 *   to ensure screen readers can announce the button's purpose.
 * - Example: `<Button size="icon" aria-label="Close dialog"><X /></Button>`
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled ? "true" : undefined}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
