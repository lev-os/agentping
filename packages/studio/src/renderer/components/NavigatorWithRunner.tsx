/**
 * Navigator with Dashboard Runner Integration
 *
 * Enhanced version that uses @lev-os/dashboard-runner for resilient process management
 */

import { useState, useEffect, useRef } from 'react';
import { Activity, ExternalLink, CheckCircle2, XCircle, AlertCircle, RotateCw } from 'lucide-react';
import './Navigator.css';

// Dashboard runner will be imported when backend integration is complete
// For now, using type-only import
import type { DashboardStatus as RunnerStatus } from 'dashboard-runner';

interface DashboardUI {
    id: string;
    name: string;
    port: number;
    actualPort?: number;
    url: string;
    description?: string;
    status: 'online' | 'offline' | 'checking' | 'restarting' | 'failed';
    restartAttempts?: number;
    lastHealthCheck?: Date;
}

const DEFAULT_DASHBOARDS: Omit<DashboardUI, 'status'>[] = [
    {
        id: 'agentping',
        name: 'AgentPing Storybook',
        port: 6006,
        url: 'http://localhost:6006',
        description: 'AgentPing Component Library & Design System'
    },
    {
        id: 'sofia',
        name: 'Sofia UI Storybook',
        port: 6007,
        url: 'http://localhost:6007',
        description: 'Sofia RAG Interface Components'
    },
    {
        id: 'flight-deck',
        name: 'Flight Deck Dashboard',
        port: 3001,
        url: 'http://localhost:3001',
        description: 'Flight Deck Monitoring & Session Viewer'
    },
    {
        id: 'ceo-stack',
        name: 'CEO Stack',
        port: 3003,
        url: 'http://localhost:3003',
        description: 'CEO Executive Dashboard & Analytics'
    },
    {
        id: 'jarvis',
        name: 'Jarvis Dashboard',
        port: 8080,
        url: 'http://localhost:8080',
        description: 'Jarvis Voice Interface & Control Panel'
    },
    {
        id: 'navigator',
        name: 'Navigator',
        port: 5180,
        url: 'http://localhost:5180/navigator',
        description: 'Dashboard Navigator & Control Center'
    }
];

interface NavigatorWithRunnerProps {
    onSelectDashboard?: (dashboardId: string) => void;
}

