import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

/**
 * GlowOrb variants - atmospheric blurry circles
 */
const glowOrbVariants = cva(
  "absolute rounded-full pointer-events-none",
  {
    variants: {
      size: {
        sm: "w-32 h-32",
        md: "w-48 h-48",
        lg: "w-64 h-64",
        xl: "w-96 h-96",
        "2xl": "w-[32rem] h-[32rem]",
      },
      color: {
        cyan: "bg-primary",
        purple: "bg-secondary",
        yellow: "bg-accent",
        green: "bg-success",
        red: "bg-destructive",
        orange: "bg-cyber-orange",
      },
      intensity: {
        subtle: "opacity-10",
        low: "opacity-20",
        medium: "opacity-30",
        high: "opacity-40",
        intense: "opacity-50",
      },
      blur: {
        sm: "blur-2xl",
        md: "blur-3xl",
        lg: "blur-[80px]",
        xl: "blur-[100px]",
        "2xl": "blur-[150px]",
      },
    },
    defaultVariants: {
      size: "lg",
      color: "cyan",
      intensity: "low",
      blur: "lg",
    },
  }
);

export interface GlowOrbProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof glowOrbVariants> {
  /** CSS blend mode for layering effects */
  blendMode?: 
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "soft-light"
    | "hard-light"
    | "color-dodge"
    | "color-burn"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";
  /** Horizontal position (left value) */
  x?: string;
  /** Vertical position (top value) */
  y?: string;
  /** Enable pulse animation */
  pulse?: boolean;
  /** Pulse animation duration in seconds */
  pulseDuration?: number;
}

/**
 * GlowOrb - Atmospheric blurry circle for background effects
 * 
 * Features:
 * - Highly blurred circular gradient
 * - CSS blend mode support for layering
 * - Multiple color and intensity variants
 * - Optional pulse animation
 * 
 * @example
 * ```tsx
 * // Cyan orb top-left
 * <GlowOrb color="cyan" size="xl" x="-10%" y="-20%" blendMode="screen" />
 * 
 * // Purple orb bottom-right with pulse
 * <GlowOrb color="purple" size="lg" x="80%" y="60%" pulse />
 * ```
 */
const GlowOrb = React.forwardRef<HTMLDivElement, GlowOrbProps>(
  (
    {
      className,
      size,
      color,
      intensity,
      blur,
      blendMode = "screen",
      x = "0%",
      y = "0%",
      pulse = false,
      pulseDuration = 8,
      style,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          glowOrbVariants({ size, color, intensity, blur }),
          pulse && "animate-glow-pulse",
          className
        )}
        style={{
          ...style,
          left: x,
          top: y,
          mixBlendMode: blendMode,
          transform: "translate(-50%, -50%)",
          "--glow-pulse-duration": `${pulseDuration}s`,
        } as React.CSSProperties}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

GlowOrb.displayName = "GlowOrb";

export { GlowOrb, glowOrbVariants };

