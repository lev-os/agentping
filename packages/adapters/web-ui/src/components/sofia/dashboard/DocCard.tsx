/**
 * @kingly/ui - DocCard Component
 *
 * Document card for displaying deliverable documents in dashboard.
 * Used by lev-graph pairing for type: "document" nodes.
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ExternalLink, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export interface DocCardProps {
  /** Unique identifier */
  id: string;
  /** Document title */
  title: string;
  /** Brief description */
  description?: string;
  /** Document status */
  status?: "draft" | "active" | "complete" | "archived";
  /** Document type/category */
  type?: string;
  /** Associated tags */
  tags?: string[];
  /** Last updated timestamp */
  updatedAt?: string;
  /** Link to full document */
  href?: string;
  /** Display variant */
  variant?: "default" | "compact" | "detailed";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether content is expandable */
  expandable?: boolean;
  /** Expanded content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const statusColors = {
  draft: "warning",
  active: "success",
  complete: "default",
  archived: "secondary",
} as const;

const sizeClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function DocCard({
  id,
  title,
  description,
  status = "active",
  type,
  tags = [],
  updatedAt,
  href,
  variant = "default",
  size = "md",
  expandable = false,
  children,
  className,
  onClick,
}: DocCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (expandable) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  return (
    <Card
      className={cn(
        "cyber-panel overflow-hidden transition-all duration-200",
        onClick || expandable ? "cursor-pointer hover:border-primary/50" : "",
        className
      )}
      data-component="doc-card"
      data-id={id}
      onClick={handleClick}
    >
      <CardHeader className={cn("pb-2", sizeClasses[size])}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-display tracking-wider text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusColors[status] || "default"}>
              {status}
            </Badge>
            {expandable && (
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>
            )}
            {href && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(href, "_blank");
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("pt-0", sizeClasses[size])}>
        {/* Description */}
        {description && variant !== "compact" && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {type && (
              <span className="font-mono uppercase">{type}</span>
            )}
            {updatedAt && (
              <span className="opacity-60">{updatedAt}</span>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && variant === "detailed" && (
          <div className="flex items-center gap-1 mt-3 flex-wrap">
            <Tag className="w-3 h-3 text-muted-foreground" />
            {tags.map((tag) => (
              <Badge key={tag} variant="ghost" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Expandable content */}
        <AnimatePresence>
          {expandable && isExpanded && Boolean(children) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-border/30 mt-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
