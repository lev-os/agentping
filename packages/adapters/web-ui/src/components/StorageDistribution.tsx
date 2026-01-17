import React from 'react';
import './StorageDistribution.css';

interface StorageItem {
    id: string;
    label: string;
    value: number; // GB
    color?: string;
}

interface StorageDistributionProps {
    items: StorageItem[];
    total?: number; // GB, calculated if not provided
    size?: number;
}

export function StorageDistribution({ items, total: propsTotal, size = 200 }: StorageDistributionProps) {
    const total = propsTotal || items.reduce((acc, item) => acc + item.value, 0);
    const radius = size * 0.35;
    const center = size / 2;
    let currentAngle = 0;

    // Sort valid items
    const validItems = items.filter(i => i.value > 0);

    return (
        <div className="storage-distribution">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {validItems.map((item, i) => {
                    const percentage = item.value / total;
                    const angle = percentage * 360;

                    // Calculate SVG arc path
                    const x1 = center + radius * Math.cos(Math.PI * currentAngle / 180);
                    const y1 = center + radius * Math.sin(Math.PI * currentAngle / 180);
                    const x2 = center + radius * Math.cos(Math.PI * (currentAngle + angle) / 180);
                    const y2 = center + radius * Math.sin(Math.PI * (currentAngle + angle) / 180);

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    // Donut hole path
                    const pathData = [
                        `M ${center} ${center}`,
                        `L ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        `Z`
                    ].join(' ');

                    const donutPath = percentage >= 1
                        ? `M ${center - radius} ${center} A ${radius} ${radius} 0 1 1 ${center + radius} ${center} A ${radius} ${radius} 0 1 1 ${center - radius} ${center}`
                        : pathData;

                    const slice = (
                        <path
                            key={item.id}
                            d={donutPath}
                            fill={item.color || `hsl(${i * (360 / items.length)}, 70%, 60%)`}
                            stroke="var(--bg-card)"
                            strokeWidth="2"
                            className="storage-slice"
                        />
                    );

                    currentAngle += angle;
                    return slice;
                })}

                {/* Center Hole Cover */}
                <circle cx={center} cy={center} r={radius * 0.6} fill="var(--bg-card)" />

                {/* Center Text */}
                <text x="50%" y="45%" textAnchor="middle" className="storage-total" fontSize={size * 0.12} fill="var(--text-primary)">
                    {total}GB
                </text>
                <text x="50%" y="60%" textAnchor="middle" className="storage-label" fontSize={size * 0.08} fill="var(--text-secondary)">
                    Total
                </text>
            </svg>

            {/* Legend */}
            <div className="storage-legend">
                {items.map((item, i) => (
                    <div key={item.id} className="legend-item">
                        <span
                            className="legend-dot"
                            style={{ background: item.color || `hsl(${i * (360 / items.length)}, 70%, 60%)` }}
                        />
                        <span className="legend-label">{item.label}</span>
                        <span className="legend-val">{Math.round((item.value / total) * 100)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
