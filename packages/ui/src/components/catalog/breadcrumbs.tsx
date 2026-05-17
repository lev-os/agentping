"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface BreadcrumbsProps {
  path: string[];
  onNavigate?: (index: number) => void;
  className?: string;
}

/**
 * Breadcrumbs - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/Breadcrumbs.tsx
 * @catalog-status candidate
 */
export function Breadcrumbs({ path = [], onNavigate, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-sm", className)} aria-label="Breadcrumb">
      {path.map((segment, i) => {
        const isLast = i === path.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-muted-foreground/50">/</span>}
            {isLast ? (
              <span className="text-foreground font-medium">{segment}</span>
            ) : (
              <button
                className="text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
                onClick={() => onNavigate?.(i)}
              >
                {segment}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
