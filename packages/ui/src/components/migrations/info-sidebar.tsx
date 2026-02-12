"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SidebarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface InfoSidebarProps {
  title: string;
  description?: string;
  links?: SidebarLink[];
  children?: React.ReactNode;
  className?: string;
}

/**
 * InfoSidebar - Migrated from @agentping/web-ui
 * @source packages/adapters/web-ui/src/components/InfoSidebar.tsx
 * @migration-status candidate
 */
export function InfoSidebar({ title, description, links = [], children, className }: InfoSidebarProps) {
  return (
    <aside className={cn("w-64 border-r border-border bg-card p-4 flex flex-col gap-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      {links.length > 0 && (
        <nav className="flex flex-col gap-1">
          {links.map((link, i) => (
            <a key={i} href={link.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted">
              {link.icon}
              {link.label}
            </a>
          ))}
        </nav>
      )}
      {children}
    </aside>
  );
}
