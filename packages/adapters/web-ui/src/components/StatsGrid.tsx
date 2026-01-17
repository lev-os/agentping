import React from 'react';
import './StatsGrid.css';

interface StatItem {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    history?: number[];
}

interface StatsGridProps {
    stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="stats-grid" role="list" aria-label="Key Statistics">
            {stats.map((stat, i) => (
                <div key={i} className="stat-box" role="listitem">
                    <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-label">{stat.label}</span>
                        {stat.trend && (
                            <span
                                className={`stat-trend trend-${stat.trend}`}
                                aria-label={`Trend: ${stat.trend} by ${stat.trendValue || ''}`}
                            >
                                {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                                {stat.trendValue && ` ${stat.trendValue}`}
                            </span>
                        )}
                    </div>
                    <div className="stat-value-row">
                        <span className="stat-value">{stat.value}</span>
                    </div>
                    {stat.history && (
                        <div className="stat-sparkline" aria-hidden="true">
                            {stat.history.map((val, idx) => (
                                <div
                                    key={idx}
                                    className="spark-bar"
                                    style={{ height: `${val}%` }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
