"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PinInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * PinInput - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/PinInput.tsx
 * @migration-status candidate
 */
export function PinInput({ length = 4, value = "", onChange, onComplete, label, className }: PinInputProps) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (index: number, char: string) => {
    if (!/^\d$/.test(char)) return;
    const newValue = value.slice(0, index) + char + value.slice(index + 1);
    onChange?.(newValue);
    if (index < length - 1) inputsRef.current[index + 1]?.focus();
    if (newValue.length === length) onComplete?.(newValue);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {label && <span className="text-xs font-mono text-cyan-500/60 uppercase">{label}</span>}
      <div className="flex gap-2">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !value[i] && i > 0) {
                inputsRef.current[i - 1]?.focus();
              }
            }}
            className="w-10 h-12 text-center text-lg font-mono text-cyan-300 bg-black/40 border border-cyan-500/20 rounded focus:border-cyan-400 focus:outline-none"
          />
        ))}
      </div>
    </div>
  );
}
