/**
 * @kingly/ui - Widget Header Action Component
 *
 * Renders action buttons in widget header
 */

"use client";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import type { WidgetHeaderActionProps } from "./types";

/**
 * WidgetHeaderAction - Renders action buttons in widget header
 */
export function WidgetHeaderAction({ actions, className }: WidgetHeaderActionProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant={action.variant ?? "ghost"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className="h-7 w-7 p-0"
            aria-label={action.label}
            title={action.title ?? action.label}
          >
            {action.loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </Button>
        );
      })}
    </div>
  );
}
