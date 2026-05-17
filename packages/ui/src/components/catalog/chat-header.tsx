"use client";

/**
 * ChatHeader — Catalog component from Studio
 *
 * @source packages/studio/src/renderer/components/chat/ChatHeader.tsx
 * @catalog-status needs-review — runtime coupled (workspace, session state)
 * @category chat
 */

import React, { useState } from "react";
import {
  ChevronDown,
  FolderOpen,
  Hash,
  MessageSquare,
  Pencil,
  Settings,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ChatHeaderProps {
  /** Session title / agent name */
  title?: string;
  /** Turn count for this session */
  turnCount?: number;
  /** Current workspace path */
  workspacePath?: string;
  /** Available workspaces */
  workspaces?: string[];
  /** Whether session title is editable */
  editable?: boolean;
  /** Session rename handler */
  onRename?: (name: string) => void;
  /** Workspace change handler */
  onWorkspaceChange?: (path: string) => void;
  /** Settings button handler */
  onSettingsClick?: () => void;
  /** Close/end session handler */
  onClose?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function ChatHeader({
  title = "Claude",
  turnCount = 0,
  workspacePath,
  workspaces = [],
  editable = false,
  onRename,
  onWorkspaceChange,
  onSettingsClick,
  onClose,
  className,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [showWorkspaces, setShowWorkspaces] = useState(false);

  const handleRenameSubmit = () => {
    if (editValue.trim() && editValue !== title) {
      onRename?.(editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-2.5",
        "border-b border-zinc-800 bg-zinc-900/50",
        className,
      )}
    >
      {/* Left: Title + turn count */}
      <div className="flex items-center gap-3 min-w-0">
        <MessageSquare size={16} className="text-cyan-500 flex-shrink-0" />

        {isEditing ? (
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className={cn(
              "bg-zinc-800 border border-cyan-500/30 rounded px-2 py-0.5",
              "text-sm text-zinc-100 outline-none",
            )}
          />
        ) : (
          <button
            onClick={() => editable && setIsEditing(true)}
            className={cn(
              "text-sm font-medium text-zinc-200 truncate",
              editable && "hover:text-cyan-400 cursor-pointer",
            )}
          >
            {title}
            {editable && <Pencil size={10} className="inline ml-1.5 text-zinc-500" />}
          </button>
        )}

        {turnCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Hash size={10} />
            {turnCount} turns
          </span>
        )}
      </div>

      {/* Right: Workspace selector + actions */}
      <div className="flex items-center gap-1.5">
        {/* Workspace selector */}
        {workspacePath && (
          <div className="relative">
            <button
              onClick={() => setShowWorkspaces(!showWorkspaces)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded",
                "text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5",
                "transition-colors",
              )}
            >
              <FolderOpen size={12} />
              <span className="max-w-[120px] truncate">
                {workspacePath.split("/").pop()}
              </span>
              <ChevronDown size={10} />
            </button>

            {showWorkspaces && workspaces.length > 0 && (
              <div
                className={cn(
                  "absolute right-0 top-full mt-1 z-50",
                  "w-56 rounded-lg border border-zinc-700/50 bg-zinc-900",
                  "shadow-xl shadow-black/30 py-1",
                )}
              >
                {workspaces.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      onWorkspaceChange?.(ws);
                      setShowWorkspaces(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs",
                      "text-zinc-400 hover:text-zinc-200 hover:bg-white/5",
                      ws === workspacePath && "text-cyan-400",
                    )}
                  >
                    {ws}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            aria-label="Settings"
          >
            <Settings size={14} />
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            aria-label="Close session"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
