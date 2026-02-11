/**
 * Toolbar Component
 *
 * Main application toolbar with file operations, sidebar toggles,
 * layout modes, and drawing tools. Enhanced with keyboard shortcuts,
 * tooltips, and accessibility.
 */

import { useEffect, useState, useRef } from 'react';
import {
    MousePointer2, Square, Circle, Type, Save, FolderOpen,
    Package, MessageSquare, FolderTree, LayoutDashboard, Palette, Layers,
    Terminal, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Settings, Command,
    ChevronDown, Clock, Download, Share2, Search, Sun, Moon
} from 'lucide-react';
import { IconButton, Kbd, Dropdown, Tooltip } from './ui';
import { getCurrentMode, setMode } from '../styles/themeConfig';
import './Toolbar.css';

type Tool = 'select' | 'rectangle' | 'ellipse' | 'text';
type SidebarMode = 'chat' | 'components' | 'files' | 'layers';
type LayoutMode = 'design' | 'dashboard' | 'code' | 'preview' | 'dashboards';

interface ToolbarProps {
    activeTool: Tool;
    onToolChange: (tool: Tool) => void;
    onSave: () => void;
    onOpen: () => void;
    onToggleSidebar: (mode: SidebarMode) => void;
    activeSidebar: SidebarMode | null;
    layoutMode: LayoutMode;
    onLayoutModeChange: (mode: LayoutMode) => void;
    onToggleTerminal: () => void;
    isTerminalOpen: boolean;
    fileName?: string;
    hasUnsavedChanges?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    zoom?: number;
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onZoomReset?: () => void;
    onCommandPalette?: () => void;
    workspacePath?: string;
    recentFiles?: string[];
    onOpenRecent?: (path: string) => void;
}

