"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface StarFieldProps {
  count?: number;
  speed?: number;
  className?: string;
}

/**
 * StarField - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/StarField.tsx
 * @migration-status candidate
 */
export function StarField({ count = 100, speed = 10, className }: StarFieldProps) {
  const stars = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.1,
        duration: speed + Math.random() * speed,
      })),
    [count, speed]
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none bg-black", className)}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-[twinkle_ease-in-out_infinite_alternate]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
