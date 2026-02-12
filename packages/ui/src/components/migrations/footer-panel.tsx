"use client";

/**
 * FooterPanel — Migration candidate from Studio
 *
 * Bottom panel with Shell/Logs/Tasks/Diagnostics tabs.
 *
 * @source packages/studio/src/renderer/components/FooterPanel.tsx
 * @migration-status needs-review — runtime coupled (window.claudeCode, window.terminal, xterm)
 * @category root
 */

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Terminal,
  FileText,
  CheckSquare,
  Wifi,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type FooterTab = "shell" | "logs" | "tasks" | "diagnostics";

export interface FooterPanelProps {
  /** Whether the panel is expanded */
  isExpanded?: boolean;
  /** Toggle expand/collapse */
  onToggleExpand?: () => void;
  /** Default active tab */
  activeTab?: FooterTab;
  /** Tab content renderers (slot pattern for runtime content) */
  renderShell?: () => React.ReactNode;
  renderLogs?: () => React.ReactNode;
  renderTasks?: () => React.ReactNode;
  renderDiagnostics?: () => React.ReactNode;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Tab config                                                          */
/* ------------------------------------------------------------------ */

const TABS: { id: FooterTab; icon: typeof Terminal; label: string }[] = [
  { id: "shell", icon: Terminal, label: "Shell" },
  { id: "logs", icon: FileText, label: "Logs" },
  { id: "tasks", icon: CheckSquare, label: "Tasks" },
  { id: "diagnostics", icon: Wifi, label: "Diagnostics" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function FooterPanel({
  isExpanded = false,
  onToggleExpand,
  activeTab: initialTab = "shell",
  renderShell,
  renderLogs,
  renderTasks,
  renderDiagnostics,
  className,
}: FooterPanelProps) {
  const [activeTab, setActiveTab] = useState<FooterTab>(initialTab);

  const renderContent = () => {
    switch (activeTab) {
      case "shell":
        return renderShell?.() ?? (
          <div className="flex items-center justify-center h-full text-xs text-zinc-600">
            <Terminal size={16} className="mr-2" />
            Terminal shell — connect runtime adapter
          </div>
        );
      case "logs":
        return renderLogs?.() ?? (
          <div className="flex items-center justify-center h-full text-xs text-zinc-600">
            <FileText size={16} className="mr-2" />
            Log output — connect runtime adapter
          </div>
        );
      case "tasks":
        return renderTasks?.() ?? (
          <div className="flex items-center justify-center h-full text-xs text-zinc-600">
            <CheckSquare size={16} className="mr-2" />
            Task list — connect runtime adapter
          </div>
        );
      case "diagnostics":
        return renderDiagnostics?.() ?? (
          <div className="flex items-center justify-center h-full text-xs text-zinc-600">
            <Wifi size={16} className="mr-2" />
            Diagnostics — connect runtime adapter
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col border-t border-zinc-800 bg-zinc-950",
        isExpanded ? "h-64" : "h-8",
        "transition-all duration-200",
        className,
      )}
    >
      {/* Tab bar */}
      <div className="flex items-center h-8 px-2 border-b border-zinc-800 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (!isExpanded) onToggleExpand?.();
            }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded",
              "transition-colors",
              activeTab === tab.id && isExpanded
                ? "text-cyan-400"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={onToggleExpand}
          className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
      )}
    </div>
  );
}
