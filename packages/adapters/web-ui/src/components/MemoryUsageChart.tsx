import React from 'react';
import './MemoryUsageChart.css';

interface MemoryPoint {
    time: string;
    used: number; // GB
    total: number; // GB
}

interface MemoryUsageChartProps {
    data: MemoryPoint[];
    height?: number;
}

export function MemoryUsageChart({ data, height = 150 }: MemoryUsageChartProps) {
    if (!data.length) return null;

    // Normalize logic
    const totalMem = data[0].total;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.used / totalMem) * 100;
        return `${x},${y}`;
    }).join(' ');

    const fillPath = `0,100 ${points} 100,100`;

    return (
        <div className="memory-usage-chart" style={{ height }}>
            <div className="chart-header">
                <span>Memory Usage</span>
                <span className="current-val">
                    {data[data.length - 1].used.toFixed(1)} / {totalMem} GB
                </span>
            </div>

            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="memGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <polygon points={fillPath} fill="url(#memGradient)" />

                {/* Line Stroke */}
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Grid Lines */}
            <div className="chart-grid">
                <div className="grid-line" style={{ bottom: '25%' }} />
                <div className="grid-line" style={{ bottom: '50%' }} />
                <div className="grid-line" style={{ bottom: '75%' }} />
            </div>
        </div>
    );
}
