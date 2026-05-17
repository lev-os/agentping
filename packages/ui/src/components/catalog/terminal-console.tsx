"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TerminalConsoleLine {
  type: "input" | "output" | "error" | "system";
  content: string;
}

export interface TerminalConsoleProps {
  lines?: TerminalConsoleLine[];
  prompt?: string;
  onCommand?: (cmd: string) => void;
  className?: string;
}

/**
 * TerminalConsole - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/TerminalConsole.tsx
 * @catalog-status candidate
 */
export function TerminalConsole({ lines = [], prompt = "$", onCommand, className }: TerminalConsoleProps) {
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const typeColors: Record<string, string> = {
    input: "text-cyan-400",
    output: "text-cyan-300/80",
    error: "text-red-400",
    system: "text-yellow-400/80",
  };

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines.length]);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/80 rounded-lg overflow-hidden font-mono", className)}>
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-cyan-500/10 bg-black/40">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-[10px] text-cyan-500/40 ml-2">terminal</span>
      </div>
      <div ref={scrollRef} className="p-3 max-h-60 overflow-y-auto text-xs leading-5">
        {lines.map((line, i) => (
          <div key={i} className={typeColors[line.type]}>
            {line.type === "input" && <span className="text-green-400 mr-1">{prompt}</span>}
            {line.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 px-3 py-1.5 border-t border-cyan-500/10">
        <span className="text-green-400 text-xs">{prompt}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              onCommand?.(input.trim());
              setInput("");
            }
          }}
          className="flex-1 bg-transparent text-xs text-cyan-300 outline-none"
          autoFocus
        />
      </div>
    </div>
  );
}
