"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AgentAvatarProps {
  name: string;
  src?: string;
  initials?: string;
  status?: "idle" | "speaking" | "thinking" | "offline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };
const statusColor = { idle: "bg-emerald-500", speaking: "bg-blue-500 animate-pulse", thinking: "bg-amber-500 animate-pulse", offline: "bg-muted-foreground" };

/**
 * AgentAvatar - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/AgentAvatar.tsx
 * @catalog-status candidate
 */
export function AgentAvatar({ name = "", src, initials, status = "idle", size = "md", className }: AgentAvatarProps) {
  const display = initials ?? (name ? name.slice(0, 2).toUpperCase() : "??");

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} title={name}>
      <div className={cn("rounded-full bg-muted flex items-center justify-center overflow-hidden ring-2 ring-border", sizeMap[size])}>
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="font-medium text-foreground">{display}</span>
        )}
      </div>
      <div className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background", statusColor[status])} />
    </div>
  );
}
