"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface EnrichmentPanelProps {
  className?: string;
  children?: React.ReactNode;
}

export function EnrichmentPanel({ className, children }: EnrichmentPanelProps) {
  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Enrichment Panel</span>
      </div>
      <div className="p-4">
        {children ?? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(0,229,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <div className="text-xs font-mono text-cyan-500/30 text-center">
              No enrichment data available.<br />
              Select a directive to enrich.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
