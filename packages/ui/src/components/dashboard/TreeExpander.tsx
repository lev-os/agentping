"use client";

/**
 * @kingly/ui - TreeExpander Component
 *
 * Drill-down/tree navigation expander.
 * Chevron rotates from right (collapsed) to down (expanded).
 *
 * Different from CollapseButton:
 * - CollapseButton: widget collapse (ChevronDown → rotates)
 * - TreeExpander: tree/drill-down (ChevronRight → ChevronDown)
 */

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import type { ActionDescriptor } from "../../actions/types";

export interface TreeExpanderProps {
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Toggle callback */
  onToggle: () => void;
  /** Optional ActionDescriptor for analytics */
  action?: ActionDescriptor;
  /** Additional CSS classes */
  className?: string;
  /** Button size */
  size?: "sm" | "default";
  /** Disable the button */
  disabled?: boolean;
  /** Show as inline icon (no button wrapper) */
  inline?: boolean;
  /** Label for the expandable item (for a11y) */
  itemLabel?: string;
}

/**
 * TreeExpander - Tree/drill-down navigation toggle
 *
 * Uses ChevronRight that rotates 90° to ChevronDown when expanded.
 * For widget collapse, use CollapseButton instead.
 */
export function TreeExpander({
  isExpanded,
  onToggle,
  action,
  className,
  size = "sm",
  disabled = false,
  inline = false,
  itemLabel,
}: TreeExpanderProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection in tables
    onToggle();
  };

  const ariaLabel =
    action?.ariaLabel ??
    (isExpanded
      ? `Collapse ${itemLabel ?? "item"}`
      : `Expand ${itemLabel ?? "item"}`);

  const chevron = (
    <motion.div
      animate={{ rotate: isExpanded ? 90 : 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(inline && className)}
    >
      <ChevronRight className="w-4 h-4" />
    </motion.div>
  );

  if (inline) {
    return (
      <span
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          "cursor-pointer inline-flex items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-expanded={isExpanded}
        aria-label={ariaLabel}
      >
        {chevron}
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn("h-6 w-6 p-0", className)}
      aria-expanded={isExpanded}
      aria-label={ariaLabel}
    >
      {chevron}
    </Button>
  );
}
