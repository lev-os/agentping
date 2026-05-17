"use client";

/**
 * Terminal — Catalog component from Studio
 *
 * Full terminal emulator shell. Original uses xterm.js.
 *
 * @source packages/studio/src/renderer/components/Terminal.tsx
 * @catalog-status needs-review — runtime coupled (xterm.js, window.terminal, window.studioControl)
 * @category root
 */

import React, { useState } from "react";
import {
  Plus,
  X,
  Search,
  Terminal as TerminalIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface TerminalTab {
  id: string;
  title: string;
  active?: boolean;
}

export interface TerminalProps {
  /** Whether terminal is visible */
  isVisible?: boolean;
  /** Terminal tabs */
  tabs?: TerminalTab[];
  /** Active tab id */
  activeTabId?: string;
  /** Tab select handler */
  onSelectTab?: (tabId: string) => void;
  /** New tab handler */
  onNewTab?: () => void;
  /** Close tab handler */
  onCloseTab?: (tabId: string) => void;
  /** Terminal output lines (display shell) */
  outputLines?: string[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component (visual shell — xterm requires runtime)                   */
/* ------------------------------------------------------------------ */

export function Terminal({
  isVisible = true,
  tabs = [{ id: "default", title: "bash" }],
  activeTabId,
  onSelectTab,
  onNewTab,
  onCloseTab,
  outputLines = [],
  className,
}: TerminalProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isVisible) return null;

  return (
    <div className={cn("flex flex-col h-full bg-zinc-950", className)}>
      {/* Tab bar */}
      <div className="flex items-center h-8 px-1 border-b border-zinc-800 flex-shrink-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center gap-1 px-2 py-1 rounded-t text-[11px]",
              "cursor-pointer transition-colors",
              tab.id === (activeTabId ?? tabs[0]?.id)
                ? "bg-zinc-900 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300",
            )}
            onClick={() => onSelectTab?.(tab.id)}
          >
            <TerminalIcon size={10} />
            <span>{tab.title}</span>
            {onCloseTab && tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-500 hover:text-zinc-300"
              >
                <X size={8} />
              </button>
            )}
          </div>
        ))}

        {onNewTab && (
          <button
            onClick={onNewTab}
            className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors ml-0.5"
          >
            <Plus size={10} />
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => setShowSearch(!showSearch)}
          className={cn(
            "p-1 text-zinc-600 hover:text-zinc-400 transition-colors",
            showSearch && "text-cyan-400",
          )}
        >
          <Search size={10} />
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="flex items-center gap-2 px-2 py-1 border-b border-zinc-800">
          <Search size={10} className="text-zinc-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terminal..."
            className="flex-1 bg-transparent text-xs text-zinc-300 placeholder-zinc-600 outline-none"
            autoFocus
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-zinc-500">
            <X size={10} />
          </button>
        </div>
      )}

      {/* Terminal output area (visual stub) */}
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-zinc-300">
        {outputLines.length > 0 ? (
          outputLines.map((line, i) => (
            <div key={i} className="leading-5 whitespace-pre-wrap">
              {line}
            </div>
          ))
        ) : (
          <div className="text-zinc-600">
            <div className="mb-1">$ <span className="text-zinc-500">Terminal ready</span></div>
            <div className="text-[10px] text-zinc-700">
              Connect xterm.js adapter for full terminal functionality
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
