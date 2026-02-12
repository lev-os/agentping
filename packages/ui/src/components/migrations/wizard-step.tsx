"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface WizardStepProps {
  title?: string;
  description?: string;
  stepNumber?: number;
  totalSteps?: number;
  children?: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
}

export function WizardStep({
  title = "Step",
  description,
  stepNumber = 1,
  totalSteps = 1,
  children,
  onNext,
  onBack,
  isFirst = true,
  isLast = false,
  className,
}: WizardStepProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg font-mono",
        className
      )}
    >
      <div className="px-4 py-3 border-b border-cyan-500/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-cyan-500/50 uppercase tracking-wider">
            Step {stepNumber} of {totalSteps}
          </span>
          <div className="flex-1 h-1 bg-cyan-500/10 rounded overflow-hidden">
            <div
              className="h-full bg-cyan-400/50 rounded transition-all"
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        <h3 className="text-sm text-cyan-100 mt-2">{title}</h3>
        {description && (
          <p className="text-xs text-cyan-500/50 mt-0.5">{description}</p>
        )}
      </div>
      <div className="px-4 py-4">{children}</div>
      <div className="flex justify-between px-4 py-3 border-t border-cyan-500/10">
        {!isFirst ? (
          <button
            type="button"
            onClick={onBack}
            className="text-xs px-3 py-1.5 border border-cyan-500/20 rounded text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          >
            Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onNext}
          className="text-xs px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-300 hover:bg-cyan-500/30 transition-colors"
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
