/**
 * Restart Histogram Component
 *
 * Bar chart showing restart frequency grouped by day
 */

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';
import type { DashboardMetrics } from '../../../types/dashboard';

interface RestartHistogramProps {
    metrics: DashboardMetrics;
    width?: number | string;
    height?: number;
    days?: number;
}

interface RestartDayData {
    date: string;
    crashes: number;
    manualRestarts: number;
    healthFailures: number;
    total: number;
}

export const RestartHistogram: React.FC<RestartHistogramProps> = ({
    metrics,
    width = '100%',
    height = 300,
    days = 7
}) => {
    const generateHistogramData = (): RestartDayData[] => {
        const data: Map<string, RestartDayData> = new Map();
        const now = Date.now();
        const cutoff = now - (days * 24 * 60 * 60 * 1000);

        // Initialize last N days
        for (let i = 0; i < days; i++) {
            const date = new Date(now - (i * 24 * 60 * 60 * 1000));
            const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            data.set(dateKey, {
                date: dateKey,
                crashes: 0,
                manualRestarts: 0,
                healthFailures: 0,
                total: 0
            });
        }

        // Count restarts by day
        metrics.restartHistory.forEach(restart => {
            const timestamp = restart.timestamp.getTime();
            if (timestamp < cutoff) return;

            const dateKey = restart.timestamp.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });

            const dayData = data.get(dateKey);
            if (dayData) {
                switch (restart.reason) {
                    case 'crash':
                        dayData.crashes++;
                        break;
                    case 'manual':
                        dayData.manualRestarts++;
                        break;
                    case 'health_failure':
                        dayData.healthFailures++;
                        break;
                }
                dayData.total++;
            }
        });

        return Array.from(data.values()).reverse(); // Oldest to newest
    };

    const data = generateHistogramData();

    return (
        <ResponsiveContainer width={width} height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Restart Count', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                    labelStyle={{ color: '#000', fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="crashes" stackId="a" fill="#ff4444" name="Crashes" />
                <Bar dataKey="healthFailures" stackId="a" fill="#ff9800" name="Health Failures" />
                <Bar dataKey="manualRestarts" stackId="a" fill="#4caf50" name="Manual Restarts" />
            </BarChart>
        </ResponsiveContainer>
    );
};
