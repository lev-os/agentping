"use client";

/**
 * @kingly/ui - Animation Utilities
 *
 * Reusable animation components for smooth UI transitions.
 */

import * as React from "react";
import { cn } from "../../../lib/utils";

// =============================================================================
// FadeInOut - Smooth fade transition wrapper
// =============================================================================

export interface FadeInOutProps {
  /** Whether the content is visible */
  show: boolean;
  /** Content to animate */
  children: React.ReactNode;
  /** Duration in ms (default: 200) */
  duration?: number;
  /** Custom class */
  className?: string;
}

export function FadeInOut({
  show,
  children,
  duration = 200,
  className,
}: FadeInOutProps) {
  const [shouldRender, setShouldRender] = React.useState(show);

  React.useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const handleAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        show ? "animate-in fade-in-0" : "animate-out fade-out-0",
        className
      )}
      style={{ animationDuration: `${duration}ms` }}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}

// =============================================================================
// AnimatedList - Staggered list animation
// =============================================================================

export interface AnimatedListProps<T> {
  /** Items to render */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Key extractor function */
  keyExtractor: (item: T, index: number) => string;
  /** Stagger delay in ms (default: 50) */
  staggerDelay?: number;
  /** Initial delay in ms (default: 0) */
  initialDelay?: number;
  /** Container class */
  className?: string;
  /** Item container class */
  itemClassName?: string;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  staggerDelay = 50,
  initialDelay = 0,
  className,
  itemClassName,
}: AnimatedListProps<T>) {
  return (
    <div className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          className={cn(
            "animate-in fade-in-0 slide-in-from-bottom-2",
            itemClassName
          )}
          style={{
            animationDelay: `${initialDelay + index * staggerDelay}ms`,
            animationFillMode: "backwards",
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// PulsingDot - Animated pulsing indicator
// =============================================================================

export interface PulsingDotProps {
  /** Color variant */
  variant?: "primary" | "success" | "warning" | "error" | "info";
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Custom class */
  className?: string;
  /** Accessible label */
  label?: string;
}

const pulsingDotColors = {
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-destructive",
  info: "bg-cyan-500",
};

const pulsingDotSizes = {
  sm: "h-1.5 w-1.5",
  default: "h-2 w-2",
  lg: "h-3 w-3",
};

export function PulsingDot({
  variant = "primary",
  size = "default",
  className,
  label,
}: PulsingDotProps) {
  return (
    <span
      className={cn(
        "relative inline-flex",
        pulsingDotSizes[size],
        className
      )}
      role="status"
      aria-label={label || `${variant} status indicator`}
    >
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          pulsingDotColors[variant]
        )}
      />
      <span
        className={cn(
          "relative inline-flex rounded-full h-full w-full",
          pulsingDotColors[variant]
        )}
      />
    </span>
  );
}

// =============================================================================
// AnimatedTabIndicator - Sliding tab indicator
// =============================================================================

export interface AnimatedTabIndicatorProps {
  /** Active tab index */
  activeIndex: number;
  /** Total number of tabs */
  tabCount: number;
  /** Tab container ref for measuring */
  containerRef: React.RefObject<HTMLElement>;
  /** Custom class */
  className?: string;
}

export function AnimatedTabIndicator({
  activeIndex,
  tabCount,
  containerRef,
  className,
}: AnimatedTabIndicatorProps) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  React.useLayoutEffect(() => {
    if (!containerRef.current) return;

    const tabs = containerRef.current.querySelectorAll('[role="tab"]');
    const activeTab = tabs[activeIndex] as HTMLElement | undefined;

    if (activeTab) {
      setStyle({
        width: activeTab.offsetWidth,
        transform: `translateX(${activeTab.offsetLeft}px)`,
      });
    }
  }, [activeIndex, containerRef, tabCount]);

  return (
    <span
      className={cn(
        "absolute bottom-0 h-0.5 bg-primary transition-all duration-200",
        className
      )}
      style={style}
    />
  );
}
