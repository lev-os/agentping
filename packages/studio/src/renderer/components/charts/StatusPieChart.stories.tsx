/**
 * Status Pie Chart Storybook Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { StatusPieChart } from './StatusPieChart';
import type { AggregateStats } from '../../../types/dashboard';

const meta: Meta<typeof StatusPieChart> = {
    title: 'Charts/StatusPieChart',
    component: StatusPieChart,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof StatusPieChart>;

const mockStatsAllRunning: AggregateStats = {
    totalDashboards: 5,
    runningCount: 5,
    stoppedCount: 0,
    failedCount: 0,
    totalRestarts: 10,
    totalCrashes: 0,
    averageUptime: 3600000,
    fleetHealthRate: 0.99,
    totalHealthChecks: 500,
    healthCheckSuccessRate: 0.99,
    averageRestartTime: 2000,
    last24hRestarts: 3,
    last24hCrashes: 0,
    last7dUptime: 604800000,
};

const mockStatsMixed: AggregateStats = {
    totalDashboards: 10,
    runningCount: 6,
    stoppedCount: 3,
    failedCount: 1,
    totalRestarts: 25,
    totalCrashes: 5,
    averageUptime: 1800000,
    fleetHealthRate: 0.95,
    totalHealthChecks: 1000,
    healthCheckSuccessRate: 0.95,
    averageRestartTime: 5000,
    last24hRestarts: 8,
    last24hCrashes: 2,
    last7dUptime: 302400000,
};

const mockStatsAllStopped: AggregateStats = {
    totalDashboards: 3,
    runningCount: 0,
    stoppedCount: 3,
    failedCount: 0,
    totalRestarts: 0,
    totalCrashes: 0,
    averageUptime: 0,
    fleetHealthRate: 0,
    totalHealthChecks: 0,
    healthCheckSuccessRate: 0,
    averageRestartTime: 0,
    last24hRestarts: 0,
    last24hCrashes: 0,
    last7dUptime: 0,
};

const mockStatsEmpty: AggregateStats = {
    totalDashboards: 0,
    runningCount: 0,
    stoppedCount: 0,
    failedCount: 0,
    totalRestarts: 0,
    totalCrashes: 0,
    averageUptime: 0,
    fleetHealthRate: 0,
    totalHealthChecks: 0,
    healthCheckSuccessRate: 0,
    averageRestartTime: 0,
    last24hRestarts: 0,
    last24hCrashes: 0,
    last7dUptime: 0,
};

export const AllRunning: Story = {
    args: {
        stats: mockStatsAllRunning,
        width: 400,
        height: 300,
    },
};

export const MixedStatus: Story = {
    args: {
        stats: mockStatsMixed,
        width: 400,
        height: 300,
    },
};

export const AllStopped: Story = {
    args: {
        stats: mockStatsAllStopped,
        width: 400,
        height: 300,
    },
};

export const Empty: Story = {
    args: {
        stats: mockStatsEmpty,
        width: 400,
        height: 300,
    },
};

export const Responsive: Story = {
    args: {
        stats: mockStatsMixed,
        width: '100%',
        height: 400,
    },
    parameters: {
        layout: 'padded',
    },
};
