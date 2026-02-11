/**
 * @kingly/ui - SpecPanel Component
 *
 * Specification panel for displaying detailed technical specs.
 * Used by lev-graph pairing for type: "specification" nodes.
 */

"use client";

import * as React from "react";
import { useState } from "react";
	import { motion, AnimatePresence } from "framer-motion";
	import { FileCode, ChevronRight, CheckCircle, Circle, AlertCircle } from "lucide-react";
	import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
	import { Badge } from "../ui/badge";
	import { cn } from "../../lib/utils";

export interface SpecSection {
  id: string;
  title: string;
  content?: React.ReactNode;
  status?: "complete" | "in-progress" | "pending";
}

export interface SpecPanelProps {
  /** Unique identifier */
  id: string;
  /** Specification title */
  title: string;
  /** Brief description */
  description?: string;
  /** Specification status */
  status?: "draft" | "active" | "complete" | "deprecated";
  /** Version number */
  version?: string;
  /** Spec sections */
  sections?: SpecSection[];
  /** Requirements list */
  requirements?: string[];
  /** Display variant */
  variant?: "default" | "compact" | "detailed";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether sections are expandable */
  expandable?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const statusColors = {
  draft: "warning",
  active: "success",
  complete: "default",
  deprecated: "destructive",
} as const;

const sectionStatusIcons = {
  complete: CheckCircle,
  "in-progress": AlertCircle,
  pending: Circle,
};

const sizeClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export function SpecPanel({
  id,
  title,
  description,
  status = "active",
  version,
  sections = [],
  requirements = [],
  variant = "default",
  size = "md",
  expandable = true,
  className,
  onClick,
}: SpecPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <Card
      className={cn(
        "cyber-panel overflow-hidden",
        onClick ? "cursor-pointer hover:border-primary/50" : "",
        className
      )}
      data-component="spec-panel"
      data-id={id}
      onClick={onClick}
    >
      <CardHeader className={cn("pb-2 border-b border-border/30", sizeClasses[size])}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="font-display tracking-wider text-sm">{title}</span>
              {version && (
                <span className="text-xs text-muted-foreground font-mono">
                  v{version}
                </span>
              )}
            </div>
          </div>
          <Badge variant={statusColors[status] || "default"}>
            {status}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("pt-4", sizeClasses[size])}>
        {/* Description */}
        {description && variant !== "compact" && (
          <p className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
        )}

        {/* Sections */}
        {sections.length > 0 && variant !== "compact" && (
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
              Sections
            </h4>
            {sections.map((section) => {
              const StatusIcon = sectionStatusIcons[section.status || "pending"];
              const isExpanded = expandedSections.has(section.id);

              return (
                <div
                  key={section.id}
                  className="border border-border/30 rounded-md overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-2 hover:bg-muted/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (expandable) toggleSection(section.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={cn(
                          "w-3.5 h-3.5",
                          section.status === "complete" && "text-green-400",
                          section.status === "in-progress" && "text-yellow-400",
                          section.status === "pending" && "text-muted-foreground"
                        )}
                      />
                      <span className="text-sm">{section.title}</span>
                    </div>
                    {expandable && section.content && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </motion.div>
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && section.content && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 pt-0 text-sm text-muted-foreground border-t border-border/20">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* Requirements */}
        {requirements.length > 0 && variant === "detailed" && (
          <div>
            <h4 className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
              Requirements ({requirements.length})
            </h4>
            <ul className="space-y-1">
              {requirements.slice(0, 5).map((req, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary">•</span>
                  <span className="line-clamp-1">{req}</span>
                </li>
              ))}
              {requirements.length > 5 && (
                <li className="text-xs text-primary">
                  +{requirements.length - 5} more
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
