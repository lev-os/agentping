"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StepperProps {
  steps?: string[];
  currentStep?: number;
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({
  steps = ["Step 1", "Step 2", "Step 3"],
  currentStep = 0,
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div className={cn("flex items-center font-mono", className)}>
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div
                className={cn(
                  "flex-1 h-px mx-2",
                  isCompleted ? "bg-cyan-400" : "bg-cyan-500/20",
                )}
              />
            )}
            <button
              type="button"
              onClick={() => onStepClick?.(i)}
              className={cn(
                "flex flex-col items-center gap-1 group",
                onStepClick && "cursor-pointer",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 transition-colors",
                  isCompleted &&
                    "bg-cyan-500/30 border-cyan-400 text-cyan-300",
                  isActive &&
                    "bg-cyan-400/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]",
                  !isCompleted &&
                    !isActive &&
                    "bg-black/40 border-cyan-500/20 text-cyan-500/40",
                )}
              >
                {isCompleted ? "\u2713" : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] max-w-[60px] text-center leading-tight",
                  isActive ? "text-cyan-300" : "text-cyan-500/40",
                )}
              >
                {label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
