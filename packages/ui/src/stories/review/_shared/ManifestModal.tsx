"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ComponentMeta } from "./types";

interface ManifestModalProps {
  component: ComponentMeta | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function ManifestModal({
  component,
  isOpen,
  onClose,
  children,
}: ManifestModalProps) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex max-h-[90vh] w-[90vw] max-w-6xl flex-col",
          "rounded-lg border border-cyan-500/10 bg-black/95 shadow-2xl",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/10 px-6 py-4">
          <div>
            <h2 className="font-mono text-sm text-cyan-300">
              {component?.name ?? "Component Detail"}
            </h2>
            {component && (
              <span className="font-mono text-xs text-zinc-500">
                {component.family} / {component.id}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-cyan-500/10 px-3 py-1 font-mono text-xs text-zinc-500 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
          >
            ESC
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
