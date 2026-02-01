/**
 * Uptime Chart Component
 *
 * Area chart showing dashboard uptime over time
 */

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import type { DashboardMetrics } from '../../../types/dashboard';

interface UptimeChartProps {
    metrics: DashboardMetrics;
    width?: number | string;
    height?: number;
}

interface UptimeDataPoint {
    timestamp: string;
    uptime: number;
    uptimeHours: number;
}

export const UptimeChart: React.FC<UptimeChartProps> = ({
    metrics,
    width = '100%',
    height = 300
}) => {
    // Generate time series data from restart history
    const generateUptimeData = (): UptimeDataPoint[] => {
        const data: UptimeDataPoint[] = [];
        const now = Date.now();

        // If no restart history, show current uptime
        if (metrics.restartHistory.length === 0) {
            data.push({
                timestamp: new Date(metrics.startedAt).toLocaleTimeString(),
                uptime: metrics.uptime,
                uptimeHours: metrics.uptime / (1000 * 60 * 60)
            });
            data.push({
                timestamp: new Date(now).toLocaleTimeString(),
                uptime: metrics.uptime,
                uptimeHours: metrics.uptime / (1000 * 60 * 60)
            });
            return data;
        }

        // Plot uptime between restart events
        const sortedRestarts = [...metrics.restartHistory].reverse(); // Oldest first
        let cumulativeUptime = 0;

        sortedRestarts.forEach((restart, idx) => {
            if (restart.success) {
                cumulativeUptime += restart.previousUptime;
                data.push({
                    timestamp: new Date(restart.timestamp).toLocaleTimeString(),
                    uptime: cumulativeUptime,
                    uptimeHours: cumulativeUptime / (1000 * 60 * 60)
                });
            }
        });

        // Add current uptime
        const currentUptime = cumulativeUptime + metrics.uptime;
        data.push({
            timestamp: new Date(now).toLocaleTimeString(),
            uptime: currentUptime,
            uptimeHours: currentUptime / (1000 * 60 * 60)
        });

        return data;
    };

    const data = generateUptimeData();

    const formatUptime = (value: number): string => {
        return `${value.toFixed(2)}h`;
    };

    return (
        <ResponsiveContainer width={width} height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatUptime}
                    label={{ value: 'Uptime (hours)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                    formatter={(value: number) => formatUptime(value)}
                    labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="uptimeHours"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUptime)"
                    name="Uptime"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
