import React from 'react';
import './YearHeatmap.css';

interface HeatmapData {
    date: string; // YYYY-MM-DD
    value: number; // intensity 0-4
}

interface YearHeatmapProps {
    data: HeatmapData[];
    year?: number;
    colorBase?: string; // Hex color base
}

export const YearHeatmap: React.FC<YearHeatmapProps> = ({
    data,
    year = new Date().getFullYear(),
    colorBase = '#20bf6b'
}) => {
    // Generate dates for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Calculate weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Pad first week
    const startDay = startDate.getDay();
    for (let i = 0; i < startDay; i++) {
        currentWeek.push(null as any);
    }

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        currentWeek.push(new Date(currentDate));
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const getValue = (date: Date) => {
        if (!date) return 0;
        const dStr = date.toISOString().split('T')[0];
        const entry = data.find(d => d.date === dStr);
        return entry ? entry.value : 0;
    };

    const getColor = (value: number) => {
        if (value === 0) return 'var(--bg-tertiary)';
        // Simple opacity based on value (1-4)
        return `rgba(32, 191, 107, ${value * 0.25})`; // Hardcoded base for now matches Cyber green, or use props
    };

    const cellSize = 12;
    const gap = 2;

    return (
        <div className="year-heatmap">
            <svg viewBox={`0 0 ${weeks.length * (cellSize + gap)} ${7 * (cellSize + gap)}`} className="heatmap-svg">
                {weeks.map((week, weekIdx) => (
                    <g key={weekIdx} transform={`translate(${weekIdx * (cellSize + gap)}, 0)`}>
                        {week.map((date, dayIdx) => (
                            date && (
                                <rect
                                    key={dayIdx}
                                    x={0}
                                    y={dayIdx * (cellSize + gap)}
                                    width={cellSize}
                                    height={cellSize}
                                    fill={getColor(getValue(date))}
                                    className="heatmap-cell"
                                    rx={2}
                                    data-title={date.toDateString()}
                                >
                                    <title>{date.toDateString()}: {getValue(date)} events</title>
                                </rect>
                            )
                        ))}
                    </g>
                ))}
            </svg>
        </div>
    );
};
