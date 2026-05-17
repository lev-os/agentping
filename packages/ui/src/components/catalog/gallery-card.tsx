"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface GalleryCardProps {
  name: string;
  className?: string;
  shell?: boolean;
  children?: React.ReactNode;
}

class GalleryErrorBoundary extends React.Component<
  { name: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-full min-h-[60px] text-center">
          <div className="text-[10px] font-mono text-red-400/60">
            {this.props.name}: render error
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function GalleryCard({ name, className, shell, children }: GalleryCardProps) {
  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg p-3 flex flex-col gap-2 overflow-hidden",
        shell && "opacity-50",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-wider truncate">
          {name}
        </div>
        {shell && (
          <span className="text-[8px] font-mono text-yellow-500/50 border border-yellow-500/30 rounded px-1">
            SHELL
          </span>
        )}
      </div>
      <div className="min-h-[60px] max-h-[200px] overflow-hidden">
        {shell ? (
          <div className="flex items-center justify-center h-[60px] text-[10px] font-mono text-cyan-500/20">
            awaiting implementation
          </div>
        ) : (
          <GalleryErrorBoundary name={name}>
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-[60px]">
                  <div className="text-[10px] font-mono text-cyan-500/30 animate-pulse">loading...</div>
                </div>
              }
            >
              {children}
            </React.Suspense>
          </GalleryErrorBoundary>
        )}
      </div>
    </div>
  );
}
