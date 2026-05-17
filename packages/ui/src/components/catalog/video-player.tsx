"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  className,
}: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(autoPlay);
  const [progress, setProgress] = React.useState(0);
  const [time, setTime] = React.useState("0:00 / 0:00");

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
    setTime(`${formatTime(v.currentTime)} / ${formatTime(v.duration)}`);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  return (
    <div
      className={cn(
        "relative border border-cyan-500/20 bg-black rounded-lg overflow-hidden group",
        className
      )}
    >
      {src ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => setPlaying(false)}
          className="w-full block"
        />
      ) : (
        <div className="aspect-video flex items-center justify-center bg-black/80">
          <span className="text-cyan-500/30 font-mono text-xs">No video source</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-black/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl hover:bg-cyan-500/10 transition-colors"
        >
          {playing ? "\u275A\u275A" : "\u25B6"}
        </button>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 bg-cyan-500/20 rounded cursor-pointer mb-1" onClick={seek}>
          <div
            className="h-full bg-cyan-400 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-cyan-400">{time}</span>
      </div>
    </div>
  );
}
