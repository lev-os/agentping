"use client";

/**
 * TerminalLinkPopup — Migration candidate from Studio
 *
 * @source packages/studio/src/renderer/components/TerminalLinkPopup.tsx
 * @migration-status complete
 * @category root
 */

import React from "react";
import { ExternalLink, Eye, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TerminalLinkPopupProps {
  /** The URL being referenced */
  url: string;
  /** Popup position */
  position: { x: number; y: number };
  /** Open in external browser */
  onOpenExternal?: () => void;
  /** Open in preview panel */
  onOpenPreview?: () => void;
  /** Close popup */
  onClose: () => void;
  className?: string;
}

export function TerminalLinkPopup({
  url,
  position,
  onOpenExternal,
  onOpenPreview,
  onClose,
  className,
}: TerminalLinkPopupProps) {
  return (
    <div
      className={cn(
        "fixed z-50",
        "bg-zinc-900 border border-zinc-700/50 rounded-lg",
        "shadow-xl shadow-black/30",
        "animate-in fade-in zoom-in-95 duration-150",
        className,
      )}
      style={{ left: position.x, top: position.y }}
    >
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-800">
        <code className="text-xs text-cyan-400 truncate max-w-[240px]">
          {url}
        </code>
        <button
          onClick={onClose}
          className="p-0.5 text-zinc-500 hover:text-zinc-300 ml-auto"
          aria-label="Close"
        >
          <X size={12} />
        </button>
      </div>

      <div className="flex flex-col p-1">
        {onOpenExternal && (
          <button
            onClick={onOpenExternal}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded",
              "text-xs text-zinc-300 hover:bg-white/5",
              "transition-colors",
            )}
          >
            <ExternalLink size={12} />
            Open in browser
          </button>
        )}
        {onOpenPreview && (
          <button
            onClick={onOpenPreview}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded",
              "text-xs text-zinc-300 hover:bg-white/5",
              "transition-colors",
            )}
          >
            <Eye size={12} />
            Open in preview
          </button>
        )}
      </div>
    </div>
  );
}
