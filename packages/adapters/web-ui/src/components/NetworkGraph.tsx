import React, { useState } from 'react';
import './NetworkGraph.css';

interface Node {
    id: string;
    label?: string;
    x: number;
    y: number;
    type?: 'primary' | 'secondary' | 'hub';
}

interface Link {
    source: string;
    target: string;
}

interface NetworkGraphProps {
    nodes: Node[];
    links: Link[];
    width?: number;
    height?: number;
}

export function NetworkGraph({ nodes, links, width = 600, height = 400 }: NetworkGraphProps) {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    return (
        <div className="network-graph-container" style={{ width, height }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* Links */}
                {links.map((link, i) => {
                    const src = nodes.find(n => n.id === link.source);
                    const tgt = nodes.find(n => n.id === link.target);
                    if (!src || !tgt) return null;

                    const isActive = selectedNode && (selectedNode === link.source || selectedNode === link.target);

                    return (
                        <line
                            key={`link-${i}`}
                            x1={src.x}
                            y1={src.y}
                            x2={tgt.x}
                            y2={tgt.y}
                            className={`network-link ${isActive ? 'active' : ''}`}
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                    const radius = node.type === 'hub' ? 12 : 8;
                    const isSelected = selectedNode === node.id;

                    return (
                        <g
                            key={node.id}
                            transform={`translate(${node.x}, ${node.y})`}
                            onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <circle
                                r={radius + (isSelected ? 4 : 0)}
                                className={`network-node ${node.type || 'default'} ${isSelected ? 'selected' : ''}`}
                            />
                            <circle
                                r={radius + 6}
                                className={`network-node-glow ${isSelected ? 'visible' : ''}`}
                            />
                            {node.label && (
                                <text
                                    y={radius + 15}
                                    className="network-label"
                                    textAnchor="middle"
                                >
                                    {node.label}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
