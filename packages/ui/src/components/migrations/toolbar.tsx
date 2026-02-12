"use client";

/**
 * Toolbar — Migration candidate from Studio
 *
 * Main application toolbar with file operations, sidebar toggles,
 * layout modes, drawing tools, and zoom controls.
 *
 * @source packages/studio/src/renderer/components/Toolbar.tsx
 * @migration-status needs-review — runtime coupled (keyboard shortcuts, theme system)
 * @category root
 */

import React from "react";
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Save,
  FolderOpen,
  MessageSquare,
  Package,
  FolderTree,
  Layers,
  Palette,
  Eye,
  LayoutDashboard,
  Terminal,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Search,
  Sun,
  Moon,
  Settings,
  Download,
  Share2,
} from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type DrawingTool = "select" | "rectangle" | "ellipse" | "text";
export type SidebarMode = "chat" | "components" | "files" | "layers";
export type LayoutMode = "design" | "dashboard" | "code" | "preview";

export interface ToolbarProps {
  /** Active drawing tool */
  activeTool?: DrawingTool;
  /** Drawing tool change handler */
  onToolChange?: (tool: DrawingTool) => void;
  /** Save handler */
  onSave?: () => void;
  /** Open handler */
  onOpen?: () => void;
  /** Sidebar toggle handler */
  onToggleSidebar?: (mode: SidebarMode) => void;
  /** Currently active sidebar */
  activeSidebar?: SidebarMode | null;
  /** Current layout mode */
  layoutMode?: LayoutMode;
  /** Layout mode change handler */
  onLayoutModeChange?: (mode: LayoutMode) => void;
  /** Terminal toggle handler */
  onToggleTerminal?: () => void;
  /** Whether terminal is open */
  isTerminalOpen?: boolean;
  /** File name display */
  fileName?: string;
  /** Unsaved changes indicator */
  hasUnsavedChanges?: boolean;
  /** Undo/Redo handlers */
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  /** Zoom state */
  zoom?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  /** Command palette */
  onCommandPalette?: () => void;
  /** Theme */
  isDarkTheme?: boolean;
  onToggleTheme?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Config arrays                                                       */
/* ------------------------------------------------------------------ */

const TOOLS: { id: DrawingTool; icon: typeof MousePointer2; label: string; key: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", key: "V" },
  { id: "rectangle", icon: Square, label: "Rectangle", key: "R" },
  { id: "ellipse", icon: Circle, label: "Ellipse", key: "O" },
  { id: "text", icon: Type, label: "Text", key: "T" },
];

const SIDEBARS: { id: SidebarMode; icon: typeof MessageSquare; label: string }[] = [
  { id: "chat", icon: MessageSquare, label: "AI Chat" },
  { id: "components", icon: Package, label: "Components" },
  { id: "files", icon: FolderTree, label: "Files" },
  { id: "layers", icon: Layers, label: "Layers" },
];

const LAYOUTS: { id: LayoutMode; icon: typeof Palette; label: string }[] = [
  { id: "design", icon: Palette, label: "Design" },
  { id: "code", icon: FolderTree, label: "Code" },
  { id: "preview", icon: Eye, label: "Preview" },
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

/* ------------------------------------------------------------------ */
/* Toolbar button helper                                               */
/* ------------------------------------------------------------------ */

function ToolbarButton({
  icon: Icon,
  label,
  shortcut,
  active,
  disabled,
  onClick,
  className: extraClass,
}: {
  icon: typeof MousePointer2;
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-md transition-colors duration-100",
        "text-zinc-400 hover:text-zinc-200 hover:bg-white/5",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50",
        active && "bg-white/10 text-cyan-400",
        disabled && "opacity-30 cursor-not-allowed",
        extraClass,
      )}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      aria-pressed={active}
    >
      <Icon size={16} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Toolbar({
  activeTool = "select",
  onToolChange,
  onSave,
  onOpen,
  onToggleSidebar,
  activeSidebar,
  layoutMode = "design",
  onLayoutModeChange,
  onToggleTerminal,
  isTerminalOpen = false,
  fileName = "Untitled.apen",
  hasUnsavedChanges = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  zoom = 100,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onCommandPalette,
  isDarkTheme = true,
  onToggleTheme,
  className,
}: ToolbarProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1 px-2 h-10",
        "bg-zinc-900 border-b border-zinc-800",
        className,
      )}
      role="toolbar"
      aria-label="Main toolbar"
    >
      {/* File ops */}
      <div className="flex items-center gap-0.5" role="group" aria-label="File operations">
        <ToolbarButton icon={FolderOpen} label="Open" shortcut="Cmd+O" onClick={onOpen} />
        <ToolbarButton
          icon={Save}
          label={hasUnsavedChanges ? "Save (unsaved)" : "Save"}
          shortcut="Cmd+S"
          onClick={onSave}
          className={cn(hasUnsavedChanges && "text-amber-400")}
        />
        <ToolbarButton icon={Download} label="Export" />
        <ToolbarButton icon={Share2} label="Share" />
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1" role="separator" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5" role="group" aria-label="History">
        <ToolbarButton icon={Undo2} label="Undo" shortcut="Cmd+Z" onClick={onUndo} disabled={!canUndo} />
        <ToolbarButton icon={Redo2} label="Redo" shortcut="Cmd+Shift+Z" onClick={onRedo} disabled={!canRedo} />
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1" role="separator" />

