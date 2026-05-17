"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SmartActionResultProps {
  action?: string;
  result?: string;
  status?: "success" | "error" | "pending";
  className?: string;
}

/**
 * SmartActionResult - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/SmartActionResult.tsx
 * @catalog-status candidate
 */
export function SmartActionResult({ action = "", result = "", status = "success", className }: SmartActionResultProps) {
  const statusColors: Record<string, string> = { success: "border-green-500/20", error: "border-red-500/20", pending: "border-yellow-500/20" };

  return (
    <div className={cn("border bg-black/60 rounded-lg p-4", statusColors[status], className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">ACTION RESULT</div>
      {action && <div className="text-xs font-mono text-cyan-500/60 mb-1">{action}</div>}
      <div className="text-sm font-mono text-cyan-300/80">{result}</div>
    </div>
  );
}
