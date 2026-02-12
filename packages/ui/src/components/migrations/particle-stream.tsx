"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ParticleStreamProps {
  count?: number;
  speed?: number;
  className?: string;
}

/**
 * ParticleStream - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/ParticleStream.tsx
 * @migration-status candidate
 * @needs-review CSS-only particle animation (simplified from canvas-based original)
 */
export function ParticleStream({ count = 30, speed = 3, className }: ParticleStreamProps) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * speed,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })),
    [count, speed]
  );

  return (
    <div className={cn("relative overflow-hidden bg-black/60 rounded-lg border border-cyan-500/10", className)}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `particle-fall ${speed}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes particle-fall {
          0% { top: -2%; }
          100% { top: 102%; }
        }
      `}</style>
    </div>
  );
}
