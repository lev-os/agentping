"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TypingIndicatorProps {
  className?: string;
}

const dotStyle = (delay: number): React.CSSProperties => ({
  animationDelay: `${delay}ms`,
});

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-3 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20",
        className,
      )}
    >
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .typing-dot {
          animation: typing-bounce 1.4s infinite ease-in-out;
        }
      `}</style>
      <span
        className="typing-dot block w-1.5 h-1.5 rounded-full bg-cyan-400"
        style={dotStyle(0)}
      />
      <span
        className="typing-dot block w-1.5 h-1.5 rounded-full bg-cyan-400"
        style={dotStyle(200)}
      />
      <span
        className="typing-dot block w-1.5 h-1.5 rounded-full bg-cyan-400"
        style={dotStyle(400)}
      />
    </div>
  );
}