      {/* Sidebar toggles */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Panels">
        {SIDEBARS.map((s) => (
          <ToolbarButton
            key={s.id}
            icon={s.icon}
            label={s.label}
            active={activeSidebar === s.id}
            onClick={() => onToggleSidebar?.(s.id)}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1" role="separator" />

      {/* Layout modes */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Layout modes">
        {LAYOUTS.map((l) => (
          <ToolbarButton
            key={l.id}
            icon={l.icon}
            label={l.label}
            active={layoutMode === l.id}
            onClick={() => onLayoutModeChange?.(l.id)}
          />
        ))}
        <ToolbarButton
          icon={Terminal}
          label="Terminal"
          shortcut="Cmd+`"
          active={isTerminalOpen}
          onClick={onToggleTerminal}
        />
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1" role="separator" />

      {/* Drawing tools */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Drawing tools">
        {TOOLS.map((t) => (
          <ToolbarButton
            key={t.id}
            icon={t.icon}
            label={t.label}
            shortcut={t.key}
            active={activeTool === t.id}
            onClick={() => onToolChange?.(t.id)}
          />
        ))}
      </div>

      <div className="w-px h-5 bg-zinc-800 mx-1" role="separator" />

      {/* Zoom */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Zoom">
        <ToolbarButton icon={ZoomOut} label="Zoom out" onClick={onZoomOut} />
        <button
          onClick={onZoomReset}
          className="px-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 tabular-nums"
        >
          {zoom}%
        </button>
        <ToolbarButton icon={ZoomIn} label="Zoom in" onClick={onZoomIn} />
      </div>

      {/* File name */}
      <div className="flex items-center gap-1 mx-3 min-w-0">
        <span className={cn("text-xs truncate", hasUnsavedChanges ? "text-zinc-400" : "text-zinc-500")}>
          {fileName}
        </span>
        {hasUnsavedChanges && (
          <span className="text-amber-400 text-xs" title="Unsaved changes">
            ●
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {onCommandPalette && (
          <button
            onClick={onCommandPalette}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
              "bg-zinc-800/50 border border-zinc-700/30",
              "text-xs text-zinc-500 hover:text-zinc-300",
              "transition-colors",
            )}
          >
            <Search size={12} />
            <span>Search...</span>
            <kbd className="text-[10px] text-zinc-600 ml-1">⌘K</kbd>
          </button>
        )}
        {onToggleTheme && (
          <ToolbarButton
            icon={isDarkTheme ? Sun : Moon}
            label={isDarkTheme ? "Light mode" : "Dark mode"}
            onClick={onToggleTheme}
          />
        )}
        <ToolbarButton icon={Settings} label="Settings" shortcut="Cmd+," />
      </div>
    </nav>
  );
}
