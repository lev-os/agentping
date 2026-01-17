
import React from 'react';
import './DataMetricsBoard.css';

interface Metric {
    label: string;
    value: string | number;
    change: number;
    trend: number[]; // Simple array of numbers for sparkline
    unit?: string;
}

interface DataMetricsProps {
    metrics: Metric[];
}

export const DataMetricsBoard: React.FC<DataMetricsProps> = ({ metrics }) => {
    const renderSparkline = (data: number[]) => {
        if (!data.length) return null;
        const height = 30;
        const width = 80;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        // Create points string
        const points = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg className="metric-sparkline" width={width} height={height}>
                <polyline
                    points={points}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="1.5"
                />
            </svg>
        );
    };

    return (
        <div className="data-metrics-board">
            {metrics.map((metric, index) => {
                const isPositive = metric.change >= 0;
                return (
                    <div key={index} className="metric-card">
                        <div className="metric-header">
                            <span className="metric-label">{metric.label}</span>
                            <span className={`metric-change ${isPositive ? 'pos' : 'neg'}`}>
                                {isPositive ? '+' : ''}{metric.change}%
                            </span>
                        </div>

                        <div className="metric-body">
                            <div className="metric-value-wrapper">
                                <span className="metric-value">{metric.value}</span>
                                {metric.unit && <span className="metric-unit">{metric.unit}</span>}
                            </div>
                            <div className="sparkline-wrapper">
                                {renderSparkline(metric.trend)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
