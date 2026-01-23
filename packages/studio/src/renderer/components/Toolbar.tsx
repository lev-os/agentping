/**
 * Toolbar Component
 */

import { MousePointer2, Square, Circle, Type, Save, FolderOpen, Download, Package, MessageSquare, FolderTree, LayoutDashboard, Palette, Layers, Terminal, Eye } from 'lucide-react';
import './Toolbar.css';

interface ToolbarProps {
    activeTool: 'select' | 'rectangle' | 'ellipse' | 'text';
    onToolChange: (tool: 'select' | 'rectangle' | 'ellipse' | 'text') => void;
    onSave: () => void;
    onOpen: () => void;
    onToggleSidebar: (mode: 'chat' | 'components' | 'files' | 'layers') => void;
    activeSidebar: 'chat' | 'components' | 'files' | 'layers' | null;
    layoutMode: 'design' | 'dashboard' | 'code' | 'preview';
    onLayoutModeChange: (mode: 'design' | 'dashboard' | 'code' | 'preview') => void;
    onToggleTerminal: () => void;
    isTerminalOpen: boolean;
    fileName?: string;
    hasUnsavedChanges?: boolean;
}

export function Toolbar({
    activeTool, onToolChange, onSave, onOpen, onToggleSidebar,
    activeSidebar, layoutMode, onLayoutModeChange, onToggleTerminal, isTerminalOpen,
    fileName = 'Untitled.apen', hasUnsavedChanges = false
}: ToolbarProps) {
    const tools = [
        { id: 'select' as const, icon: MousePointer2, label: 'Select (V)' },
        { id: 'rectangle' as const, icon: Square, label: 'Rectangle (R)' },
        { id: 'ellipse' as const, icon: Circle, label: 'Ellipse (O)' },
        { id: 'text' as const, icon: Type, label: 'Text (T)' },
    ];

    return (
        <div className="studio-toolbar">
            {/* File Operations */}
            <div className="toolbar-group">
                <button className="toolbar-btn" onClick={onOpen} title="Open (Cmd+O)">
                    <FolderOpen size={20} strokeWidth={2} />
                </button>
                <button className="toolbar-btn" onClick={onSave} title="Save (Cmd+S)">
                    <Save size={20} strokeWidth={2} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Sidebar Toggles */}
            <div className="toolbar-group">
                <button
                    className={`toolbar-btn ${activeSidebar === 'chat' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar('chat')}
                    title="AI Chat"
                >
                    <MessageSquare size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${activeSidebar === 'components' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar('components')}
                    title="Component Gallery"
                >
                    <Package size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${activeSidebar === 'files' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar('files')}
                    title="File Explorer"
                >
                    <FolderTree size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${activeSidebar === 'layers' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar('layers')}
                    title="Layers"
                >
                    <Layers size={20} strokeWidth={2} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Layout Mode Switcher */}
            <div className="toolbar-group">
                <button
                    className={`toolbar-btn ${layoutMode === 'design' ? 'active' : ''}`}
                    onClick={() => onLayoutModeChange('design')}
                    title="Design Mode"
                >
                    <Palette size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${layoutMode === 'code' ? 'active' : ''}`}
                    onClick={() => onLayoutModeChange('code')}
                    title="Code Viewer"
                >
                    <FolderTree size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${layoutMode === 'preview' ? 'active' : ''}`}
                    onClick={() => onLayoutModeChange('preview')}
                    title="Live Preview"
                >
                    <Eye size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${layoutMode === 'dashboard' ? 'active' : ''}`}
                    onClick={() => onLayoutModeChange('dashboard')}
                    title="Mission Control Dashboard"
                >
                    <LayoutDashboard size={20} strokeWidth={2} />
                </button>
                <button
                    className={`toolbar-btn ${isTerminalOpen ? 'active' : ''}`}
                    onClick={onToggleTerminal}
                    title="Toggle Terminal (Pro Logs)"
                >
                    <Terminal size={20} strokeWidth={2} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Drawing Tools */}
            <div className="toolbar-group">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        className={`toolbar-btn ${activeTool === tool.id ? 'active' : ''}`}
                        onClick={() => onToolChange(tool.id)}
                        title={tool.label}
                    >
                        <tool.icon size={20} strokeWidth={2} />
                    </button>
                ))}
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-title">
                <span className={hasUnsavedChanges ? 'unsaved' : ''}>{fileName}</span>
                {hasUnsavedChanges && <span className="unsaved-indicator" title="Unsaved changes">●</span>}
            </div>
        </div>
    );
}