const TOOLS: { id: Tool; icon: typeof MousePointer2; label: string; shortcut: string }[] = [
    { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
    { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse', shortcut: 'O' },
    { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
];

const SIDEBAR_ITEMS: { id: SidebarMode; icon: typeof MessageSquare; label: string; shortcut?: string }[] = [
    { id: 'chat', icon: MessageSquare, label: 'AI Chat', shortcut: 'Mod+1' },
    { id: 'components', icon: Package, label: 'Components', shortcut: 'Mod+2' },
    { id: 'files', icon: FolderTree, label: 'Files', shortcut: 'Mod+3' },
    { id: 'layers', icon: Layers, label: 'Layers', shortcut: 'Mod+4' },
];

const LAYOUT_MODES: { id: LayoutMode; icon: typeof Palette; label: string }[] = [
    { id: 'design', icon: Palette, label: 'Design' },
    { id: 'code', icon: FolderTree, label: 'Code' },
    { id: 'preview', icon: Eye, label: 'Preview' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'dashboards', icon: LayoutDashboard, label: 'Dashboards' },
];

export function Toolbar({
    activeTool,
    onToolChange,
    onSave,
    onOpen,
    onToggleSidebar,
    activeSidebar,
    layoutMode,
    onLayoutModeChange,
    onToggleTerminal,
    isTerminalOpen,
    fileName = 'Untitled.apen',
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
    workspacePath,
    recentFiles = [],
    onOpenRecent
}: ToolbarProps) {
    const [showRecentFiles, setShowRecentFiles] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(() => getCurrentMode() === 'dark');
    const recentFilesRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Skip if typing in an input
            if ((e.target as HTMLElement).tagName === 'INPUT' ||
                (e.target as HTMLElement).tagName === 'TEXTAREA') {
                return;
            }

            const isMod = e.metaKey || e.ctrlKey;

            // Tool shortcuts (single keys, no modifier)
            if (!isMod && !e.shiftKey && !e.altKey) {
                switch (e.key.toLowerCase()) {
                    case 'v': onToolChange('select'); break;
                    case 'r': onToolChange('rectangle'); break;
                    case 'o': onToolChange('ellipse'); break;
                    case 't': onToolChange('text'); break;
                }
            }

            // Sidebar shortcuts (Mod+1-4)
            if (isMod && !e.shiftKey) {
                switch (e.key) {
                    case '1': e.preventDefault(); onToggleSidebar('chat'); break;
                    case '2': e.preventDefault(); onToggleSidebar('components'); break;
                    case '3': e.preventDefault(); onToggleSidebar('files'); break;
                    case '4': e.preventDefault(); onToggleSidebar('layers'); break;
                }
            }

            // File operations
            if (isMod) {
                if (e.key === 's') { e.preventDefault(); onSave(); }
                if (e.key === 'o') { e.preventDefault(); onOpen(); }
                if (e.key === 'z' && !e.shiftKey && onUndo) { e.preventDefault(); onUndo(); }
                if (e.key === 'z' && e.shiftKey && onRedo) { e.preventDefault(); onRedo(); }
                if (e.key === 'k' && onCommandPalette) { e.preventDefault(); onCommandPalette(); }
            }

            // Zoom
            if (isMod) {
                if (e.key === '=' || e.key === '+') { e.preventDefault(); onZoomIn?.(); }
                if (e.key === '-') { e.preventDefault(); onZoomOut?.(); }
                if (e.key === '0') { e.preventDefault(); onZoomReset?.(); }
            }

            // Terminal toggle
            if (e.key === '`' && isMod) {
                e.preventDefault();
                onToggleTerminal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onToolChange, onToggleSidebar, onSave, onOpen, onUndo, onRedo, onZoomIn, onZoomOut, onZoomReset, onToggleTerminal, onCommandPalette]);

    // Close recent files dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (recentFilesRef.current && !recentFilesRef.current.contains(e.target as Node)) {
                setShowRecentFiles(false);
            }
        };

        if (showRecentFiles) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showRecentFiles]);

    const toggleTheme = () => {
        const nextIsDark = !isDarkTheme;
        setIsDarkTheme(nextIsDark);
        setMode(nextIsDark ? 'dark' : 'light');
    };

    return (
        <nav className="studio-toolbar" role="toolbar" aria-label="Main toolbar">
            {/* File Operations */}
            <div className="toolbar-group" role="group" aria-label="File operations">
                <div className="recent-files-wrapper" ref={recentFilesRef}>
                    <IconButton
                        icon={<FolderOpen size={18} />}
                        label="Open"
                        shortcut="Mod+O"
                        onClick={onOpen}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setShowRecentFiles(true);
                        }}
                    />
                    {showRecentFiles && recentFiles.length > 0 && (
                        <div className="recent-files-dropdown">
                            <div className="dropdown-header">
                                <Clock size={12} />
                                <span>Recent Files</span>
                            </div>
                            {recentFiles.slice(0, 5).map((file, idx) => (
                                <button
                                    key={idx}
                                    className="recent-file-item"
                                    onClick={() => {
                                        onOpenRecent?.(file);
                                        setShowRecentFiles(false);
                                    }}
                                >
                                    {file.split('/').pop()}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <IconButton
                    icon={<Save size={18} />}
                    label={hasUnsavedChanges ? 'Save (unsaved changes)' : 'Save'}
                    shortcut="Mod+S"
                    onClick={onSave}
                    className={hasUnsavedChanges ? 'unsaved' : ''}
                />

                <IconButton
                    icon={<Download size={18} />}
                    label="Export"
                    shortcut="Mod+E"
                />

                <IconButton
                    icon={<Share2 size={18} />}
                    label="Share"
                />
            </div>

            <div className="toolbar-divider" role="separator" />

            {/* Undo/Redo */}
            {(onUndo || onRedo) && (
                <>
                    <div className="toolbar-group" role="group" aria-label="History">
                        <IconButton
                            icon={<Undo2 size={18} />}
                            label="Undo"
                            shortcut="Mod+Z"
                            onClick={onUndo}
                            disabled={!canUndo}
                        />
                        <IconButton
                            icon={<Redo2 size={18} />}
                            label="Redo"
                            shortcut="Mod+Shift+Z"
                            onClick={onRedo}
                            disabled={!canRedo}
                        />
                    </div>
                    <div className="toolbar-divider" role="separator" />
                </>
            )}

            {/* Sidebar Toggles */}
            <div className="toolbar-group" role="group" aria-label="Sidebar panels">
                {SIDEBAR_ITEMS.map(item => (
                    <IconButton
                        key={item.id}
                        icon={<item.icon size={18} />}
                        label={item.label}
                        shortcut={item.shortcut}
                        onClick={() => onToggleSidebar(item.id)}
                        className={activeSidebar === item.id ? 'active' : ''}
                        aria-pressed={activeSidebar === item.id}
                    />
                ))}
            </div>

            <div className="toolbar-divider" role="separator" />

            {/* Layout Mode Switcher */}
            <div className="toolbar-group layout-modes" role="group" aria-label="Layout modes">
                {LAYOUT_MODES.map(mode => (
                    <IconButton
                        key={mode.id}
                        icon={<mode.icon size={18} />}
                        label={mode.label}
                        onClick={() => onLayoutModeChange(mode.id)}
                        className={layoutMode === mode.id ? 'active' : ''}
                        aria-pressed={layoutMode === mode.id}
                    />
                ))}
                <IconButton
                    icon={<Terminal size={18} />}
                    label="Terminal"
                    shortcut="Mod+`"
                    onClick={onToggleTerminal}
                    className={isTerminalOpen ? 'active' : ''}
                    aria-pressed={isTerminalOpen}
                />
            </div>

            <div className="toolbar-divider" role="separator" />

            {/* Drawing Tools */}
            <div className="toolbar-group drawing-tools" role="group" aria-label="Drawing tools">
                {TOOLS.map(tool => (
                    <IconButton
                        key={tool.id}
                        icon={<tool.icon size={18} />}
                        label={tool.label}
                        shortcut={tool.shortcut}
                        onClick={() => onToolChange(tool.id)}
                        className={activeTool === tool.id ? 'active' : ''}
                        aria-pressed={activeTool === tool.id}
                    />
                ))}
            </div>

            <div className="toolbar-divider" role="separator" />

            {/* Zoom Controls */}
            {(onZoomIn || onZoomOut) && (
                <>
                    <div className="toolbar-group zoom-controls" role="group" aria-label="Zoom">
                        <IconButton
                            icon={<ZoomOut size={16} />}
                            label="Zoom out"
                            shortcut="Mod+-"
                            onClick={onZoomOut}
                        />
                        <button
                            className="zoom-level"
                            onClick={onZoomReset}
                            title="Reset zoom (Cmd+0)"
                        >
                            {zoom}%
                        </button>
                        <IconButton
                            icon={<ZoomIn size={16} />}
                            label="Zoom in"
                            shortcut="Mod+="
                            onClick={onZoomIn}
                        />
                    </div>
                    <div className="toolbar-divider" role="separator" />
                </>
            )}

            {/* File Title & Path */}
            <div className="toolbar-title">
                {workspacePath && (
                    <span className="workspace-path" title={workspacePath}>
                        {workspacePath.split('/').slice(-2).join('/')}
                        <span className="path-separator">/</span>
                    </span>
                )}
                <span className={`file-name ${hasUnsavedChanges ? 'unsaved' : ''}`}>
                    {fileName}
                </span>
                {hasUnsavedChanges && (
                    <span className="unsaved-indicator" title="Unsaved changes" aria-label="Unsaved changes">
                        ●
                    </span>
                )}
            </div>

            {/* Spacer */}
            <div className="toolbar-spacer" />

            {/* Right-side actions */}
            <div className="toolbar-group toolbar-right" role="group" aria-label="Quick actions">
                {/* Command Palette */}
                {onCommandPalette && (
                    <button
                        className="command-palette-btn"
                        onClick={onCommandPalette}
                        title="Command Palette"
                    >
                        <Search size={14} />
                        <span>Search...</span>
                        <Kbd keys="Mod+K" className="command-kbd" />
                    </button>
                )}

                {/* Theme Toggle */}
                <IconButton
                    icon={isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
                    label={isDarkTheme ? 'Light mode' : 'Dark mode'}
                    onClick={toggleTheme}
                />

                {/* Settings */}
                <IconButton
                    icon={<Settings size={16} />}
                    label="Settings"
                    shortcut="Mod+,"
                />
            </div>
        </nav>
    );
}
