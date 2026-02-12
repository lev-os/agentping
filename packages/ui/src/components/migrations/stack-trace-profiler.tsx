"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StackFrame {
  file: string;
  line: number;
  column?: number;
  function: string;
  isNative?: boolean;
}

export interface StackTraceProfilerProps {
  frames?: StackFrame[];
  error?: string;
  className?: string;
}

/**
 * StackTraceProfiler - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/logs/StackTraceProfiler.tsx
 * @migration-status candidate
 */
export function StackTraceProfiler({ frames = [], error, className }: StackTraceProfilerProps) {
  return (
    <div className={cn("border border-red-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-red-500/10">
        <span className="text-xs font-mono text-red-400 uppercase tracking-wider">STACK TRACE</span>
      </div>
      {error && (
        <div className="px-4 py-2 bg-red-500/5 border-b border-red-500/10">
          <pre className="text-xs font-mono text-red-400 whitespace-pre-wrap">{error}</pre>
        </div>
      )}
      <div className="p-2 space-y-px max-h-60 overflow-y-auto">
        {frames.map((frame, i) => (
          <div key={i} className={cn("flex gap-2 px-2 py-1 rounded text-xs font-mono hover:bg-red-500/5", frame.isNative && "opacity-40")}>
            <span className="text-red-400/40 w-4 text-right shrink-0">{i}</span>
            <span className="text-cyan-400">{frame.function}</span>
            <span className="text-cyan-500/40 truncate">
              {frame.file}:{frame.line}{frame.column ? `:${frame.column}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
