"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TokenStreamProps {
  tokens?: string[];
  speed?: number;
  isStreaming?: boolean;
  className?: string;
}

export function TokenStream({
  tokens = [],
  speed = 50,
  isStreaming = false,
  className,
}: TokenStreamProps) {
  const [visibleCount, setVisibleCount] = React.useState(tokens.length);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isStreaming) {
      setVisibleCount(tokens.length);
      return;
    }
    setVisibleCount(0);
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= tokens.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [tokens, speed, isStreaming]);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const visible = tokens.slice(0, visibleCount);
  const showCursor = isStreaming && visibleCount < tokens.length;

  return (
    <div
      ref={containerRef}
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-4 font-mono text-sm text-cyan-100 max-h-64 overflow-y-auto",
        className
      )}
    >
      {visible.length === 0 && !showCursor && (
        <span className="text-cyan-500/40 text-xs">Awaiting tokens...</span>
      )}
      {visible.map((token, i) => (
        <span key={i}>{token}</span>
      ))}
      {showCursor && (
        <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-px align-middle" />
      )}
    </div>
  );
}
