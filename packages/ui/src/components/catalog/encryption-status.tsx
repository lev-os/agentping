"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface EncryptionChannel {
  name: string;
  algorithm: string;
  strength: number;
  status: "active" | "expired" | "rotating";
}

export interface EncryptionStatusProps {
  channels?: EncryptionChannel[];
  className?: string;
}

/**
 * EncryptionStatus - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/system/EncryptionStatus.tsx
 * @catalog-status candidate
 */
export function EncryptionStatus({ channels = [], className }: EncryptionStatusProps) {
  const statusColors: Record<string, string> = {
    active: "text-green-400",
    expired: "text-red-400",
    rotating: "text-yellow-400 animate-pulse",
  };

  return (
    <div className={cn("border border-cyan-500/20 bg-black/60 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-cyan-500/10">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">ENCRYPTION STATUS</span>
      </div>
      <div className="divide-y divide-cyan-500/5">
        {channels.map((ch) => (
          <div key={ch.name} className="px-4 py-2 flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-300 flex-1">{ch.name}</span>
            <span className="text-[10px] font-mono text-cyan-500/40">{ch.algorithm}</span>
            <div className="w-16 h-1.5 bg-black/40 rounded-full">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${ch.strength}%` }} />
            </div>
            <span className={cn("text-[10px] font-mono uppercase", statusColors[ch.status])}>{ch.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
