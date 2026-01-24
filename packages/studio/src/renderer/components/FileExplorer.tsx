/**
 * File Explorer Component
 *
 * Enhanced sidebar for browsing the project file tree with search,
 * keyboard navigation, context menu, and file operations.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Folder, FolderOpen, RefreshCw, Search, X, BookOpen, AlertTriangle, MessageSquare,
    Plus, FilePlus, FolderPlus, Trash2, Edit3, Copy, ChevronDown, ChevronRight,
    FileCode, FileText, FileJson, Image, Settings, Package, Star, Clock, Filter,
    SortAsc, SortDesc, ArrowUpDown, ExternalLink, MoreHorizontal
} from 'lucide-react';
import { FileTree, FileNode } from '@/renderer/components/FileTree';
import { IconButton, SearchInput, Badge, ContextMenu, ContextMenuItem } from './ui';
import './FileExplorer.css';

interface FileExplorerProps {
    onFileSelect?: (path: string) => void;
    workspacePath?: string | null;
    onToggleSidebar?: (view: 'chat' | 'files') => void;
    activeSidebar?: 'chat' | 'files' | 'components' | 'layers';
}

type SortOption = 'name' | 'type';
type SortDirection = 'asc' | 'desc';
type FileFilter = 'all' | 'code' | 'config' | 'assets' | 'docs';

const FILE_FILTERS: { id: FileFilter; label: string; extensions: string[] }[] = [
    { id: 'all', label: 'All Files', extensions: [] },
    { id: 'code', label: 'Code', extensions: ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs'] },
    { id: 'config', label: 'Config', extensions: ['.json', '.yaml', '.yml', '.toml', '.env'] },
    { id: 'assets', label: 'Assets', extensions: ['.css', '.scss', '.svg', '.png', '.jpg'] },
    { id: 'docs', label: 'Docs', extensions: ['.md', '.txt', '.rst'] },
];

export function FileExplorer({ onFileSelect, workspacePath, onToggleSidebar, activeSidebar = 'files' }: FileExplorerProps) {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [rootItems, setRootItems] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modifiedPaths, setModifiedPaths] = useState<Set<string>>(new Set());

    // Enhanced features
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [sortDir, setSortDir] = useState<SortDirection>('asc');
    const [fileFilter, setFileFilter] = useState<FileFilter>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [pinnedFiles, setPinnedFiles] = useState<string[]>([]);
    const [recentFiles, setRecentFiles] = useState<string[]>([]);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileNode } | null>(null);

    const explorerRef = useRef<HTMLDivElement>(null);

    const loadWorkspace = async (folderPath?: string) => {
        if (!window.fileSystem) {
            setError('File system not available');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

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
            isDirectory: entry.isDirectory,
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

    useEffect(() => {
        loadWorkspace(workspacePath || undefined);
    }, [workspacePath]);

    // Listen for AI file modifications
    useEffect(() => {
        if (!window.claudeCode) return;
        const unsub = window.claudeCode.onFileModified(({ path }: { path: string }) => {
            setModifiedPaths(prev => new Set([...prev, path]));
        });
        return unsub;
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT') return;
            if (!explorerRef.current?.contains(document.activeElement)) return;

            const isMod = e.metaKey || e.ctrlKey;

            // Focus search: Mod+F
            if (e.key === 'f' && isMod) {
                e.preventDefault();
                const input = explorerRef.current?.querySelector('input');
                input?.focus();
            }

            // Collapse all: Mod+Shift+C
            if (e.key === 'c' && isMod && e.shiftKey) {
                e.preventDefault();
                setExpandedPaths(new Set());
            }

            // Expand all: Mod+Shift+E
            if (e.key === 'e' && isMod && e.shiftKey) {
                e.preventDefault();
                const allDirPaths = rootItems.filter(n => n.isDirectory).map(n => n.path);
                setExpandedPaths(new Set(allDirPaths));
            }

            // Refresh: Mod+R
            if (e.key === 'r' && isMod) {
                e.preventDefault();
                loadWorkspace();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [rootItems]);

    // Click outside to close context menu
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);

    const handleFileClick = useCallback((node: FileNode) => {
        // Clear modified badge when user clicks file
        if (modifiedPaths.has(node.path)) {
            setModifiedPaths(prev => {
                const next = new Set(prev);
                next.delete(node.path);
                return next;
            });
        }

        setSelectedPath(node.path);

        if (!node.isDirectory && onFileSelect) {
            onFileSelect(node.path);
            // Add to recent files
            setRecentFiles(prev => {
                const filtered = prev.filter(p => p !== node.path);
                return [node.path, ...filtered].slice(0, 5);
            });
        }
    }, [modifiedPaths, onFileSelect]);

    const handleContextMenu = useCallback((e: React.MouseEvent, node: FileNode) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, node });
    }, []);

    // File filtering and sorting
    const processedItems = useMemo(() => {
        let items = [...rootItems];

        // Apply text search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item => item.name.toLowerCase().includes(query));
        }

        // Apply file type filter
        if (fileFilter !== 'all') {
            const filterDef = FILE_FILTERS.find(f => f.id === fileFilter);
            if (filterDef && filterDef.extensions.length > 0) {
                items = items.filter(item => {
                    if (item.isDirectory) return true;
                    return filterDef.extensions.some(ext => item.name.endsWith(ext));
                });
            }
        }

        // Apply sorting
        items.sort((a, b) => {
            // Directories first
            if (a.isDirectory !== b.isDirectory) {
                return a.isDirectory ? -1 : 1;
            }

            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'type':
                    const extA = a.name.includes('.') ? a.name.split('.').pop() || '' : '';
                    const extB = b.name.includes('.') ? b.name.split('.').pop() || '' : '';
                    comparison = extA.localeCompare(extB);
                    break;
            }

            return sortDir === 'asc' ? comparison : -comparison;
        });

        return items;
    }, [rootItems, searchQuery, fileFilter, sortBy, sortDir]);

    // Context menu actions
    const copyPath = (path: string) => {
        navigator.clipboard.writeText(path);
        setContextMenu(null);
    };

    const togglePin = (path: string) => {
        setPinnedFiles(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        );
        setContextMenu(null);
    };

    const openInSystem = (_path: string) => {
        // Note: This requires shell.showItemInFolder to be exposed via preload
        // For now, this is a placeholder for future implementation
        setContextMenu(null);
    };

    const readToAgent = async (node: FileNode) => {
        if (!window.claudeCode || !window.coordinator) return;

        const state = await window.coordinator.getState();
        const activeAgent = state.agents.find((a: any) => a.status !== 'stopped');
        if (!activeAgent) {
            alert('No active agent session. Start a specialist first.');
            return;
        }

        try {
            await window.claudeCode.send(activeAgent.id, `Please read and analyze this file: ${node.path}`);
            alert(`Sent ${node.name} to AI Analyst.`);
        } catch (err) {
            console.error('Failed to send file to agent', err);
        }
        setContextMenu(null);
    };

    const toggleSort = (option: SortOption) => {
        if (sortBy === option) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(option);
            setSortDir('asc');
        }
        setShowSortMenu(false);
    };

    return (
        <div className="file-explorer glass-panel" ref={explorerRef}>
            <div className="explorer-header">
                <div className="header-top">
                    <div className="header-title">
                        <Folder size={14} className="text-accent-primary" />
                        <h2>Project Files</h2>
                    </div>
                    <div className="header-actions">
                        <IconButton
                            icon={<FolderOpen size={12} />}
                            label="Open Folder"
                            onClick={selectFolder}
                            disabled={isLoading}
                        />
                        <IconButton
                            icon={<RefreshCw size={12} className={isLoading ? 'spinning' : ''} />}
                            label="Refresh (Mod+R)"
                            onClick={() => loadWorkspace()}
                            disabled={isLoading}
                        />
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

                {/* Search Bar */}
                <div className="search-bar">
                    <Search size={12} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search files... (Mod+F)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="clear-search" onClick={() => setSearchQuery('')}>
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Toolbar */}
                <div className="explorer-toolbar">
                    {/* Filter Dropdown */}
                    <div className="filter-wrapper">
                        <button
                            className={`toolbar-btn ${fileFilter !== 'all' ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={12} />
                            {fileFilter !== 'all' && <span>{fileFilter}</span>}
                        </button>
                        {showFilters && (
                            <div className="filter-menu">
                                {FILE_FILTERS.map(f => (
                                    <button
                                        key={f.id}
                                        className={`filter-item ${fileFilter === f.id ? 'active' : ''}`}
                                        onClick={() => {
                                            setFileFilter(f.id);
                                            setShowFilters(false);
                                        }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="sort-wrapper">
                        <button
                            className="toolbar-btn"
                            onClick={() => setShowSortMenu(!showSortMenu)}
                        >
                            <ArrowUpDown size={12} />
                            <span>{sortBy}</span>
                            {sortDir === 'asc' ? <SortAsc size={10} /> : <SortDesc size={10} />}
                        </button>
                        {showSortMenu && (
                            <div className="sort-menu">
                                {(['name', 'type'] as SortOption[]).map(opt => (
                                    <button
                                        key={opt}
                                        className={`sort-item ${sortBy === opt ? 'active' : ''}`}
                                        onClick={() => toggleSort(opt)}
                                    >
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        {sortBy === opt && (
                                            sortDir === 'asc' ? <SortAsc size={10} /> : <SortDesc size={10} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="toolbar-spacer" />

                    {/* Quick Actions */}
                    <span className="file-count">{processedItems.length} items</span>
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
                    <>
                        {/* Pinned Files */}
                        {pinnedFiles.length > 0 && (
                            <div className="pinned-section">
                                <div className="section-header">
                                    <Star size={10} />
                                    <span>Pinned</span>
                                </div>
                                <div className="pinned-list">
                                    {pinnedFiles.map(path => (
                                        <button
                                            key={path}
                                            className="pinned-item"
                                            onClick={() => onFileSelect?.(path)}
                                        >
                                            <FileText size={12} />
                                            <span>{path.split('/').pop()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Files */}
                        {recentFiles.length > 0 && !searchQuery && (
                            <div className="recent-section">
                                <div className="section-header">
                                    <Clock size={10} />
                                    <span>Recent</span>
                                </div>
                                <div className="recent-list">
                                    {recentFiles.map(path => (
                                        <button
                                            key={path}
                                            className="recent-item"
                                            onClick={() => onFileSelect?.(path)}
                                        >
                                            <FileText size={12} />
                                            <span>{path.split('/').pop()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Tree */}
                        <div className="tree-container">
                            <div className="workspace-path">
                                <BookOpen size={10} />
                                <span>{rootPath.split('/').pop()}</span>
                            </div>
                            <FileTree
                                items={processedItems}
                                onFileClick={handleFileClick}
                                onAgentAction={readToAgent}
                                modifiedPaths={modifiedPaths}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="explorer-context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={() => copyPath(contextMenu.node.path)}>
                        <Copy size={12} />
                        Copy Path
                    </button>
                    <button onClick={() => togglePin(contextMenu.node.path)}>
                        <Star size={12} />
                        {pinnedFiles.includes(contextMenu.node.path) ? 'Unpin' : 'Pin'}
                    </button>
                    <button onClick={() => openInSystem(contextMenu.node.path)}>
                        <ExternalLink size={12} />
                        Open in Finder
                    </button>
                    <div className="context-divider" />
                    <button onClick={() => readToAgent(contextMenu.node)}>
                        <MessageSquare size={12} />
                        Send to AI
                    </button>
                </div>
            )}
        </div>
    );
}
