import React from 'react';
import './RadarChart.css';

interface RadarDataPoint {
    label: string;
    value: number; // 0 to 100
}

interface RadarChartProps {
    data: RadarDataPoint[];
    size?: number;
    color?: string;
    showLabels?: boolean;
}

export function RadarChart({ data, size = 300, color = '#00e5ff', showLabels = true }: RadarChartProps) {
    const radius = size / 2 - 40; // Padding for labels
    const center = size / 2;
    const angleSlice = (Math.PI * 2) / data.length;

    // Helper to get coordinates
    const getCoords = (value: number, index: number) => {
        const angle = index * angleSlice - Math.PI / 2; // Start from top
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    // Generate path for the data polygon
    const pathData = data.map((d, i) => {
        const { x, y } = getCoords(d.value, i);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';

    // Generate grid levels (concentric polygons)
    const levels = [25, 50, 75, 100];

    return (
        <div className="radar-chart-container" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Grid */}
                {levels.map((level, lvlIdx) => (
                    <path
                        key={`level-${lvlIdx}`}
                        d={data.map((_, i) => {
                            const { x, y } = getCoords(level, i);
                            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ') + ' Z'}
                        fill="none"
                        stroke="var(--border-color)"
                        strokeDasharray={level === 100 ? "none" : "4 4"}
                        strokeOpacity={0.5}
                    />
                ))}

                {/* Axis Lines */}
                {data.map((_, i) => {
                    const { x, y } = getCoords(100, i);
                    return (
                        <line
                            key={`axis-${i}`}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="var(--border-color)"
                            strokeOpacity={0.3}
                        />
                    );
                })}

                {/* Data Polygon */}
                <path
                    d={pathData}
                    fill={color}
                    fillOpacity={0.2}
                    stroke={color}
                    strokeWidth={2}
                    className="radar-polygon"
                />

                {/* Data Points */}
                {data.map((d, i) => {
                    const { x, y } = getCoords(d.value, i);
                    return (
                        <circle
                            key={`point-${i}`}
                            cx={x}
                            cy={y}
                            r={4}
                            fill="var(--bg-primary)"
                            stroke={color}
                            strokeWidth={2}
                            className="radar-point"
                        />
                    );
                })}

                {/* Labels */}
                {showLabels && data.map((d, i) => {
                    const { x, y } = getCoords(115, i); // Push out further
                    return (
                        <text
                            key={`label-${i}`}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="var(--text-secondary)"
                            fontSize={12}
                            fontFamily="var(--font-mono)"
                            className="radar-label"
                        >
                            {d.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
