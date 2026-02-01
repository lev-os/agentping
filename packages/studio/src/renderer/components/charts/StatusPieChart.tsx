/**
 * Status Pie Chart Component
 *
 * Pie chart showing distribution of dashboard statuses
 */

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip
} from 'recharts';
import type { AggregateStats } from '../../../types/dashboard';

interface StatusPieChartProps {
    stats: AggregateStats;
    width?: number | string;
    height?: number;
}

interface StatusData {
    name: string;
    value: number;
    color: string;
}

const COLORS = {
    running: '#4caf50',
    stopped: '#9e9e9e',
    failed: '#f44336'
};

export const StatusPieChart: React.FC<StatusPieChartProps> = ({
    stats,
    width = '100%',
    height = 300
}) => {
    const data: StatusData[] = [
        { name: 'Running', value: stats.runningCount, color: COLORS.running },
        { name: 'Stopped', value: stats.stoppedCount, color: COLORS.stopped },
        { name: 'Failed', value: stats.failedCount, color: COLORS.failed }
    ].filter(item => item.value > 0); // Only show non-zero categories

    if (data.length === 0) {
        return (
            <div
                style={{
                    width,
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                }}
            >
                No dashboard data available
            </div>
        );
    }

    const renderLabel = (entry: any) => {
        const percent = ((entry.value / stats.totalDashboards) * 100).toFixed(1);
        return `${entry.name}: ${entry.value} (${percent}%)`;
    };

    return (
        <ResponsiveContainer width={width} height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
