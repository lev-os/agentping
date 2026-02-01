/**
 * Uptime Chart Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { UptimeChart } from './UptimeChart';
import type { DashboardMetrics } from '../../../types/dashboard';

const meta: Meta<typeof UptimeChart> = {
    title: 'Charts/UptimeChart',
    component: UptimeChart,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof UptimeChart>;

const now = new Date();
const hour = 60 * 60 * 1000;

const mockMetricsShortUptime: DashboardMetrics = {
    dashboardId: 'test-dashboard',
    uptime: 2 * hour,
    totalUptime: 2 * hour,
    startedAt: new Date(now.getTime() - 2 * hour),
    firstStartedAt: new Date(now.getTime() - 2 * hour),
    totalRestarts: 0,
    restartHistory: [],
    currentRestartAttempts: 0,
    totalCrashes: 0,
    crashHistory: [],
    healthCheckHistory: [],
    healthCheckSuccess: 100,
    healthCheckFailed: 0,
    healthCheckRate: 1.0,
};

const mockMetricsWithRestarts: DashboardMetrics = {
    dashboardId: 'test-dashboard',
    uptime: 3 * hour,
    totalUptime: 10 * hour,
    startedAt: new Date(now.getTime() - 3 * hour),
    firstStartedAt: new Date(now.getTime() - 24 * hour),
    totalRestarts: 3,
    restartHistory: [
        {
            timestamp: new Date(now.getTime() - 3 * hour),
            reason: 'crash',
            previousUptime: 2 * hour,
            attempts: 1,
            success: true,
        },
        {
            timestamp: new Date(now.getTime() - 8 * hour),
            reason: 'manual',
            previousUptime: 3 * hour,
            attempts: 1,
            success: true,
        },
        {
            timestamp: new Date(now.getTime() - 15 * hour),
            reason: 'health_failure',
            previousUptime: 2 * hour,
            attempts: 1,
            success: true,
        },
    ],
    currentRestartAttempts: 0,
    totalCrashes: 1,
    crashHistory: [],
    healthCheckHistory: [],
    healthCheckSuccess: 200,
    healthCheckFailed: 5,
    healthCheckRate: 0.976,
};

export const ShortUptime: Story = {
    args: {
        metrics: mockMetricsShortUptime,
        width: 600,
        height: 300,
    },
};

export const WithRestarts: Story = {
    args: {
        metrics: mockMetricsWithRestarts,
        width: 600,
        height: 300,
    },
};

export const Responsive: Story = {
    args: {
        metrics: mockMetricsWithRestarts,
        width: '100%',
        height: 400,
    },
    parameters: {
        layout: 'padded',
    },
};
