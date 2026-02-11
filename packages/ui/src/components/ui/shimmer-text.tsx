import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Shimmer text animation styles
 */
const shimmerTextVariants = cva(
  "relative inline-block font-display uppercase tracking-wider",
  {
    variants: {
      size: {
        sm: "text-2xl md:text-3xl",
        md: "text-4xl md:text-5xl",
        lg: "text-5xl md:text-6xl",
        xl: "text-6xl md:text-7xl",
        "2xl": "text-7xl md:text-8xl",
      },
      color: {
        cyan: "text-primary",
        purple: "text-secondary",
        yellow: "text-accent",
        green: "text-success",
        white: "text-foreground",
      },
    },
    defaultVariants: {
      size: "xl",
      color: "cyan",
    },
  }
);

export interface ShimmerTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof shimmerTextVariants> {
  /** The text content to display */
  children: React.ReactNode;
  /** Enable glow effect */
  glow?: boolean;
  /** Glow animation speed (seconds for full cycle) */
  glowSpeed?: number;
  /** Glow intensity - affects blur and offset (0.5-2) */
  glowIntensity?: number;
  /** Glow brightness - affects opacity and lightness (0.5-2) */
  glowBrightness?: number;
  /** Text shadow intensity (0-1, 0 = none) */
  textShadow?: number;
}

/**
 * ShimmerText - Animated text with ethereal glow using layered text
 * 
 * Uses 4 text layers stacked:
 * - Bottom: heavily blurred, slow animation
 * - Middle: medium blur, medium animation  
 * - Main: crisp text with optional text-shadow
 * - Foreground: subtle blur animation for shimmer
 * 
 * @example
 * ```tsx
 * <ShimmerText size="xl" color="cyan" glow>
 *   SKYNET DESIGN SYSTEM
 * </ShimmerText>
 * ```
 */
const ShimmerText = React.forwardRef<HTMLDivElement, ShimmerTextProps>(
  (
    {
      className,
      size,
      color,
      children,
      glow = true,
      glowSpeed = 12,
      glowIntensity = 1,
      glowBrightness = 1,
      textShadow = 0.6,
      style,
      ...props
    },
    ref
  ) => {
    // Color configurations - 50% brighter base (higher lightness)
    const colorConfig = {
      cyan: { hue: 195, sat: 100, light: 75 },
      purple: { hue: 280, sat: 100, light: 78 },
      yellow: { hue: 45, sat: 100, light: 70 },
      green: { hue: 150, sat: 100, light: 68 },
      white: { hue: 195, sat: 30, light: 95 },
    };
    
    const config = colorConfig[color || "cyan"];
    
    // Max offset in pixels - keeps glow close to text
    const maxOffset = 4 * glowIntensity;
    
    // Opacity multiplier from brightness
    const opacityMult = glowBrightness;
    
    // Layer configurations
    const layers = [
      {
        // Bottom layer - most blur, slower animation
        blur: 8 * glowIntensity,
        opacity: Math.min(0.75 * opacityMult, 1),
        animation: {
          x: [0, maxOffset, -maxOffset * 0.5, maxOffset * 0.7, 0],
          y: [0, -maxOffset * 0.5, maxOffset * 0.3, -maxOffset * 0.4, 0],
        },
        duration: glowSpeed * 1.2,
        hueShift: 10,
      },
      {
        // Middle layer - medium blur, medium speed
        blur: 4 * glowIntensity,
        opacity: Math.min(0.85 * opacityMult, 1),
        animation: {
          x: [0, -maxOffset * 0.7, maxOffset * 0.4, -maxOffset * 0.3, 0],
          y: [0, maxOffset * 0.4, -maxOffset * 0.6, maxOffset * 0.2, 0],
        },
        duration: glowSpeed,
        hueShift: -5,
      },
    ];

    // Text shadow size based on intensity and textShadow prop
    const shadowSize = 24 * glowIntensity * textShadow;
    const shadowOpacity = 0.5 * textShadow;

    return (
      <div
        ref={ref}
        className={cn(
          shimmerTextVariants({ size, color }),
          "shimmer-text-wrapper",
          className
        )}
        style={style}
        {...props}
      >
        {/* Glow layers - behind main text */}
        {glow && layers.map((layer, index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            className={cn(
              shimmerTextVariants({ size }),
              "absolute inset-0 pointer-events-none select-none"
            )}
            style={{
              color: `hsl(${config.hue + layer.hueShift}, ${config.sat}%, ${config.light}%)`,
              filter: `blur(${layer.blur}px)`,
              opacity: layer.opacity,
              mixBlendMode: "screen",
              willChange: "transform",
            }}
            animate={{
              x: layer.animation.x,
              y: layer.animation.y,
            }}
            transition={{
              duration: layer.duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            {children}
          </motion.span>
        ))}
        
        {/* Main text layer - crisp, on top */}
        <span 
          className="relative z-10"
          style={{ 
            textShadow: glow && textShadow > 0
              ? `0 0 ${shadowSize}px hsla(${config.hue}, ${config.sat}%, ${config.light}%, ${shadowOpacity})`
              : undefined,
          }}
        >
          {children}
        </span>
        
        {/* Foreground shimmer layer - primary color with animated blur */}
        {glow && (
          <motion.span
            aria-hidden="true"
            className={cn(
              shimmerTextVariants({ size, color }),
              "absolute inset-0 pointer-events-none select-none z-20"
            )}
            style={{
              mixBlendMode: "screen",
              willChange: "filter",
            }}
            animate={{
              filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
            }}
            transition={{
              duration: glowSpeed * 2,
              ease: [0.4, 0, 0.6, 1],
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {children}
          </motion.span>
        )}
      </div>
    );
  }
);

ShimmerText.displayName = "ShimmerText";

export { ShimmerText, shimmerTextVariants };
