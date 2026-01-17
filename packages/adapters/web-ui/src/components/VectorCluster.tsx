import React from 'react';
import './VectorCluster.css';

interface VectorPoint {
    x: number;
    y: number;
    label?: string;
    group?: number;
}

interface VectorClusterProps {
    points: VectorPoint[];
    selectedId?: string;
    className?: string;
}

export function VectorCluster({
    points,
    selectedId,
    className = ''
}: VectorClusterProps) {
    // Determine bounds for scaling
    // Simplified: assuming points are mostly normalized or we just map to 0-100%

    return (
        <div className={`vector-cluster ${className}`}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Grid */}
                <path d="M10,0 L10,100 M20,0 L20,100 M30,0 L30,100 M40,0 L40,100 M50,0 L50,100 M60,0 L60,100 M70,0 L70,100 M80,0 L80,100 M90,0 L90,100" className="vector-grid" />
                <path d="M0,10 L100,10 M0,20 L100,20 M0,30 L100,30 M0,40 L100,40 M0,50 L100,50 M0,60 L100,60 M0,70 L100,70 M0,80 L100,80 M0,90 L100,90" className="vector-grid" />

                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={2}
                        className={`vector-point group-${p.group || 0}`}
                    >
                        {p.label && <title>{p.label}</title>}
                    </circle>
                ))}
            </svg>
            <div className="vector-legend">
                Vector Embedding Space (PCA Reduced)
            </div>
        </div>
    );
}
