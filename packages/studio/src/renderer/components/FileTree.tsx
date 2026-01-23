/**
 * File Tree Component
 * 
 * Recursive tree rendering with lazy-loading for directories.
 */

import { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, Folder, File, FileCode, FileJson, FileText, Image, Sparkles } from 'lucide-react';

export interface FileNode {
    name: string;
    path: string;
    isDirectory: boolean;
}

interface FileTreeProps {
    items: FileNode[];
    onFileClick: (node: FileNode) => void;
    onAgentAction?: (node: FileNode) => void;
    modifiedPaths?: Set<string>;
    depth?: number;
}

interface FileTreeItemProps {
    node: FileNode;
    onFileClick: (node: FileNode) => void;
    onAgentAction?: (node: FileNode) => void;
    modifiedPaths?: Set<string>;
    depth: number;
}

// Get icon based on file file type and extension
function getFileIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase() || '';

    if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
        return <div className="file-icon icon-react"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M12 21.9A15.4 15.4 0 0 1 12 2.1a15.4 15.4 0 0 1 0 19.8z" /><path d="M2.1 12a15.4 15.4 0 0 1 19.8 0 15.4 15.4 0 0 1-19.8 0z" /><path d="M5 5a15.4 15.4 0 0 1 14 14" /><path d="M19 5a15.4 15.4 0 0 1-14 14" /></svg></div>;
    }

    switch (ext) {
        case 'ts':
            return <div className="file-icon icon-ts"><span>TS</span></div>;
        case 'js':
            return <div className="file-icon icon-js"><span>JS</span></div>;
        case 'json':
            return <div className="file-icon icon-json"><FileJson size={14} /></div>;
        case 'md':
            return <div className="file-icon icon-md"><FileText size={14} /></div>;
        case 'css':
            return <div className="file-icon icon-css"><span>{"{ }"}</span></div>;
        default:
            return <div className="file-icon"><File size={14} /></div>;
    }
}

function FileTreeItem({ node, onFileClick, onAgentAction, modifiedPaths, depth }: FileTreeItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [children, setChildren] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const isModified = modifiedPaths?.has(node.path);
    // Simplified: directories show dot if any descendant is in modifiedPaths
    const hasModifiedChild = node.isDirectory && Array.from(modifiedPaths || []).some(path => path.startsWith(node.path));

    const handleToggle = useCallback(async () => {
        if (!node.isDirectory) {
            onFileClick(node);
            return;
        }

        if (isExpanded) {
            setIsExpanded(false);
            return;
        }

        // Lazy load children
        if (children.length === 0) {
            setIsLoading(true);
            const result = await window.fileSystem?.readDir(node.path);
            if (result?.success && result.entries) {
                const nodes = result.entries.map(entry => ({
                    name: entry.name,
                    path: `${node.path}/${entry.name}`,
                    isDirectory: entry.isDirectory
                }));
                setChildren(nodes);
            }
            setIsLoading(false);
        }

        setIsExpanded(true);
    }, [node, isExpanded, children.length, onFileClick]);

    const paddingLeft = 12 + depth * 12;

    return (
        <div className="tree-item-container">
            <div
                className={`tree-item ${node.isDirectory ? 'is-directory' : 'is-file'}`}
                style={{ paddingLeft }}
                onClick={handleToggle}
            >
                {node.isDirectory ? (
                    <>
                        <span className="tree-chevron">
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </span>
                        <Folder size={14} className="folder-icon" />
                    </>
                ) : (
                    <>
                        <span className="tree-chevron-placeholder" />
                        {getFileIcon(node.name)}
                    </>
                )}
                <span className="tree-item-name">{node.name}</span>
                {isLoading && <span className="tree-loading">...</span>}

                {(isModified || hasModifiedChild) && (
                    <span className={`modified-badge ${isModified ? 'is-direct' : 'is-indirect'}`}>
                        <Sparkles size={10} />
                    </span>
                )}

                {!node.isDirectory && onAgentAction && (
                    <button
                        className="tree-item-action"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAgentAction(node);
                        }}
                        title="Analyze with AI Agent"
                    >
                        <Sparkles size={12} />
                    </button>
                )}
            </div>

            {isExpanded && children.length > 0 && (
                <FileTree
                    items={children}
                    onFileClick={onFileClick}
                    onAgentAction={onAgentAction}
                    modifiedPaths={modifiedPaths}
                    depth={depth + 1}
                />
            )}
        </div>
    );
}

export function FileTree({ items, onFileClick, onAgentAction, modifiedPaths, depth = 0 }: FileTreeProps) {
    return (
        <div className="file-tree">
            {items.map((item) => (
                <FileTreeItem
                    key={item.path}
                    node={item}
                    onFileClick={onFileClick}
                    onAgentAction={onAgentAction}
                    modifiedPaths={modifiedPaths}
                    depth={depth}
                />
            ))}
        </div>
    );
}
