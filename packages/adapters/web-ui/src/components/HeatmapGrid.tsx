import React from 'react';
import './HeatmapGrid.css';

interface HeatmapGridProps {
    data: number[][]; // 2D array of intensity values (0-1)
    cellSize?: number;
    labels?: { x: string[], y: string[] };
}

export function HeatmapGrid({ data, cellSize = 24, labels }: HeatmapGridProps) {
    const getColor = (value: number) => {
        // "Cool to Hot" style: Blue -> Purple -> Pink -> Orange
        const r = Math.min(255, value * 255 * 1.5);
        const g = Math.min(255, value * 100);
        const b = Math.max(100, 255 - (value * 100));
        return `rgba(${r}, ${g}, ${b}, ${0.3 + (value * 0.7)})`;
    };

    return (
        <div className="heatmap-container">
            {labels?.y && (
                <div className="heatmap-y-labels">
                    {labels.y.map((label, i) => (
                        <div key={i} style={{ height: cellSize, lineHeight: `${cellSize}px` }} className="heatmap-label">{label}</div>
                    ))}
                </div>
            )}
            <div
                className="heatmap-grid"
                style={{
                    gridTemplateColumns: `repeat(${data[0]?.length || 0}, ${cellSize}px)`
                }}
                role="grid"
                aria-label="Data Heatmap"
            >
                {data.flatMap((row, rowIndex) =>
                    row.map((value, colIndex) => {
                        const color = getColor(value);
                        const label = `R${rowIndex}:C${colIndex} | ${Math.round(value * 100)}%`;

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className="heatmap-cell"
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                    background: color,
                                    boxShadow: `0 0 ${value * 10}px ${color}`
                                }}
                                role="gridcell"
                                aria-label={label}
                            >
                                <span className="heatmap-tooltip" aria-hidden="true">{label}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
