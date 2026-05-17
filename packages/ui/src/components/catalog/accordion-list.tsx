"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionListProps {
  items: AccordionItem[];
  className?: string;
}

/**
 * AccordionList - Catalog component from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/AccordionList.tsx
 * @catalog-status candidate
 */
export function AccordionList({ items, className }: AccordionListProps) {
  const [openId, setOpenId] = React.useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "border border-border rounded-md overflow-hidden bg-card transition-all duration-200",
              isOpen && "ring-1 ring-primary/20"
            )}
          >
            <button
              className="w-full flex justify-between items-center px-4 py-3 bg-transparent border-none text-foreground text-sm font-medium cursor-pointer text-left hover:bg-muted/50 transition-colors"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-btn-${item.id}`}
            >
              <span>{item.title}</span>
              <span
                className={cn(
                  "text-xs opacity-70 transition-transform duration-300",
                  isOpen && "rotate-180 text-primary"
                )}
                aria-hidden="true"
              >
                ▼
              </span>
            </button>
            {isOpen && (
              <div
                className="border-t border-border px-4 py-3 text-sm text-muted-foreground leading-relaxed"
                id={`accordion-content-${item.id}`}
                role="region"
                aria-labelledby={`accordion-btn-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
