"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface GeoLocation {
  lat: number;
  lng: number;
  label?: string;
}

export interface GeoRequestMapProps {
  points: GeoLocation[];
  height?: number;
  className?: string;
}

/**
 * GeoRequestMap - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/GeoRequestMap.tsx
 * @migration-status candidate
 * @needs-review Simplified placeholder — original renders SVG world map with dots
 */
export function GeoRequestMap({ points = [], height = 300, className }: GeoRequestMapProps) {
  return (
    <div className={cn("border border-border rounded-md bg-card overflow-hidden relative", className)} style={{ height }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">{points.length} location{points.length !== 1 ? "s" : ""}</div>
      </div>
      {/* TODO: Integrate actual map renderer (Leaflet/Mapbox) or SVG world map */}
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
        {points.slice(0, 5).map((pt, i) => (
          <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground">
            {pt.label ?? `${pt.lat.toFixed(1)}, ${pt.lng.toFixed(1)}`}
          </span>
        ))}
        {points.length > 5 && <span className="text-[10px] text-muted-foreground">+{points.length - 5} more</span>}
      </div>
    </div>
  );
}
