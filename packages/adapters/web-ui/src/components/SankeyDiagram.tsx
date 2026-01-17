import React from 'react';
import './SankeyDiagram.css';

interface SankeyNode {
    id: string;
    label: string;
    color?: string;
}

interface SankeyLink {
    source: string;
    target: string;
    value: number;
    color?: string;
}

interface SankeyDiagramProps {
    nodes: SankeyNode[];
    links: SankeyLink[];
    width?: number;
    height?: number;
}

// A simple manual Sankey implementation for demo purposes
// In a real app, use d3-sankey for layout math
export function SankeyDiagram({ nodes, links, width = 600, height = 300 }: SankeyDiagramProps) {
    // Mock layout logic for demonstration
    // Assuming 3 columns: inputs, processing, outputs
    const columns = [
        nodes.slice(0, 2), // Col 1
        nodes.slice(2, 4), // Col 2
        nodes.slice(4, 6)  // Col 3
    ];

    const colWidth = width / 3;
    const nodeWidth = 20;

    // Calculate node positions
    const nodePositions = new Map<string, { x: number, y: number, height: number }>();

    columns.forEach((col, colIdx) => {
        let yOffset = 50;
        const x = colIdx * colWidth + 50;

        col.forEach(node => {
            const h = 60; // Fixed for demo
            nodePositions.set(node.id, { x, y: yOffset, height: h });
            yOffset += h + 40;
        });
    });

    return (
        <div className="sankey-container">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Links */}
                {links.map((link, i) => {
                    const src = nodePositions.get(link.source);
                    const tgt = nodePositions.get(link.target);

                    if (!src || !tgt) return null;

                    // Curvature
                    const path = `
                        M ${src.x + nodeWidth} ${src.y + src.height / 2}
                        C ${src.x + nodeWidth + 50} ${src.y + src.height / 2},
                          ${tgt.x - 50} ${tgt.y + tgt.height / 2},
                          ${tgt.x} ${tgt.y + tgt.height / 2}
                    `;

                    return (
                        <path
                            key={`link-${i}`}
                            d={path}
                            stroke={link.color || 'var(--accent-primary)'}
                            strokeWidth={Math.max(2, link.value / 10)}
                            strokeOpacity={0.3}
                            fill="none"
                            className="sankey-link"
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => {
                    const pos = nodePositions.get(node.id);
                    if (!pos) return null;

                    return (
                        <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                            <rect
                                width={nodeWidth}
                                height={pos.height}
                                fill={node.color || 'var(--bg-elevated)'}
                                stroke="var(--border-color)"
                                rx={4}
                                className="sankey-node"
                            />
                            <text
                                x={nodeWidth / 2}
                                y={-10}
                                textAnchor="middle"
                                className="sankey-label"
                            >
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
