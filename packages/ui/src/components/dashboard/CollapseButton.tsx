"use client";

/**
 * @kingly/ui - CollapseButton Component
 *
 * Widget-level collapse button using Radix Collapsible.
 * Chevron rotates from down (expanded) to right (collapsed).
 */

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import type { ActionDescriptor } from "../../actions/types";

export interface CollapseButtonProps {
  /** Whether the widget is collapsed */
  isCollapsed: boolean;
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
}

/**
 * CollapseButton - Widget collapse toggle
 *
 * Uses ChevronDown that rotates 180° when collapsed.
 * For drill-down/tree navigation, use TreeExpander instead.
 */
export function CollapseButton({
  isCollapsed,
  onToggle,
  action,
  className,
  size = "sm",
  disabled = false,
}: CollapseButtonProps) {
  const handleClick = () => {
    onToggle();
    // Analytics tracking would happen through ActionProvider
    // if action is provided
  };

  const ariaLabel = action?.ariaLabel ?? (isCollapsed ? "Expand widget" : "Collapse widget");

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={cn("h-7 w-7 p-0", className)}
      aria-expanded={!isCollapsed}
      aria-label={ariaLabel}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 0 : 180 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </motion.div>
    </Button>
  );
}
