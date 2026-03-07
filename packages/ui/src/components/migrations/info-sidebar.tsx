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
  modal?: boolean;
  onClose?: () => void;
}

/**
 * InfoSidebar - Accessible sidebar with optional focus trap for modal/slide-out use
 * @source packages/adapters/web-ui/src/components/InfoSidebar.tsx
 * @migration-status complete
 *
 * WCAG: focus trap when modal=true, Escape to close, aria-label
 */
export function InfoSidebar({ title, description, links = [], children, className, modal = false, onClose }: InfoSidebarProps) {
  const sidebarRef = React.useRef<HTMLElement>(null);

  // Focus trap + Escape for modal mode
  React.useEffect(() => {
    if (!modal || !sidebarRef.current) return;
    const sidebar = sidebarRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;

    // Focus first focusable element
    const firstFocusable = sidebar.querySelector<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])');
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose?.(); return; }
      if (e.key !== "Tab") return;

      const focusable = sidebar.querySelectorAll<HTMLElement>('a, button, input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    sidebar.addEventListener("keydown", handleKeyDown);
    return () => {
      sidebar.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [modal, onClose]);

  return (
    <aside
      ref={sidebarRef}
      role={modal ? "dialog" : undefined}
      aria-modal={modal || undefined}
      aria-label={title}
      className={cn("w-64 border-r border-border bg-card p-4 flex flex-col gap-4", className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close sidebar" className="text-muted-foreground hover:text-foreground min-h-[var(--min-touch-target,44px)] min-w-[var(--min-touch-target,44px)] flex items-center justify-center">
            &times;
          </button>
        )}
      </div>
      {links.length > 0 && (
        <nav aria-label={`${title} navigation`} className="flex flex-col gap-1">
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
