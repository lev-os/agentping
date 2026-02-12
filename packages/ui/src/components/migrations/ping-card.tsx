"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface PingCardPing {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt?: string;
}

export interface PingCardProps {
  ping?: PingCardPing;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * PingCard - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/PingCard.tsx
 * @migration-status candidate
 */
export function PingCard({ ping, isSelected, onClick, className }: PingCardProps) {
  if (!ping) return null;
  const payload = ping.payload as { title?: string; question?: string; message?: string };
  const title = payload.title || payload.question || payload.message || "Ping";

  const typeIcons: Record<string, string> = {
    step_approval: "\uD83D\uDCCB", approval: "\u2705", question: "\u2753",
    selection: "\uD83D\uDD18", research_request: "\uD83D\uDD2C", notification: "\u2139\uFE0F",
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-3 cursor-pointer transition-colors",
        isSelected ? "border-cyan-400 bg-cyan-500/10" : "border-cyan-500/20 bg-black/60 hover:border-cyan-500/40",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{typeIcons[ping.type] || "\uD83D\uDCCC"}</span>
        <span className="text-xs font-mono text-cyan-300 flex-1 truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] font-mono text-cyan-500/40 uppercase">{ping.type.replace(/_/g, " ")}</span>
        {ping.createdAt && <span className="text-[10px] font-mono text-cyan-500/30 ml-auto">{ping.createdAt}</span>}
      </div>
    </div>
  );
}
