"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface InlineTutorialTooltipProps {
  title: string;
  content: string;
  step?: number;
  totalSteps?: number;
  onNext?: () => void;
  onDismiss?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * InlineTutorialTooltip - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/InlineTutorialTooltip.tsx
 * @catalog-status candidate
 */
export function InlineTutorialTooltip({
  title, content, step, totalSteps, onNext, onDismiss, children, className
}: InlineTutorialTooltipProps) {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return <>{children}</>;

  return (
    <div className="relative inline-block">
      {children}
      <div className={cn("absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-md bg-card border border-primary/50 shadow-lg", className)}>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{content}</div>
        <div className="flex items-center justify-between mt-3">
          {step && totalSteps && <span className="text-[10px] text-muted-foreground">{step}/{totalSteps}</span>}
          <div className="flex gap-2 ml-auto">
            <button onClick={() => { setVisible(false); onDismiss?.(); }} className="text-xs text-muted-foreground hover:text-foreground" aria-label="Dismiss tutorial">Skip</button>
            {onNext && <button onClick={onNext} className="text-xs text-primary font-medium" aria-label="Next tutorial step">Next</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
