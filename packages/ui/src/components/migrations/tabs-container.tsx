"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TabsContainerTab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

export interface TabsContainerProps {
  tabs?: TabsContainerTab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function TabsContainer({
  tabs = [],
  activeTab,
  onChange,
  className,
}: TabsContainerProps) {
  const active = activeTab || tabs[0]?.id;
  const currentTab = tabs.find((t) => t.id === active);

  return (
    <div
      className={cn(
        "border border-cyan-500/20 bg-black/60 rounded-lg font-mono overflow-hidden",
        className
      )}
    >
      <div className="flex border-b border-cyan-500/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={cn(
              "px-4 py-2.5 text-xs whitespace-nowrap transition-colors relative",
              tab.id === active
                ? "text-cyan-300"
                : "text-cyan-500/50 hover:text-cyan-400"
            )}
          >
            {tab.label}
            {tab.id === active && (
              <span className="absolute bottom-0 inset-x-0 h-px bg-cyan-400" />
            )}
          </button>
        ))}
      </div>
      <div className="p-4">
        {currentTab?.content ?? (
          <span className="text-xs text-cyan-500/30">No content</span>
        )}
      </div>
    </div>
  );
}
