"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ChecklistItem {
  label: string;
  checked: boolean;
}

export interface StepDef {
  id: string;
  label: string;
  risk?: "low" | "medium" | "high";
}

export interface StepChecklistProps {
  items?: ChecklistItem[];
  onToggle?: ((index: number) => void) | ((stepId: string) => void);
  steps?: StepDef[];
  selectedSteps?: Set<string>;
  onStepToggle?: (stepId: string) => void;
  groupByRisk?: boolean;
  className?: string;
}

const RISK_ORDER: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
const RISK_STYLE: Record<string, string> = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-green-400",
};

function StepRow({ label, checked, onToggle, risk }: { label: string; checked: boolean; onToggle: () => void; risk?: string }) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 w-full text-left py-1 px-1 rounded hover:bg-cyan-500/5 transition-colors"
      >
        <span
          className={cn(
            "flex items-center justify-center w-4 h-4 rounded border text-[10px]",
            checked
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
              : "border-cyan-500/20 text-transparent",
          )}
        >
          {"\u2713"}
        </span>
        <span
          className={cn(
            "text-sm transition-all flex-1",
            checked ? "text-cyan-500/40 line-through" : "text-cyan-300",
          )}
        >
          {label}
        </span>
        {risk && <span className={cn("text-[10px] uppercase", RISK_STYLE[risk] ?? "text-cyan-500/40")}>{risk}</span>}
      </button>
    </li>
  );
}

export function StepChecklist({
  items = [],
  onToggle,
  steps,
  selectedSteps,
  onStepToggle,
  groupByRisk,
  className,
}: StepChecklistProps) {
  const useControlled = !!(steps && selectedSteps);
  const handleStepToggle = onStepToggle ?? (onToggle as ((stepId: string) => void) | undefined);

  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono",
        className,
      )}
    >
      {useControlled ? (
        <>
          {steps!.length === 0 && <div className="text-xs text-cyan-500/30">No steps</div>}
          {groupByRisk ? (
            <ul className="flex flex-col gap-1">
              {RISK_ORDER.map((risk) => {
                const group = steps!.filter((s) => (s.risk ?? "low") === risk);
                if (group.length === 0) return null;
                return (
                  <React.Fragment key={risk}>
                    <li className={cn("text-[10px] uppercase tracking-wider pt-2 pb-1", RISK_STYLE[risk])}>{risk} risk</li>
                    {group.map((step) => (
                      <StepRow
                        key={step.id}
                        label={step.label}
                        checked={selectedSteps!.has(step.id)}
                        onToggle={() => handleStepToggle?.(step.id)}
                        risk={step.risk}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
            </ul>
          ) : (
            <ul className="flex flex-col gap-1">
              {steps!.map((step) => (
                <StepRow
                  key={step.id}
                  label={step.label}
                  checked={selectedSteps!.has(step.id)}
                  onToggle={() => handleStepToggle?.(step.id)}
                  risk={step.risk}
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          {items.length === 0 && <div className="text-xs text-cyan-500/30">No items</div>}
          <ul className="flex flex-col gap-1">
            {items.map((item, i) => (
              <StepRow
                key={i}
                label={item.label}
                checked={item.checked}
                onToggle={() => (onToggle as ((index: number) => void) | undefined)?.(i)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
