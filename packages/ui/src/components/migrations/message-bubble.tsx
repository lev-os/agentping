"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface MessageBubbleProps {
  content: string;
  sender: string;
  timestamp?: string;
  isOwn?: boolean;
  avatar?: React.ReactNode;
  className?: string;
}

/**
 * MessageBubble - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/MessageBubble.tsx
 * @migration-status candidate
 */
export function MessageBubble({ content, sender, timestamp, isOwn = false, avatar, className }: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-2 max-w-[80%]", isOwn ? "ml-auto flex-row-reverse" : "", className)}>
      {avatar && <div className="shrink-0 mt-1">{avatar}</div>}
      <div>
        <div className="text-[10px] text-muted-foreground mb-0.5 px-1">{sender}</div>
        <div className={cn("px-3 py-2 rounded-lg text-sm", isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
          {content}
        </div>
        {timestamp && <div className="text-[10px] text-muted-foreground mt-0.5 px-1">{timestamp}</div>}
      </div>
    </div>
  );
}
