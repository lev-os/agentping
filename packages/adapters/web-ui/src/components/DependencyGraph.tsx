import React, { useRef, useEffect, useState } from 'react';
import './DependencyGraph.css';

export interface DependencyNode {
    id: string;
    label: string;
    status: 'pending' | 'ready' | 'in_progress' | 'complete' | 'blocked';
    dependencies: string[]; // IDs of nodes this depends on
}

interface DependencyGraphProps {
    nodes: DependencyNode[];
    onNodeClick?: (nodeId: string) => void;
    className?: string;
}

export function DependencyGraph({ nodes, onNodeClick, className = '' }: DependencyGraphProps) {
    // Generate layout levels
    const levels: DependencyNode[][] = [];
    const placed = new Set<string>();

    // Create a working copy to avoid mutating props
    const remainingNodes = [...nodes];

    // Simple level-based layout
    let iteration = 0;
    while (remainingNodes.length > 0 && iteration < 100) {
        const currentLevel = remainingNodes.filter(node =>
            node.dependencies.every(dep => placed.has(dep))
        );

        if (currentLevel.length === 0) {
            // Cycle or complex dep detected, dump remaining
            levels.push(remainingNodes);
            break;
        }

        levels.push(currentLevel);
        currentLevel.forEach(n => placed.add(n.id));

        // Remove placed from remaining
        for (const node of currentLevel) {
            const idx = remainingNodes.indexOf(node);
            if (idx > -1) remainingNodes.splice(idx, 1);
        }
        iteration++;
    }

    const getStatusClass = (status: DependencyNode['status']) => {
        switch (status) {
            case 'complete': return 'dep-node-complete';
            case 'in_progress': return 'dep-node-active';
            case 'ready': return 'dep-node-ready';
            case 'blocked': return 'dep-node-blocked';
            default: return 'dep-node-pending';
        }
    };

    const getStatusIcon = (status: DependencyNode['status']) => {
        switch (status) {
            case 'complete': return '✓';
            case 'in_progress': return '●';
            case 'ready': return '○';
            case 'blocked': return '⊘';
            default: return '○';
        }
    };

    return (
        <div className={`dependency-graph ${className}`} role="tree" aria-label="Dependency graph">
            {levels.map((level, levelIdx) => (
                <div key={levelIdx} className="dep-level" role="group">
                    {level.map((node) => (
                        <div
                            key={node.id}
                            className={`dep-node ${getStatusClass(node.status)}`}
                            role="treeitem"
                            tabIndex={0}
                            aria-label={`${node.label}: ${node.status}`}
                            onClick={() => onNodeClick?.(node.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onNodeClick?.(node.id);
                                }
                            }}
                        >
                            <span className="dep-node-icon" aria-hidden="true">{getStatusIcon(node.status)}</span>
                            <span className="dep-node-label">{node.label}</span>
                        </div>
                    ))}
                    {levelIdx < levels.length - 1 && (
                        <div className="dep-connector-visual" style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: '-24px',
                            width: '1px',
                            height: '24px',
                            background: 'var(--border-color)',
                            transform: 'translateX(-50%)'
                        }} />
                    )}
                </div>
            ))}
        </div>
    );
}
