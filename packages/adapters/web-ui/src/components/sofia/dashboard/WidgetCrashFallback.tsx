/**
 * @kingly/ui - Widget Crash Fallback Component
 *
 * Minimal crash fallback distinct from API errors
 * Used when a widget component crashes (React error boundary)
 */

"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import type { WidgetCrashFallbackProps } from "./types";

/**
 * WidgetCrashFallback - Minimal crash fallback for widget errors
 *
 * This is distinct from WidgetError which handles API/data errors.
 * WidgetCrashFallback is for component crashes caught by React error boundaries.
 */
export function WidgetCrashFallback({
  widgetId,
  error,
  resetError,
  className,
}: WidgetCrashFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-6 px-4 text-center bg-destructive/5 border border-destructive/20 rounded-md",
        className
      )}
      role="alert"
      aria-live="assertive"
      data-widget-id={widgetId}
      data-crash="true"
    >
      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
        <AlertTriangle className="w-5 h-5 text-destructive" aria-hidden="true" />
      </div>

      <h3 className="font-display text-sm tracking-wider text-destructive mb-1">
        Widget Crashed
      </h3>

      <p className="text-xs text-muted-foreground max-w-[200px] mb-3">
        Something went wrong rendering this widget.
      </p>

      {error && (
        <pre className="text-[10px] text-destructive/70 bg-destructive/5 px-2 py-1 rounded mb-3 max-w-full overflow-x-auto">
          {error.message}
        </pre>
      )}

      {resetError && (
        <Button
          variant="outline"
          size="sm"
          onClick={resetError}
          className="text-xs gap-1.5"
        >
          <RefreshCw className="w-3 h-3" aria-hidden="true" />
          Try Again
        </Button>
      )}
    </div>
  );
}
