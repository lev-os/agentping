/**
 * @kingly/ui - Widget Error Boundary
 *
 * Error display component for widget failures
 */

"use client";

import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Button } from "../ui/button";
import type { WidgetErrorProps } from "./types";

export function WidgetError({
  error,
  widgetId,
  onRetry,
  onDismiss,
}: WidgetErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      
      <h3 className="font-display text-lg text-destructive mb-2">Widget Error</h3>
      
      <p className="text-sm text-muted-foreground mb-1">
        Failed to load widget: <span className="font-mono text-xs">{widgetId}</span>
      </p>
      
      <p className="text-xs text-muted-foreground/70 mb-4 max-w-md">
        {error.message}
      </p>
      
      <div className="flex gap-2">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </Button>
        )}
        
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="gap-2"
          >
            <X className="w-3 h-3" />
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
}
