/**
 * @kingly/ui - Widget Empty State Component
 *
 * Typed empty state variants for widgets
 */

"use client";

import {
  Inbox,
  Search,
  Settings,
  WifiOff,
  Play,
  HelpCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import type { WidgetEmptyProps, EmptyStateType } from "./types";
import type { ElementType } from "react";

/**
 * Default configuration for each empty state type
 */
const emptyStateDefaults: Record<
  EmptyStateType,
  { icon: ElementType; title: string; description: string }
> = {
  "no-data": {
    icon: Inbox,
    title: "No data available",
    description: "There is no data to display yet.",
  },
  "no-results": {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
  "not-configured": {
    icon: Settings,
    title: "Not configured",
    description: "This widget needs configuration before it can display data.",
  },
  disconnected: {
    icon: WifiOff,
    title: "Connection lost",
    description: "Unable to connect to the data source. Check your connection.",
  },
  "not-started": {
    icon: Play,
    title: "Not started",
    description: "Start the process to see data here.",
  },
  custom: {
    icon: HelpCircle,
    title: "No content",
    description: "This widget has no content to display.",
  },
};

/**
 * WidgetEmpty - Typed empty state variants for widgets
 */
export function WidgetEmpty({
  type = "no-data",
  title,
  description,
  icon: CustomIcon,
  action,
  className,
}: WidgetEmptyProps) {
  const defaults = emptyStateDefaults[type];
  const Icon = CustomIcon ?? defaults.icon;
  const displayTitle = title ?? defaults.title;
  const displayDescription = description ?? defaults.description;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-8 px-4 text-center",
        className
      )}
      role="status"
      aria-label={displayTitle}
    >
      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
      </div>

      <h3 className="font-display text-sm tracking-wider text-foreground mb-1">
        {displayTitle}
      </h3>

      <p className="text-xs text-muted-foreground max-w-[200px] mb-4">
        {displayDescription}
      </p>

      {action && (
        <Button
          variant="outline"
          size="sm"
          onClick={action.onClick}
          className="text-xs"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
