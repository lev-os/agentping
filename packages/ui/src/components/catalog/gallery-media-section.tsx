"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { GalleryCard } from "./gallery-card";
import { AudioPlayer } from "./audio-player";
import { VideoPlayer } from "./video-player";
import { PdfPreview } from "./pdf-preview";
import { VoiceVisualizer } from "./voice-visualizer";

export interface GalleryMediaSectionProps { className?: string; }

export function GalleryMediaSection({ className }: GalleryMediaSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Media Components</div>
      <div className="grid grid-cols-2 gap-3">
        <GalleryCard name="AudioPlayer">
          <AudioPlayer src="" title="Ambient Loop" duration="3:42" />
        </GalleryCard>
        <GalleryCard name="VideoPlayer">
          <VideoPlayer />
        </GalleryCard>
        <GalleryCard name="PdfPreview">
          <PdfPreview file="report-q4.pdf" pages={12} />
        </GalleryCard>
        <GalleryCard name="VoiceVisualizer">
          <VoiceVisualizer active bars={16} />
        </GalleryCard>
      </div>
    </div>
  );
}