export function NavigatorWithRunner({ onSelectDashboard }: NavigatorWithRunnerProps = {}) {
    const [dashboards, setDashboards] = useState<DashboardUI[]>(
        DEFAULT_DASHBOARDS.map(d => ({ ...d, status: 'checking' as const }))
    );
    const [runnerEnabled, setRunnerEnabled] = useState(false);

    // Dashboard runner instance (to be initialized when backend is ready)
    const runnerRef = useRef<any>(null);

    useEffect(() => {
        // Listen for dashboard runner events from main process
        if (window.electron?.ipcRenderer) {
            console.log('[NavigatorWithRunner] Setting up IPC event listeners...');

            // Process started successfully
            const handleProcessStarted = (data: any) => {
                console.log('[NavigatorWithRunner] Process started:', data);
                setDashboards(prev => prev.map(d =>
                    d.id === data.dashboardId
                        ? { ...d, status: 'online', actualPort: data.port, restartAttempts: 0, lastHealthCheck: new Date() }
                        : d
                ));
                setRunnerEnabled(true);
            };

            // Process crashed, restart initiated
            const handleProcessCrashed = (data: any) => {
                console.log('[NavigatorWithRunner] Process crashed:', data);
                setDashboards(prev => prev.map(d =>
                    d.id === data.dashboardId
                        ? { ...d, status: 'restarting' }
                        : d
                ));
            };

            // Restart succeeded
            const handleRestartSuccess = (data: any) => {
                console.log('[NavigatorWithRunner] Restart success:', data);
                setDashboards(prev => prev.map(d =>
                    d.id === data.dashboardId
                        ? { ...d, status: 'online', actualPort: data.port, restartAttempts: 0, lastHealthCheck: new Date() }
                        : d
                ));
            };

            // Restart failed after all retries
            const handleRestartFailed = (data: any) => {
                console.log('[NavigatorWithRunner] Restart failed:', data);
                setDashboards(prev => prev.map(d =>
                    d.id === data.dashboardId
                        ? { ...d, status: 'failed', restartAttempts: data.attempts }
                        : d
                ));
            };

            // Health check failed
            const handleHealthCheckFailed = (data: any) => {
                console.log('[NavigatorWithRunner] Health check failed:', data);
                setDashboards(prev => prev.map(d =>
                    d.id === data.dashboardId
                        ? { ...d, status: 'offline', lastHealthCheck: new Date() }
                        : d
                ));
            };

            // Port changed (auto-selected different port)
            const handlePortChanged = (data: any) => {
                console.log('[NavigatorWithRunner] Port changed:', data);
                setDashboards(prev => prev.map(d =>
                    d.id === data.dashboardId
                        ? { ...d, actualPort: data.newPort, lastHealthCheck: new Date() }
                        : d
                ));
            };

            // Register all event listeners
            window.electron.ipcRenderer.on('dashboard:process_started', handleProcessStarted);
            window.electron.ipcRenderer.on('dashboard:process_crashed', handleProcessCrashed);
            window.electron.ipcRenderer.on('dashboard:restart_success', handleRestartSuccess);
            window.electron.ipcRenderer.on('dashboard:restart_failed', handleRestartFailed);
            window.electron.ipcRenderer.on('dashboard:health_check_failed', handleHealthCheckFailed);
            window.electron.ipcRenderer.on('dashboard:port_changed', handlePortChanged);

            console.log('[NavigatorWithRunner] IPC event listeners registered');

            // Cleanup function
            return () => {
                console.log('[NavigatorWithRunner] Cleaning up IPC event listeners...');
                window.electron.ipcRenderer.removeAllListeners('dashboard:process_started');
                window.electron.ipcRenderer.removeAllListeners('dashboard:process_crashed');
                window.electron.ipcRenderer.removeAllListeners('dashboard:restart_success');
                window.electron.ipcRenderer.removeAllListeners('dashboard:restart_failed');
                window.electron.ipcRenderer.removeAllListeners('dashboard:health_check_failed');
                window.electron.ipcRenderer.removeAllListeners('dashboard:port_changed');
            };
        } else {
            // Fallback: Use health checks if electron IPC not available
            console.log('[NavigatorWithRunner] Electron IPC not available, using health check fallback');

            const checkDashboardHealth = async (dashboard: Omit<DashboardUI, 'status'>): Promise<'online' | 'offline'> => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);

                    await fetch(dashboard.url, {
                        method: 'GET',
                        signal: controller.signal,
                        mode: 'no-cors'
                    });

                    clearTimeout(timeoutId);
                    return 'online';
                } catch {
                    return 'offline';
                }
            };

            const checkAllDashboards = async () => {
                const statusChecks = await Promise.all(
                    dashboards.map(async (dashboard) => ({
                        ...dashboard,
                        status: await checkDashboardHealth(dashboard),
                        lastHealthCheck: new Date()
                    }))
                );
                setDashboards(statusChecks as DashboardUI[]);
            };

            checkAllDashboards();
            const interval = setInterval(checkAllDashboards, 10000);

            return () => clearInterval(interval);
        }
    }, []);

    const handleOpenDashboard = (url: string) => {
        window.open(url, '_blank');
    };

    const handleRestartDashboard = async (dashboardId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click

        if (window.electron?.ipcRenderer) {
            console.log(`[NavigatorWithRunner] Requesting restart for dashboard: ${dashboardId}`);

            // Update UI to show restarting state
            setDashboards(prev => prev.map(d =>
                d.id === dashboardId
                    ? { ...d, status: 'restarting' }
                    : d
            ));

            try {
                const result = await window.electron.ipcRenderer.invoke('dashboard:restart', dashboardId);
                if (result.error) {
                    console.error(`[NavigatorWithRunner] Restart failed:`, result.error);
                    // Reset to failed state if restart request failed
                    setDashboards(prev => prev.map(d =>
                        d.id === dashboardId
                            ? { ...d, status: 'failed' }
                            : d
                    ));
                } else {
                    console.log(`[NavigatorWithRunner] Restart request sent successfully`);
                }
            } catch (err) {
                console.error(`[NavigatorWithRunner] Failed to request restart:`, err);
                setDashboards(prev => prev.map(d =>
                    d.id === dashboardId
                        ? { ...d, status: 'failed' }
                        : d
                ));
            }
        } else {
            console.log('[NavigatorWithRunner] Dashboard runner not available (Electron IPC not initialized)');
        }
    };

    const getStatusIcon = (status: DashboardUI['status']) => {
        switch (status) {
            case 'online':
                return <CheckCircle2 size={18} className="status-icon online" />;
            case 'offline':
                return <XCircle size={18} className="status-icon offline" />;
            case 'restarting':
                return <RotateCw size={18} className="status-icon restarting spin" />;
            case 'failed':
                return <XCircle size={18} className="status-icon failed" />;
            case 'checking':
                return <AlertCircle size={18} className="status-icon checking" />;
        }
    };

    const getStatusLabel = (status: DashboardUI['status']) => {
        switch (status) {
            case 'online':
                return 'ONLINE';
            case 'offline':
                return 'OFFLINE';
            case 'restarting':
                return 'RESTARTING...';
            case 'failed':
                return 'FAILED';
            case 'checking':
                return 'CHECKING...';
        }
    };

    const onlineCount = dashboards.filter(d => d.status === 'online').length;
    const totalCount = dashboards.length;

    return (
        <div className="navigator animate-in">
            <div className="navigator-header">
                <div className="header-title">
                    <Activity size={20} className="text-accent-primary" />
                    <h1>Dashboard Navigator</h1>
                    {runnerEnabled && <span className="runner-badge">✨ Auto-Restart Enabled</span>}
                </div>
                <div className="status-summary">
                    <span className={onlineCount === totalCount ? 'all-online' : 'partial-online'}>
                        {onlineCount}/{totalCount} ONLINE
                    </span>
                </div>
            </div>

            <div className="dashboard-grid">
                {dashboards.map((dashboard) => (
                    <div
                        key={dashboard.id}
                        className={`dashboard-card status-${dashboard.status}`}
                        onClick={() => handleOpenDashboard(dashboard.url)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-header">
                            <div className="card-title">
                                <h3>{dashboard.name}</h3>
                                {dashboard.status === 'online' && (
                                    <ExternalLink size={14} className="external-icon" />
                                )}
                            </div>
                            <div className="status-badge">
                                {getStatusIcon(dashboard.status)}
                                <span className="status-label">{getStatusLabel(dashboard.status)}</span>
                            </div>
                        </div>

                        <div className="card-body">
                            {dashboard.description && (
                                <p className="dashboard-description">{dashboard.description}</p>
                            )}
                            <div className="dashboard-meta">
                                <span className="port-label">PORT</span>
                                <span className="port-value">
                                    {dashboard.actualPort || dashboard.port}
                                    {dashboard.actualPort && dashboard.actualPort !== dashboard.port && (
                                        <span className="port-changed"> (auto-selected)</span>
                                    )}
                                </span>
                            </div>
                            {dashboard.restartAttempts !== undefined && dashboard.restartAttempts > 0 && (
                                <div className="restart-info">
                                    <span className="restart-attempts">
                                        Restart attempts: {dashboard.restartAttempts}/5
                                    </span>
                                </div>
                            )}
                            <div className="dashboard-url">
                                <code>{dashboard.url}</code>
                            </div>
                        </div>

                        <div className="card-footer">
                            {dashboard.status === 'online' && (
                                <span className="open-hint">Click to open in browser</span>
                            )}
                            {(dashboard.status === 'offline' || dashboard.status === 'failed') && runnerEnabled && (
                                <button
                                    className="restart-button"
                                    onClick={(e) => handleRestartDashboard(dashboard.id, e)}
                                >
                                    <RotateCw size={12} /> Restart
                                </button>
                            )}
                            {onSelectDashboard && runnerEnabled && (
                                <button
                                    className="details-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectDashboard(dashboard.id);
                                    }}
                                >
                                    <Activity size={12} /> View Details
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="navigator-footer">
                <p className="hint">
                    {runnerEnabled
                        ? 'Auto-restart enabled: Dashboards will automatically recover from crashes'
                        : 'Health checks run every 10 seconds · Dashboard runner integration coming soon'
                    }
                </p>
            </div>
        </div>
    );
}
