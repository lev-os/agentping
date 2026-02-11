/**
 * @kingly/ui - ArtifactBadge Component
 *
 * Compact badge for displaying artifact status.
 * Used by lev-graph pairing for type: "artifact" nodes.
 */

"use client";

import * as React from "react";
import { Package, ExternalLink, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface ArtifactBadgeProps {
  /** Unique identifier */
  id: string;
  /** Artifact name */
  name: string;
  /** Artifact type (e.g., "npm", "docker", "file") */
  type?: string;
  /** Version string */
  version?: string;
  /** Artifact status */
  status?: "available" | "pending" | "warning" | "error";
  /** Link to artifact */
  href?: string;
  /** Display variant */
  variant?: "default" | "compact" | "detailed";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const statusConfig = {
  available: {
    icon: CheckCircle,
    color: "text-green-400",
    badgeVariant: "success" as const,
  },
  pending: {
    icon: Clock,
    color: "text-yellow-400",
    badgeVariant: "warning" as const,
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-400",
    badgeVariant: "warning" as const,
  },
  error: {
    icon: XCircle,
    color: "text-red-400",
    badgeVariant: "destructive" as const,
  },
};

const typeIcons: Record<string, React.ReactNode> = {
  npm: "📦",
  docker: "🐳",
  file: "📄",
  binary: "⚙️",
  default: "📎",
};

const sizeClasses = {
  sm: "text-xs gap-1",
  md: "text-sm gap-1.5",
  lg: "text-base gap-2",
};

export function ArtifactBadge({
  id,
  name,
  type = "default",
  version,
  status = "available",
  href,
  variant = "default",
  size = "md",
  className,
  onClick,
}: ArtifactBadgeProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;
  const typeIcon = typeIcons[type] || typeIcons.default;

  // Compact variant - just a styled badge
  if (variant === "compact") {
    return (
      <Badge
        variant={statusInfo.badgeVariant}
        className={cn(
          "inline-flex items-center cursor-default",
          sizeClasses[size],
          onClick && "cursor-pointer hover:opacity-80",
          className
        )}
        onClick={onClick}
        data-component="artifact-badge"
        data-id={id}
      >
        <span>{typeIcon}</span>
        <span className="font-mono">{name}</span>
        {version && <span className="opacity-60">@{version}</span>}
      </Badge>
    );
  }

  // Default and detailed variants - card-like display
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-md",
        "bg-muted/30 border border-border/30",
        "transition-all duration-200",
        onClick && "cursor-pointer hover:border-primary/50 hover:bg-muted/50",
        className
      )}
      onClick={onClick}
      data-component="artifact-badge"
      data-id={id}
    >
      {/* Type icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded bg-muted/50">
        <Package className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <div className={cn("flex items-center", sizeClasses[size])}>
          <span className="font-mono font-medium">{name}</span>
          {version && (
            <span className="text-muted-foreground opacity-70">@{version}</span>
          )}
        </div>
        {variant === "detailed" && (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground uppercase">{type}</span>
            <span className="flex items-center gap-1 text-xs">
              <StatusIcon className={cn("w-3 h-3", statusInfo.color)} />
              <span className={statusInfo.color}>{status}</span>
            </span>
          </div>
        )}
      </div>

      {/* Status indicator for default variant */}
      {variant === "default" && (
        <StatusIcon className={cn("w-4 h-4 ml-auto", statusInfo.color)} />
      )}

      {/* External link */}
      {href && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 ml-1"
          onClick={(e) => {
            e.stopPropagation();
            window.open(href, "_blank");
          }}
        >
          <ExternalLink className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
