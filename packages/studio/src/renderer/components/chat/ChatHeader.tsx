/**
 * Chat Header Component
 *
 * Session info, workspace selector, and chat controls.
 */

import { useState, useRef, useEffect } from 'react';
import {
    Sparkles, Plus, X, Shield, FolderOpen, MessageSquare,
    Download, Search, Settings, ChevronDown, Edit2, Check
} from 'lucide-react';
import { IconButton, Kbd, Modal } from '../ui';

export interface ChatHeaderProps {
    title: string;
    turnCount: { current: number; max: number };
    workspacePath?: string | null;
    onWorkspaceChange?: (path: string) => void;
    onNewSession: () => void;
    onClearAll?: () => void;
    onExport?: () => void;
    onSearch?: () => void;
    onToggleSidebar?: (view: 'chat' | 'files') => void;
    activeSidebar?: 'chat' | 'files' | 'components' | 'layers';
    hasAgents?: boolean;
    isLoading?: boolean;
    isBridgeReady?: boolean;
    sessionName?: string;
    onRenameSession?: (name: string) => void;
}

export function ChatHeader({
    title,
    turnCount,
    workspacePath,
    onWorkspaceChange,
    onNewSession,
    onClearAll,
    onExport,
    onSearch,
    onToggleSidebar,
    activeSidebar = 'chat',
    hasAgents = false,
    isLoading = false,
    isBridgeReady = false,
    sessionName,
    onRenameSession
}: ChatHeaderProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(sessionName || '');
    const renameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isRenaming && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [isRenaming]);

    const handleRenameSubmit = () => {
        if (renameValue.trim() && onRenameSession) {
            onRenameSession(renameValue.trim());
        }
        setIsRenaming(false);
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleRenameSubmit();
        } else if (e.key === 'Escape') {
            setRenameValue(sessionName || '');
            setIsRenaming(false);
        }
    };

    const handleWorkspaceClick = async () => {
        if (!window.fileSystem) return;
        const folderResult = await window.fileSystem.selectFolder();
        if (folderResult.success && folderResult.path) {
            onWorkspaceChange?.(folderResult.path);
        }
    };

    const progressPercent = (turnCount.current / turnCount.max) * 100;

    return (
        <header className="chat-header">
            <div className="header-title">
                <Sparkles size={16} className="text-accent-primary" aria-hidden="true" />
                <div className="title-wrapper">
                    {/* Session name with inline edit */}
                    {isRenaming ? (
                        <div className="session-rename">
                            <input
                                ref={renameInputRef}
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={handleRenameKeyDown}
                                onBlur={handleRenameSubmit}
                                className="rename-input"
                                maxLength={50}
                            />
                            <button
                                className="rename-confirm"
                                onClick={handleRenameSubmit}
                                aria-label="Confirm rename"
                            >
                                <Check size={12} />
                            </button>
                        </div>
                    ) : (
                        <h2
                            className="session-title"
                            onClick={() => onRenameSession && setIsRenaming(true)}
                            title={onRenameSession ? "Click to rename" : undefined}
                        >
                            {title}
                            {onRenameSession && <Edit2 size={10} className="rename-icon" />}
                        </h2>
                    )}

                    {/* Turn progress */}
                    <div className="session-progress">
                        <div className="progress-labels">
                            <span>Turn {turnCount.current}/{turnCount.max}</span>
                        </div>
                        <div
                            className="progress-track"
                            role="progressbar"
                            aria-valuenow={turnCount.current}
                            aria-valuemin={0}
                            aria-valuemax={turnCount.max}
                        >
                            <div
                                className={`progress-fill ${progressPercent > 75 ? 'warning' : ''}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Workspace badge */}
                    {workspacePath && (
                        <button
                            className="workspace-context"
                            title={`${workspacePath} (Click to change)`}
                            onClick={handleWorkspaceClick}
                        >
                            <FolderOpen size={12} />
                            <span>{workspacePath.split('/').pop()}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="chat-header-actions">
                {/* Search */}
                {onSearch && (
                    <IconButton
                        icon={<Search size={14} />}
                        label="Search messages"
                        shortcut="Mod+F"
                        onClick={onSearch}
                    />
                )}

                {/* Export */}
                {onExport && (
                    <IconButton
                        icon={<Download size={14} />}
                        label="Export chat"
                        onClick={onExport}
                    />
                )}

                {/* Diagnostics */}
                <IconButton
                    icon={<Shield size={14} />}
                    label="Connection diagnostics"
                    onClick={() => {
                        alert("Select 'Diagnostics' tab in the bottom panel to run connection tests.");
                    }}
                />

                {/* Clear all */}
                {hasAgents && onClearAll && (
                    <IconButton
                        icon={<X size={14} />}
                        label="Clear all agents"
                        onClick={onClearAll}
                        className="danger"
                    />
                )}

                {/* New session */}
                <button
                    className="chat-new-btn"
                    onClick={onNewSession}
                    disabled={isLoading || !isBridgeReady}
                >
                    <Plus size={14} />
                    <span>New Specialist</span>
                    <Kbd keys="Mod+K" className="btn-kbd" />
                </button>
            </div>

            {/* View Toggle Tabs */}
            <nav className="view-toggle" role="tablist" aria-label="Sidebar views">
                <button
                    className={`toggle-btn ${activeSidebar === 'chat' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar?.('chat')}
                    role="tab"
                    aria-selected={activeSidebar === 'chat'}
                >
                    <MessageSquare size={14} />
                    <span>Chat</span>
                </button>
                <button
                    className={`toggle-btn ${activeSidebar === 'files' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar?.('files')}
                    role="tab"
                    aria-selected={activeSidebar === 'files'}
                >
                    <FolderOpen size={14} />
                    <span>Files</span>
                </button>
            </nav>
        </header>
    );
}
