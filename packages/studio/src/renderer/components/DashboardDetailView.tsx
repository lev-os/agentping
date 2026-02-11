import { useState, useEffect } from 'react';
import { ArrowLeft, Activity, RefreshCw, Play, Square, Clock, Server } from 'lucide-react';
import { LogViewer } from './LogViewer';
import { UptimeChart, RestartHistogram, StatusPieChart } from './charts';
import type { DashboardMetrics } from '../../types/dashboard';
import './DashboardDetailView.css';

interface DashboardDetailViewProps {
    dashboardId: string;
    onBack: () => void;
}

export function DashboardDetailView({ dashboardId, onBack }: DashboardDetailViewProps) {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [status, setStatus] = useState<'running' | 'stopped' | 'crashed'>('running');
    const [isRestarting, setIsRestarting] = useState(false);

    // Fetch metrics on mount and when dashboardId changes
    useEffect(() => {
        if (!window.electron) return;

        const fetchMetrics = async () => {
            try {
                const result = await window.electron.invoke('dashboard:get-metrics', { dashboardId });
                if (result.success && result.metrics) {
                    setMetrics(result.metrics);
                } else {
                    console.error('[DashboardDetailView] Failed to fetch metrics:', result.error);
                }
            } catch (err) {
                console.error('[DashboardDetailView] Error fetching metrics:', err);
            }
        };

        fetchMetrics();

        // Refresh metrics every 5 seconds
        const interval = setInterval(fetchMetrics, 5000);

        return () => clearInterval(interval);
    }, [dashboardId]);

    // Listen for dashboard events to update status
    useEffect(() => {
        if (!window.electron) return;

        const handleProcessStarted = (data: { dashboardId: string }) => {
            if (data.dashboardId === dashboardId) {
                setStatus('running');
            }
        };

        const handleProcessCrashed = (data: { dashboardId: string }) => {
            if (data.dashboardId === dashboardId) {
                setStatus('crashed');
            }
        };

        window.electron.on('dashboard:process_started', handleProcessStarted);
        window.electron.on('dashboard:process_crashed', handleProcessCrashed);

        return () => {
            window.electron.removeListener('dashboard:process_started', handleProcessStarted);
            window.electron.removeListener('dashboard:process_crashed', handleProcessCrashed);
        };
    }, [dashboardId]);

    const handleRestart = async () => {
        if (isRestarting) return;

        setIsRestarting(true);
        try {
            if (window.dashboardManager) {
                await window.dashboardManager.restart(dashboardId);
            } else if (window.electron) {
                await window.electron.invoke('dashboard:restart', dashboardId);
            } else {
                throw new Error('Dashboard API unavailable in renderer');
            }
        } catch (err) {
            console.error('[DashboardDetailView] Restart failed:', err);
        } finally {
            setTimeout(() => setIsRestarting(false), 2000);
        }
    };

    const formatUptime = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${minutes}m ${secs}s`;
    };

    if (!metrics) {
        return (
            <div className="dashboard-detail-view loading">
                <div className="loading-spinner">Loading dashboard metrics...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-detail-view">
            {/* Header */}
            <div className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={18} />
                    Back to Dashboards
                </button>

                <div className="detail-title">
                    <Server size={20} />
                    <h1>{dashboardId}</h1>
                    <div className={`status-badge status-${status}`}>
                        {status === 'running' && <Play size={12} />}
                        {status === 'stopped' && <Square size={12} />}
                        {status === 'crashed' && <Activity size={12} />}
                        {status.toUpperCase()}
                    </div>
                </div>

                <div className="detail-controls">
                    <button
                        className="restart-button"
                        onClick={handleRestart}
                        disabled={isRestarting}
                    >
                        <RefreshCw size={16} className={isRestarting ? 'spinning' : ''} />
                        {isRestarting ? 'Restarting...' : 'Restart'}
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="detail-stats-bar">
                <div className="stat-item">
                    <Clock size={14} />
                    <div className="stat-content">
                        <span className="stat-label">Uptime</span>
                        <span className="stat-value">{formatUptime(metrics.uptime)}</span>
                    </div>
                </div>
                <div className="stat-item">
                    <Server size={14} />
                    <div className="stat-content">
                        <span className="stat-label">Total Restarts</span>
                        <span className="stat-value">{metrics.totalRestarts}</span>
                    </div>
                </div>
                <div className="stat-item">
                    <Activity size={14} />
                    <div className="stat-content">
                        <span className="stat-label">Total Crashes</span>
                        <span className="stat-value">{metrics.totalCrashes}</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-content">
                        <span className="stat-label">Health Rate</span>
                        <span className="stat-value">{(metrics.healthCheckRate * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="detail-content">
                {/* Metrics Section */}
                <div className="metrics-section">
                    <h2 className="section-title">
                        <Activity size={16} />
                        Metrics
                    </h2>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <h3>Uptime Over Time</h3>
                            <UptimeChart metrics={metrics} height={200} />
                        </div>

                        <div className="chart-card">
                            <h3>Restart History</h3>
                            <RestartHistogram metrics={metrics} height={200} />
                        </div>

                        <div className="chart-card">
                            <h3>Health Status</h3>
                            <StatusPieChart metrics={metrics} height={200} />
                        </div>
                    </div>
                </div>

                {/* Logs Section */}
                <div className="logs-section">
                    <LogViewer dashboardId={dashboardId} maxLines={500} />
                </div>
            </div>
        </div>
    );
}
