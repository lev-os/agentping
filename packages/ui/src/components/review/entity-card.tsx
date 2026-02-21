"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

const statusConfig = {
  active: { color: "var(--color-success)", label: "Active" },
  idle: { color: "var(--color-warning)", label: "Idle" },
  error: { color: "var(--color-destructive)", label: "Error" },
  offline: { color: "var(--color-muted-foreground)", label: "Offline" },
} as const;

const typeBadgeVariant = {
  agent: "default",
  model: "secondary",
  tool: "success",
  workflow: "warning",
} as const;

interface EntityCardProps {
  name: string;
  type: "agent" | "model" | "tool" | "workflow";
  status?: "active" | "idle" | "error" | "offline";
  description?: string;
  avatar?: React.ReactNode;
  metrics?: { label: string; value: string | number }[];
  onClick?: () => void;
  className?: string;
}

const EntityCard = React.forwardRef<HTMLDivElement, EntityCardProps>(
  ({ name, type, status = "idle", description, avatar, metrics, onClick, className }, ref) => {
    const statusInfo = statusConfig[status];

    return (
      <div
        ref={ref}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
        className={cn(
          "theme-card p-4 group",
          onClick && "cursor-pointer",
          className
        )}
        style={{
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        }}
      >
        {/* Header: Avatar + Name + Status */}
        <div className="flex items-start gap-3 mb-3">
          {avatar && (
            <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden border border-border flex items-center justify-center bg-muted">
              {avatar}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Status dot */}
              <span
                className="shrink-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: statusInfo.color }}
                title={statusInfo.label}
              />
              <span className="font-display text-sm font-semibold text-foreground truncate">
                {name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={typeBadgeVariant[type] as any}>{type}</Badge>
              <span className="text-xs text-muted-foreground capitalize">{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Metrics grid */}
        {metrics && metrics.length > 0 && (
          <div
            className="grid gap-x-4 gap-y-1 pt-3 border-t border-border"
            style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 3)}, 1fr)` }}
          >
            {metrics.map((m) => (
              <div key={m.label} className="min-w-0">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
                  {m.label}
                </div>
                <div className="font-mono text-sm text-foreground font-medium truncate">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

EntityCard.displayName = "EntityCard";

export { EntityCard };
export default EntityCard;
export type { EntityCardProps };
