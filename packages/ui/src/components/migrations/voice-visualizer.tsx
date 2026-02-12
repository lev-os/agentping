"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface VoiceVisualizerProps {
  active?: boolean;
  bars?: number;
  className?: string;
}

/**
 * VoiceVisualizer - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/VoiceVisualizer.tsx
 * @migration-status candidate
 */
export function VoiceVisualizer({ active = false, bars = 12, className }: VoiceVisualizerProps) {
  return (
    <div className={cn("flex items-end justify-center gap-0.5 h-12", className)}>
      {Array.from({ length: bars }, (_, i) => {
        const baseHeight = 20 + Math.sin(i * 0.8) * 15;
        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full transition-all duration-150",
              active ? "bg-cyan-400" : "bg-cyan-500/20"
            )}
            style={{
              height: active ? `${baseHeight + Math.random() * 30}%` : "10%",
              animation: active ? `voice-bar ${0.3 + Math.random() * 0.4}s ease-in-out infinite alternate` : "none",
              animationDelay: `${i * 0.05}s`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes voice-bar {
          0% { height: 15%; }
          100% { height: 80%; }
        }
      `}</style>
    </div>
  );
}
