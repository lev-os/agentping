"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  type?: "default" | "alert" | "active";
}

export interface GeoMapProps {
  markers?: MapMarker[];
  width?: number;
  height?: number;
  className?: string;
}

/**
 * GeoMap - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/visuals/GeoMap.tsx
 * @catalog-status candidate
 * @needs-review Requires map library integration for production
 */
export function GeoMap({ markers = [], width = 600, height = 300, className }: GeoMapProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">GEO MAP</span>
        <span className="text-xs font-mono text-cyan-500/40 ml-2">[{markers.length} markers]</span>
      </div>
      <div className="relative bg-black/40" style={{ height, maxWidth: width }}>
        <svg width="100%" height="100%" viewBox="0 0 600 300" className="opacity-20">
          <ellipse cx="300" cy="150" rx="250" ry="120" fill="none" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5" />
          <line x1="50" y1="150" x2="550" y2="150" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
          <line x1="300" y1="30" x2="300" y2="270" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5" />
        </svg>
        {markers.map((m) => {
          const x = ((m.lng + 180) / 360) * 100;
          const y = ((90 - m.lat) / 180) * 100;
          const colors: Record<string, string> = { default: "bg-cyan-400", alert: "bg-red-400", active: "bg-green-400" };
          return (
            <div
              key={m.id}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            >
              <div className={cn("w-2 h-2 rounded-full animate-pulse", colors[m.type || "default"])} />
              {m.label && <div className="text-[8px] font-mono text-cyan-500/60 whitespace-nowrap mt-0.5">{m.label}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
