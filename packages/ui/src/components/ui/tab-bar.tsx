"use client";

/**
 * @kingly/ui - TabBar Component
 *
 * Horizontal tab navigation with active state indicator.
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabBarProps {
  /** Available tabs */
  tabs: TabItem[];
  /** Currently active tab ID */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (tabId: string) => void;
  /** Custom class for container */
  className?: string;
  /** Size variant */
  size?: "default" | "sm" | "lg";
}

const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  ({ tabs, activeTab, onTabChange, className, size = "default" }, ref) => {
    const sizeClasses = {
      default: "h-9 px-4 text-sm",
      sm: "h-7 px-3 text-xs",
      lg: "h-11 px-5 text-base",
    };

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "flex border-b border-border",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 font-medium transition-colors",
                "border-b-2 -mb-px",
                sizeClasses[size],
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }
);
TabBar.displayName = "TabBar";

export { TabBar };
