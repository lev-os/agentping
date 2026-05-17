"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface RadialNavItem {
  id: string;
  label: string;
  icon?: string;
  onClick?: () => void;
}

export interface RadialNavProps {
  items?: RadialNavItem[];
  size?: number;
  className?: string;
}

/**
 * RadialNav - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/RadialNav.tsx
 * @catalog-status candidate
 * @needs-review Radial/circular navigation menu
 */
export function RadialNav({ items = [], size = 200, className }: RadialNavProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border border-cyan-500/10" />
      {items.map((item, i) => {
        const angle = (Math.PI * 2 * i) / items.length - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return (
          <button
            key={item.id}
            className="absolute w-10 h-10 rounded-full border border-cyan-500/20 bg-black/60 flex items-center justify-center text-xs font-mono text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-colors"
            style={{ left: x - 20, top: y - 20 }}
            onClick={item.onClick}
            title={item.label}
          >
            {item.icon || item.label.charAt(0)}
          </button>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500/30" />
      </div>
    </div>
  );
}
