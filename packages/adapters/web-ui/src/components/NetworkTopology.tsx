import React from 'react';
import './NetworkTopology.css';

export interface NetworkNode {
    id: string;
    label: string;
    type: 'server' | 'db' | 'client' | 'service';
    status: 'healthy' | 'warning' | 'error';
    x: number;
    y: number;
}

export interface NetworkLink {
    source: string;
    target: string;
    traffic?: number; // 0-100
}

interface NetworkTopologyProps {
    nodes: NetworkNode[];
    links: NetworkLink[];
    width?: number;
    height?: number;
}

export function NetworkTopology({ nodes, links, width = 600, height = 400 }: NetworkTopologyProps) {
    const getNodeColor = (type: string, status: string) => {
        if (status === 'error') return 'var(--accent-error)';
        if (status === 'warning') return 'var(--accent-warning)';
        switch (type) {
            case 'db': return '#ffaa00';
            case 'server': return 'var(--accent-primary)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="network-topology">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* Links */}
                {links.map((link, i) => {
                    const src = nodes.find(n => n.id === link.source);
                    const tgt = nodes.find(n => n.id === link.target);
                    if (!src || !tgt) return null;

                    return (
                        <g key={i}>
                            <line
                                x1={src.x} y1={src.y}
                                x2={tgt.x} y2={tgt.y}
                                stroke="var(--border-color)"
                                strokeWidth="2"
                                opacity="0.5"
                            />
                            {link.traffic && (
                                <circle r="3" fill="var(--accent-primary)">
                                    <animateMotion
                                        dur={`${3000 / link.traffic}s`}
                                        repeatCount="indefinite"
                                        path={`M${src.x},${src.y} L${tgt.x},${tgt.y}`}
                                    />
                                </circle>
                            )}
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map(node => (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                        <circle
                            r="20"
                            fill="var(--bg-secondary)"
                            stroke={getNodeColor(node.type, node.status)}
                            strokeWidth="2"
                        />
                        <text
                            y="5"
                            textAnchor="middle"
                            fontSize="10"
                            fill="var(--text-primary)"
                            style={{ pointerEvents: 'none' }}
                        >
                            {node.label}
                        </text>
                        {/* Pulse effect for healthy nodes */}
                        {node.status === 'healthy' && (
                            <circle r="20" fill="none" stroke={getNodeColor(node.type, node.status)} opacity="0.5">
                                <animate attributeName="r" values="20;30" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite" />
                            </circle>
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
}
