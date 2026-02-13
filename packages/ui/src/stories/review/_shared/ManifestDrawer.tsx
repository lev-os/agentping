"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ComponentMeta } from "./types";

const STATUS_BADGE_COLORS: Record<string, string> = {
  pass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  fail: "bg-red-500/20 text-red-400 border-red-500/30",
  shell: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hollow: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  "needs-review": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const DOMAIN_BADGE_COLORS: Record<string, string> = {
  webui: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  studio: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  canvas: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "dm-ui": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  shared: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

interface ManifestDrawerProps {
  component: ComponentMeta | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ManifestDrawer({
  component,
  isOpen,
  onClose,
}: ManifestDrawerProps) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-50 h-full w-80 border-l border-cyan-500/10 bg-black/95 shadow-2xl transition-transform duration-200",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/10 px-4 py-3">
          <span className="font-mono text-sm text-cyan-300">
            Component Detail
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 font-mono text-xs text-zinc-500 transition-colors hover:text-cyan-400"
          >
            ESC
          </button>
        </div>

        {/* Content */}
        {component && (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {/* ID + Name */}
              <div>
                <div className="font-mono text-xs text-zinc-500">ID</div>
                <div className="font-mono text-sm text-cyan-300">
                  {component.id}
                </div>
              </div>

              <div>
                <div className="font-mono text-xs text-zinc-500">Name</div>
                <div className="text-sm text-white">{component.name}</div>
              </div>

              {/* Family */}
              <div>
                <div className="font-mono text-xs text-zinc-500">Family</div>
                <div className="font-mono text-xs text-zinc-300">
                  {component.family}
                </div>
              </div>

              {/* Domain */}
              <div>
                <div className="mb-1 font-mono text-xs text-zinc-500">
                  Domain
                </div>
                <span
                  className={cn(
                    "inline-block rounded border px-2 py-0.5 font-mono text-xs",
                    DOMAIN_BADGE_COLORS[component.domain] ??
                      DOMAIN_BADGE_COLORS.shared,
                  )}
                >
                  {component.domain}
                </span>
              </div>

              {/* Gate Status */}
              <div>
                <div className="mb-1 font-mono text-xs text-zinc-500">
                  Gate Status
                </div>
                <span
                  className={cn(
                    "inline-block rounded border px-2 py-0.5 font-mono text-xs",
                    STATUS_BADGE_COLORS[component.gateStatus] ??
                      STATUS_BADGE_COLORS.pass,
                  )}
                >
                  {component.gateStatus}
                </span>
              </div>

              {/* Classification */}
              <div>
                <div className="font-mono text-xs text-zinc-500">
                  Classification
                </div>
                <div className="font-mono text-sm text-zinc-300">
                  {component.classification}
                </div>
              </div>

              {/* Lanes */}
              <div>
                <div className="mb-1 font-mono text-xs text-zinc-500">
                  Lanes
                </div>
                <div className="flex flex-wrap gap-1">
                  {component.lanes.map((lane) => (
                    <span
                      key={lane}
                      className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-400"
                    >
                      {lane}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bead ID */}
              <div>
                <div className="font-mono text-xs text-zinc-500">Bead ID</div>
                <div className="font-mono text-xs text-cyan-400">
                  {component.beadId}
                </div>
              </div>

              {/* Story Path */}
              <div>
                <div className="font-mono text-xs text-zinc-500">
                  Story Path
                </div>
                <div className="font-mono text-xs text-zinc-300">
                  {component.storyPath}
                </div>
              </div>

              {/* Markers */}
              {component.markers.length > 0 && (
                <div>
                  <div className="mb-1 font-mono text-xs text-zinc-500">
                    Markers
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {component.markers.map((marker) => (
                      <span
                        key={marker}
                        className="rounded bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-400"
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Notes */}
              {component.ownerNotes && (
                <div>
                  <div className="mb-1 font-mono text-xs text-zinc-500">
                    Notes
                  </div>
                  <div className="rounded bg-white/5 p-2 text-xs text-zinc-400">
                    {component.ownerNotes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
