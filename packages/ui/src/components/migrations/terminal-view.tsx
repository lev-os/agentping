"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TerminalLine {
  text: string;
  type: "input" | "output" | "error" | "system";
}

export interface TerminalViewProps {
  lines: TerminalLine[];
  onCommand?: (command: string) => void;
  prompt?: string;
  className?: string;
}

const LINE_COLORS: Record<TerminalLine["type"], string> = {
  input: "text-green-400",
  output: "text-gray-200",
  error: "text-red-400",
  system: "text-cyan-400",
};

const LINE_PREFIX: Record<TerminalLine["type"], string> = {
  input: "$ ",
  output: "  ",
  error: "! ",
  system: "# ",
};

/**
 * TerminalView - Terminal emulator UI
 * @source packages/adapters/web-ui/src/components/TerminalView.tsx
 * @migration-status implemented
 */
export function TerminalView({
  lines,
  onCommand,
  prompt = "$ ",
  className,
}: TerminalViewProps) {
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && onCommand) {
      onCommand(input.trim());
      setInput("");
    }
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/90 rounded-lg flex flex-col overflow-hidden", className)}>
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-cyan-500/10 bg-black/60">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[10px] font-mono text-cyan-500/50">terminal</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 min-h-[200px] max-h-[400px]">
        {lines.map((line, i) => (
          <div key={i} className={cn("font-mono text-xs leading-5 whitespace-pre-wrap", LINE_COLORS[line.type])}>
            <span className="opacity-40 select-none">{LINE_PREFIX[line.type]}</span>
            {line.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center border-t border-cyan-500/10 px-3 py-2 bg-black/40">
        <span className="text-xs font-mono text-green-400 mr-1 select-none">{prompt}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-xs font-mono text-gray-200 outline-none placeholder:text-cyan-500/20"
          placeholder="Type a command..."
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
}
