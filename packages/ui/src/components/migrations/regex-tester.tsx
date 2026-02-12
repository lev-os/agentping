"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RegexTesterProps {
  pattern?: string;
  testString?: string;
  onPatternChange?: (pattern: string) => void;
  className?: string;
}

/**
 * RegexTester - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/RegexTester.tsx
 * @migration-status candidate
 */
export function RegexTester({ pattern = "", testString = "", onPatternChange, className }: RegexTesterProps) {
  const [input, setInput] = React.useState(testString);
  const [regex, setRegex] = React.useState(pattern);
  const [matches, setMatches] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      if (regex) {
        const re = new RegExp(regex, "g");
        setMatches(input.match(re) || []);
      } else {
        setMatches([]);
      }
    } catch {
      setMatches([]);
    }
  }, [regex, input]);

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg p-4 space-y-3", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">REGEX TESTER</div>
      <input
        type="text"
        value={regex}
        onChange={(e) => { setRegex(e.target.value); onPatternChange?.(e.target.value); }}
        placeholder="Pattern..."
        className="w-full bg-black/40 border border-cyan-500/20 rounded px-3 py-1.5 text-xs font-mono text-violet-400 placeholder:text-cyan-500/20"
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Test string..."
        className="w-full min-h-[60px] bg-black/40 border border-cyan-500/20 rounded px-3 py-1.5 text-xs font-mono text-cyan-300 placeholder:text-cyan-500/20 resize-y"
      />
      <div className="text-xs font-mono">
        <span className="text-cyan-500/60">Matches: </span>
        <span className="text-green-400">{matches.length > 0 ? matches.join(", ") : "none"}</span>
      </div>
    </div>
  );
}
