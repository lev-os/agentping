"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: "deploy" | "alert" | "info" | "error" | "success";
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
  maxHeight?: number;
}

/**
 * ActivityFeed - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/ActivityFeed.tsx
 * @catalog-status candidate
 */
export function ActivityFeed({ activities = [], className, maxHeight = 300 }: ActivityFeedProps) {
  const typeStyles: Record<ActivityItem["type"], string> = {
    deploy: "text-blue-400",
    alert: "text-amber-400",
    error: "text-red-400",
    success: "text-emerald-400",
    info: "text-muted-foreground",
  };

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "deploy": return "\u{1F680}";
      case "alert": return "\u26A0\uFE0F";
      case "error": return "\u2717";
      case "success": return "\u2713";
      default: return "\u2139\uFE0F";
    }
  };

  return (
    <div className={cn("overflow-y-auto", className)} style={{ maxHeight }}>
      {activities.map((item) => (
        <div key={item.id} className="flex gap-3 px-3 py-2 border-b border-border last:border-0">
          <div className={cn("text-sm shrink-0 pt-0.5", typeStyles[item.type])}>
            {getIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-medium text-foreground">{item.user}</span>{" "}
              <span className="text-muted-foreground">{item.action}</span>{" "}
              <span className="text-foreground">{item.target}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
