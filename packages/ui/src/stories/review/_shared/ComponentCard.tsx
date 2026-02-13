"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ComponentMeta } from "./types";

const STATUS_COLORS: Record<string, string> = {
  pass: "bg-emerald-500/20 text-emerald-400",
  fail: "bg-red-500/20 text-red-400",
  shell: "bg-amber-500/20 text-amber-400",
  hollow: "bg-zinc-500/20 text-zinc-400",
  "needs-review": "bg-purple-500/20 text-purple-400",
};

const DOMAIN_COLORS: Record<string, string> = {
  webui: "text-blue-400",
  studio: "text-purple-400",
  canvas: "text-emerald-400",
  "dm-ui": "text-amber-400",
  shared: "text-cyan-400",
};

const CLASSIFICATION_LABELS: Record<string, string> = {
  REAL: "Fully implemented migration",
  "RE-EXPORT": "Re-export shim from original package",
  SHELL: "Placeholder shell with typed props",
  HOLLOW: "Gallery section wrapper, no impl",
  UNKNOWN: "Classification pending",
};

interface ComponentCardProps {
  meta: ComponentMeta;
  children: React.ReactNode;
  onSelect?: (meta: ComponentMeta) => void;
}

export function ComponentCard({
  meta,
  children,
  onSelect,
}: ComponentCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border border-cyan-500/10 bg-black/40",
        "transition-colors hover:border-cyan-500/20",
        onSelect && "cursor-pointer",
      )}
      onClick={() => onSelect?.(meta)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(meta);
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      title={CLASSIFICATION_LABELS[meta.classification]}
    >
      {/* Status badge (top-right) */}
      <div className="absolute right-2 top-2 z-10">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[10px]",
            STATUS_COLORS[meta.gateStatus] ?? STATUS_COLORS.pass,
          )}
        >
          {meta.gateStatus}
        </span>
      </div>

      {/* Rendered component */}
      <div className="min-h-[120px] overflow-hidden rounded-t-lg border-b border-cyan-500/5 p-3">
        {children}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2">
        <div>
          <div className="font-mono text-xs text-cyan-300">{meta.name}</div>
          <div className="font-mono text-[10px] text-zinc-600">
            {meta.family}
          </div>
        </div>
        <span
          className={cn(
            "font-mono text-[10px]",
            DOMAIN_COLORS[meta.domain] ?? DOMAIN_COLORS.shared,
          )}
        >
          {meta.domain}
        </span>
      </div>
    </div>
  );
}
