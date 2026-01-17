import React, { useState } from 'react';
import './MindMap.css';

interface MindMapNode {
    id: string;
    label: string;
    children?: MindMapNode[];
}

interface MindMapProps {
    data: MindMapNode;
}

export function MindMap({ data }: MindMapProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([data.id]));

    const toggle = (id: string, hasChildren: boolean) => {
        if (!hasChildren) return;
        const next = new Set(expandedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedIds(next);
    };

    const renderNode = (node: MindMapNode, depth: number = 0) => {
        const isExpanded = expandedIds.has(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className="mm-branch">
                <div
                    className={`mm-node depth-${depth} ${hasChildren ? 'has-children' : ''} ${isExpanded ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggle(node.id, !!hasChildren); }}
                >
                    {node.label}
                    {hasChildren && <span className="mm-toggle">{isExpanded ? '-' : '+'}</span>}
                </div>

                {hasChildren && isExpanded && (
                    <div className="mm-children">
                        {node.children!.map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mindmap-container">
            {renderNode(data)}
        </div>
    );
}
