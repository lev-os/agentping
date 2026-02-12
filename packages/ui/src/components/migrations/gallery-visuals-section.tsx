"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { CircuitPattern } from "./circuit-pattern";
import { GeoMap } from "./geo-map";
import { GlobeWireframe } from "./globe-wireframe";
import { HexGridBackground } from "./hex-grid-background";
import { HolographicCard } from "./holographic-card";
import { ParticleStream } from "./particle-stream";
import { RadarSweep } from "./radar-sweep";
import { SonarDisplay } from "./sonar-display";
import { StarField } from "./star-field";
import { VoiceVisualizer } from "./voice-visualizer";

export interface GalleryVisualsSectionProps { className?: string; }

export function GalleryVisualsSection({ className }: GalleryVisualsSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Visual Components</div>
      <div className="grid grid-cols-3 gap-3">
        <GalleryCard name="CircuitPattern">
          <CircuitPattern className="h-[80px]" />
        </GalleryCard>
        <GalleryCard name="GeoMap">
          <GeoMap
            height={100}
            markers={[
              { id: "1", lat: 37.77, lng: -122.42, label: "SF", type: "active" },
              { id: "2", lat: 51.51, lng: -0.13, label: "LON", type: "default" },
              { id: "3", lat: 35.68, lng: 139.69, label: "TYO", type: "alert" },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="GlobeWireframe">
          <GlobeWireframe size={120} />
        </GalleryCard>
        <GalleryCard name="HexGridBackground">
          <div className="relative h-[80px] bg-black/40 rounded">
            <HexGridBackground opacity={0.15} />
          </div>
        </GalleryCard>
        <GalleryCard name="HolographicCard">
          <HolographicCard holder="AGENT ZERO" number="4921  ****  ****  1337" expiry="12/30" />
        </GalleryCard>
        <GalleryCard name="ParticleStream">
          <ParticleStream count={20} speed={2} className="h-[80px]" />
        </GalleryCard>
        <GalleryCard name="RadarSweep">
          <RadarSweep
            size={120}
            blips={[
              { angle: 30, distance: 70 },
              { angle: 150, distance: 45 },
              { angle: 280, distance: 85 },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="SonarDisplay">
          <SonarDisplay
            size={120}
            pings={[
              { angle: 90, distance: 50 },
              { angle: 200, distance: 75 },
            ]}
          />
        </GalleryCard>
        <GalleryCard name="StarField">
          <div className="relative h-[80px] rounded overflow-hidden">
            <StarField count={40} speed={5} />
          </div>
        </GalleryCard>
        <GalleryCard name="VoiceVisualizer">
          <VoiceVisualizer active bars={12} />
        </GalleryCard>
      </div>
    </div>
  );
}
