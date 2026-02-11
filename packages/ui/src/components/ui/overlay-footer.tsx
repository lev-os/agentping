"use client";

/**
 * @kingly/ui - Overlay Footer Component
 *
 * Reusable footer for Dialog, AlertDialog, and Sheet.
 * Provides consistent action button layout with loading states.
 */

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./button";

export interface OverlayFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary action button label */
  primaryLabel?: string;
  /** Secondary action button label (typically Cancel) */
  secondaryLabel?: string;
  /** Primary action callback */
  onPrimaryAction?: () => void | Promise<void>;
  /** Secondary action callback */
  onSecondaryAction?: () => void;
  /** Primary button variant */
  primaryVariant?: ButtonProps["variant"];
  /** Loading state - disables buttons and shows spinner on primary */
  isLoading?: boolean;
  /** Disable primary button */
  primaryDisabled?: boolean;
  /** Hide secondary button */
  hideSecondary?: boolean;
  /** Custom content to render before buttons */
  startContent?: React.ReactNode;
  /** Custom content to render after buttons */
  endContent?: React.ReactNode;
}

/**
 * OverlayFooter - Consistent footer for overlay components
 */
export function OverlayFooter({
  primaryLabel = "Save",
  secondaryLabel = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  primaryVariant = "default",
  isLoading = false,
  primaryDisabled = false,
  hideSecondary = false,
  startContent,
  endContent,
  className,
  children,
  ...props
}: OverlayFooterProps) {
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handlePrimary = async () => {
    if (!onPrimaryAction) return;

    const result = onPrimaryAction();
    if (result instanceof Promise) {
      setIsExecuting(true);
      try {
        await result;
      } finally {
        setIsExecuting(false);
      }
    }
  };

  const effectiveLoading = isLoading || isExecuting;

  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-border/30",
        className
      )}
      {...props}
    >
      {startContent}

      {children}

      {!hideSecondary && (
        <Button
          variant="outline"
          onClick={onSecondaryAction}
          disabled={effectiveLoading}
          className="mt-2 sm:mt-0"
        >
          {secondaryLabel}
        </Button>
      )}

      {onPrimaryAction && (
        <Button
          variant={primaryVariant}
          onClick={handlePrimary}
          disabled={effectiveLoading || primaryDisabled}
        >
          {effectiveLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {primaryLabel}
        </Button>
      )}

      {endContent}
    </div>
  );
}
