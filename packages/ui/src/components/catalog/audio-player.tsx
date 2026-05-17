"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AudioPlayerProps {
  src: string;
  title?: string;
  duration?: string;
  className?: string;
}

/**
 * AudioPlayer - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/AudioPlayer.tsx
 * @catalog-status candidate
 */
export function AudioPlayer({ src, title = "Unknown Track", duration = "0:00", className }: AudioPlayerProps) {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-md bg-card border border-border", className)}>
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />
      <button onClick={toggle} className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0">
        {playing ? "\u23F8" : "\u25B6"}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{title}</div>
        <div className="w-full h-1 rounded-full bg-muted mt-1.5 overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{duration}</span>
    </div>
  );
}
