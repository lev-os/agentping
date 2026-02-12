"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SidePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  side?: "left" | "right";
  title?: string;
  children?: React.ReactNode;
  width?: number;
  className?: string;
}

export function SidePanel({
  isOpen = false,
  onClose,
  side = "right",
  title = "Panel",
  children,
  width = 320,
  className,
}: SidePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 font-mono">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute top-0 bottom-0 bg-black/90 border-cyan-500/20 flex flex-col transition-transform",
          side === "right"
            ? "right-0 border-l"
            : "left-0 border-r",
          className
        )}
        style={{ width }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10">
          <span className="text-sm text-cyan-100">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-cyan-500/50 hover:text-cyan-300 transition-colors text-lg"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
