/**
 * Restart Histogram Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { RestartHistogram } from './RestartHistogram';
import type { DashboardMetrics } from '../../../types/dashboard';

const meta: Meta<typeof RestartHistogram> = {
    title: 'Charts/RestartHistogram',
    component: RestartHistogram,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof RestartHistogram>;

const now = new Date();
const day = 24 * 60 * 60 * 1000;

const mockMetricsNoRestarts: DashboardMetrics = {
    dashboardId: 'stable-dashboard',
    uptime: 7 * day,
    totalUptime: 7 * day,
    startedAt: new Date(now.getTime() - 7 * day),
    firstStartedAt: new Date(now.getTime() - 7 * day),
    totalRestarts: 0,
    restartHistory: [],
    currentRestartAttempts: 0,
    totalCrashes: 0,
    crashHistory: [],
    healthCheckHistory: [],
    healthCheckSuccess: 1000,
    healthCheckFailed: 0,
    healthCheckRate: 1.0,
};

const mockMetricsWithActivity: DashboardMetrics = {
    dashboardId: 'active-dashboard',
    uptime: 2 * day,
    totalUptime: 15 * day,
    startedAt: new Date(now.getTime() - 2 * day),
    firstStartedAt: new Date(now.getTime() - 30 * day),
    totalRestarts: 12,
    restartHistory: [
        // Today
        { timestamp: new Date(now.getTime() - 2 * day), reason: 'crash', previousUptime: day, attempts: 1, success: true },
        { timestamp: new Date(now.getTime() - 1.5 * day), reason: 'manual', previousUptime: 0.5 * day, attempts: 1, success: true },

        // Yesterday
        { timestamp: new Date(now.getTime() - 3 * day), reason: 'health_failure', previousUptime: day, attempts: 1, success: true },
        { timestamp: new Date(now.getTime() - 3.5 * day), reason: 'crash', previousUptime: 0.5 * day, attempts: 1, success: true },
        { timestamp: new Date(now.getTime() - 3.8 * day), reason: 'crash', previousUptime: 0.3 * day, attempts: 2, success: true },

        // 2 days ago
        { timestamp: new Date(now.getTime() - 4 * day), reason: 'manual', previousUptime: 0.2 * day, attempts: 1, success: true },

        // 4 days ago
        { timestamp: new Date(now.getTime() - 6 * day), reason: 'crash', previousUptime: 2 * day, attempts: 1, success: true },
        { timestamp: new Date(now.getTime() - 6.5 * day), reason: 'health_failure', previousUptime: 0.5 * day, attempts: 1, success: true },

        // 5 days ago
        { timestamp: new Date(now.getTime() - 7 * day), reason: 'crash', previousUptime: 0.5 * day, attempts: 1, success: true },
        { timestamp: new Date(now.getTime() - 7.3 * day), reason: 'manual', previousUptime: 0.3 * day, attempts: 1, success: true },

        // 6 days ago
        { timestamp: new Date(now.getTime() - 8 * day), reason: 'crash', previousUptime: 0.7 * day, attempts: 1, success: true },
        { timestamp: new Date(now.getTime() - 8.2 * day), reason: 'health_failure', previousUptime: 0.2 * day, attempts: 1, success: true },
    ],
    currentRestartAttempts: 0,
    totalCrashes: 7,
    crashHistory: [],
    healthCheckHistory: [],
    healthCheckSuccess: 800,
    healthCheckFailed: 20,
    healthCheckRate: 0.976,
};

export const NoRestarts: Story = {
    args: {
        metrics: mockMetricsNoRestarts,
        width: 600,
        height: 300,
        days: 7,
    },
};

export const WithActivity: Story = {
    args: {
        metrics: mockMetricsWithActivity,
        width: 600,
        height: 300,
        days: 7,
    },
};

export const Last14Days: Story = {
    args: {
        metrics: mockMetricsWithActivity,
        width: 800,
        height: 350,
        days: 14,
    },
};

export const Responsive: Story = {
    args: {
        metrics: mockMetricsWithActivity,
        width: '100%',
        height: 400,
        days: 7,
    },
    parameters: {
        layout: 'padded',
    },
};
