"use client";

/**
 * Tabs — Catalog component from Studio
 *
 * Compound component pattern: Tabs > TabList > Tab + TabPanel
 *
 * @source packages/studio/src/renderer/components/ui/Tabs.tsx
 * @catalog-status complete
 * @category ui-primitive
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tab components must be used within <Tabs>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Tabs (root)                                                         */
/* ------------------------------------------------------------------ */

export interface TabsProps {
  /** Default active tab id (uncontrolled) */
  defaultTab?: string;
  /** Controlled active tab */
  value?: string;
  /** Change handler for controlled mode */
  onChange?: (tabId: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultTab,
  value,
  onChange,
  children,
  className,
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab ?? "");

  const activeTab = value ?? internalTab;
  const setActiveTab = useCallback(
    (id: string) => {
      if (onChange) onChange(id);
      else setInternalTab(id);
    },
    [onChange],
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* TabList                                                             */
/* ------------------------------------------------------------------ */

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!listRef.current) return;
      const tabs = Array.from(
        listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
      );
      const current = tabs.findIndex((t) => t === document.activeElement);
      let next = current;

      if (e.key === "ArrowRight") {
        next = current < tabs.length - 1 ? current + 1 : 0;
      } else if (e.key === "ArrowLeft") {
        next = current > 0 ? current - 1 : tabs.length - 1;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      tabs[next]?.focus();
      tabs[next]?.click();
    },
    [],
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        "flex items-center gap-1",
        "border-b border-zinc-800 px-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab                                                                 */
/* ------------------------------------------------------------------ */

export interface TabProps {
  /** Unique tab identifier */
  id: string;
  children: React.ReactNode;
  /** Optional icon before label */
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ id, children, icon, disabled, className }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 text-sm",
        "border-b-2 -mb-px transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",
        isActive
          ? "border-cyan-500 text-cyan-400"
          : "border-transparent text-zinc-500 hover:text-zinc-300",
        disabled && "opacity-40 cursor-not-allowed",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* TabPanel                                                            */
/* ------------------------------------------------------------------ */

export interface TabPanelProps {
  /** Must match a Tab id */
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== id) return null;

  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={id}
      className={cn("pt-4", className)}
    >
      {children}
    </div>
  );
}
