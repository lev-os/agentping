"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AccessPadProps {
  onSubmit?: (code: string) => void;
  codeLength?: number;
  className?: string;
}

/**
 * AccessPad - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/AccessPad.tsx
 * @migration-status candidate
 */
export function AccessPad({ onSubmit, codeLength = 4, className }: AccessPadProps) {
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "denied">("idle");

  const handlePress = (num: string) => {
    if (status !== "idle") {
      setCode("");
      setStatus("idle");
    }
    if (code.length < codeLength) {
      setCode((prev) => prev + num);
    }
  };

  const handleSubmit = () => {
    onSubmit?.(code);
    setStatus(code === "1337" ? "success" : "denied");
    setTimeout(() => {
      setCode("");
      setStatus("idle");
    }, 1500);
  };

  const screenColors: Record<string, string> = {
    idle: "border-cyan-500/30 text-cyan-400",
    success: "border-green-500/50 text-green-400",
    denied: "border-red-500/50 text-red-400",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4 w-48", className)}>
      <div className={cn("text-center font-mono text-lg py-3 mb-3 rounded border bg-black/40", screenColors[status])}>
        {status === "idle" ? code.padEnd(codeLength, "_") : status === "success" ? "GRANTED" : "DENIED"}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "\u23CE"].map((key) => (
          <button
            key={key}
            className={cn(
              "h-9 rounded font-mono text-sm border transition-colors",
              key === "C" ? "border-red-500/30 text-red-400 hover:bg-red-500/10" :
              key === "\u23CE" ? "border-green-500/30 text-green-400 hover:bg-green-500/10" :
              "border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10"
            )}
            onClick={() => {
              if (key === "C") { setCode(""); setStatus("idle"); }
              else if (key === "\u23CE") handleSubmit();
              else handlePress(key);
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
