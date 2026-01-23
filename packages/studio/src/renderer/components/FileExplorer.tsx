/**
 * File Explorer Component
 * 
 * Top-level sidebar component for browsing the project file tree.
 */

import { useState, useEffect, useMemo } from 'react';
import { Folder, FolderOpen, RefreshCw, Search, X, Eye, BookOpen, FileText, AlertTriangle, MessageSquare } from 'lucide-react';
import { FileTree, FileNode } from '@/renderer/components/FileTree';
import './FileExplorer.css';

interface FileExplorerProps {
    onFileSelect?: (path: string) => void;
    workspacePath?: string | null;
    onToggleSidebar?: (view: 'chat' | 'files') => void;
    activeSidebar?: 'chat' | 'files' | 'components' | 'layers';
}



export function FileExplorer({ onFileSelect, workspacePath, onToggleSidebar, activeSidebar = 'files' }: FileExplorerProps) {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [rootItems, setRootItems] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [modifiedPaths, setModifiedPaths] = useState<Set<string>>(new Set());

    const loadWorkspace = async (folderPath?: string) => {
        if (!window.fileSystem) {
            setError('File system not available');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        // Use provided path or get default workspace
        let targetPath = folderPath;
        if (!targetPath) {
            const wsResult = await window.fileSystem.getWorkspace();
            if (!wsResult.success || !wsResult.path) {
                setError(wsResult.error || 'Failed to get workspace');
                setIsLoading(false);
                return;
            }
            targetPath = wsResult.path;
        }

        setRootPath(targetPath);

        const dirResult = await window.fileSystem.readDir(targetPath);
        if (!dirResult.success || !dirResult.entries) {
            setError(dirResult.error || 'Failed to read directory');
            setIsLoading(false);
            return;
        }

        const nodes = dirResult.entries.map(entry => ({
            name: entry.name,
            path: `${targetPath}/${entry.name}`,
            isDirectory: entry.isDirectory
        }));
        setRootItems(nodes);
        setIsLoading(false);
    };

    const selectFolder = async () => {
        if (!window.fileSystem) return;

        const result = await window.fileSystem.selectFolder();
        if (result.success && result.path) {
            await loadWorkspace(result.path);
        }
    };

    // Load workspace on mount or when workspacePath prop changes
    useEffect(() => {
        loadWorkspace(workspacePath || undefined);
    }, [workspacePath]);

    // Listen for AI file modifications
    useEffect(() => {
        if (!window.claudeCode) return;
        const unsub = window.claudeCode.onFileModified(({ path }: { path: string }) => {
            setModifiedPaths(prev => {
                const next = new Set(prev);
                next.add(path);
                return next;
            });
        });
        return unsub;
    }, []);

    const handleFileClick = (node: FileNode) => {
        // Clear modified badge when user clicks file
        if (modifiedPaths.has(node.path)) {
            setModifiedPaths(prev => {
                const next = new Set(prev);
                next.delete(node.path);
                return next;
            });
        }

        if (!node.isDirectory && onFileSelect) {
            onFileSelect(node.path);
        }
    };

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return rootItems;
        // Simple top-level filter for now, but in search mode we'd want recursive
        return rootItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, rootItems]);

    const readToAgent = async (node: FileNode) => {
        if (!window.claudeCode || !window.coordinator) return;

        // Find active session
        const state = await window.coordinator.getState();
        const activeAgent = state.agents.find((a: any) => a.status !== 'stopped');
        if (!activeAgent) {
            alert('No active agent session. Start a specialist first.');
            return;
        }

        try {
            // Ideally we'd have a file:read IPC, assuming fileSystem has it or we use another bridge
            // For now, let's assume we can read it or just send a command to Claude to read it
            await window.claudeCode.send(activeAgent.id, `Please read and analyze this file: ${node.path}`);
            alert(`Sent ${node.name} to AI Analyst.`);
        } catch (err) {
            console.error('Failed to send file to agent', err);
        }
    };

    return (
        <div className="file-explorer glass-panel">
            <div className="explorer-header">
                <div className="header-top">
                    <div className="header-title">
                        <Folder size={14} className="text-accent-primary" />
                        <h2>Project Index</h2>
                    </div>
                    <div className="header-actions">
                        <button
                            className="open-folder-btn"
                            onClick={selectFolder}
                            disabled={isLoading}
                            title="Open Folder"
                        >
                            <FolderOpen size={12} />
                        </button>
                        <button
                            className="refresh-btn"
                            onClick={() => loadWorkspace()}
                            disabled={isLoading}
                        >
                            <RefreshCw size={12} className={isLoading ? 'spinning' : ''} />
                        </button>
                    </div>
                </div>

                {/* View Toggle Tabs */}
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${activeSidebar === 'chat' ? 'active' : ''}`}
                        onClick={() => onToggleSidebar?.('chat')}
                    >
                        <MessageSquare size={14} />
                        <span>Chat</span>
                    </button>
                    <button
                        className={`toggle-btn ${activeSidebar === 'files' ? 'active' : ''}`}
                        onClick={() => onToggleSidebar?.('files')}
                    >
                        <FolderOpen size={14} />
                        <span>Files</span>
                    </button>
                </div>

                <div className="search-bar">
                    <Search size={12} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            <div className="explorer-content custom-scrollbar">
                {isLoading && (
                    <div className="explorer-loading">
                        <RefreshCw size={24} className="spinning" />
                        <span>INDEXING WORKSPACE...</span>
                    </div>
                )}

                {error && (
                    <div className="explorer-error">
                        <AlertTriangle size={24} />
                        <span>{error}</span>
                    </div>
                )}

                {!isLoading && !error && rootPath && (
                    <div className="tree-container">
                        <div className="workspace-path">
                            <BookOpen size={10} />
                            <span>{rootPath.split('/').pop()}</span>
                        </div>
                        <FileTree
                            items={filteredItems}
                            onFileClick={handleFileClick}
                            onAgentAction={readToAgent}
                            modifiedPaths={modifiedPaths}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
