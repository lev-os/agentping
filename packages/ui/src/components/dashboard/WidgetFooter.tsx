/**
 * @kingly/ui - Widget Footer Component
 *
 * Footer slot for widgets with optional actions
 */

"use client";

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import type { WidgetFooterProps } from "./types";

/**
 * WidgetFooter - Footer slot for widgets with optional actions
 */
export function WidgetFooter({ children, actions, className }: WidgetFooterProps) {
  const hasContent = children || (actions && actions.length > 0);

  if (!hasContent) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2 border-t border-border/30 bg-muted/20",
        className
      )}
    >
      {/* Custom content slot */}
      <div className="flex-1 text-xs text-muted-foreground">
        {children}
      </div>

      {/* Footer actions */}
      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant ?? "outline"}
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
                className="h-7 gap-1.5 text-xs"
                aria-label={action.label}
                title={action.title ?? action.label}
              >
                {action.loading ? (
                  <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                ) : (
                  <Icon className="w-3 h-3" aria-hidden="true" />
                )}
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
