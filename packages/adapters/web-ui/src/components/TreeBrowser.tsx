import { useState } from 'react';
import './TreeBrowser.css';

interface TreeNode {
    id: string;
    label: string;
    type: 'file' | 'folder';
    children?: TreeNode[];
}

interface TreeBrowserProps {
    nodes: TreeNode[];
    onNodeSelect?: (node: TreeNode) => void;
}

interface TreeNodeItemProps {
    node: TreeNode;
    depth?: number;
    onSelect?: (n: TreeNode) => void;
}

function TreeNodeItem({ node, depth = 0, onSelect }: TreeNodeItemProps) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(node);
        if (node.type === 'folder') {
            setExpanded(!expanded);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onSelect?.(node);
            if (node.type === 'folder') {
                setExpanded(!expanded);
            }
        }
    };

    return (
        <div role="treeitem" aria-expanded={node.type === 'folder' ? expanded : undefined}>
            <div
                className="tree-node"
                style={{ paddingLeft: `${depth * 20 + 8}px` }}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-label={node.label}
            >
                <span className={node.type === 'folder' ? 'folder-icon' : 'file-icon'} aria-hidden="true">
                    {node.type === 'folder' ? (expanded ? '📂' : '📁') : '📄'}
                </span>
                <span>{node.label}</span>
            </div>
            {expanded && node.children && (
                <div role="group">
                    {node.children.map(child => (
                        <TreeNodeItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export function TreeBrowser({ nodes, onNodeSelect }: TreeBrowserProps) {
    return (
        <div className="tree-browser" role="tree">
            {nodes.map(node => (
                <TreeNodeItem key={node.id} node={node} onSelect={onNodeSelect} />
            ))}
        </div>
    );
}
