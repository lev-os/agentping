import { useState, useEffect } from 'react';
import { Activity, ExternalLink, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import './Navigator.css';

interface Dashboard {
    name: string;
    port: number;
    url: string;
    description?: string;
}

type DashboardStatus = 'online' | 'offline' | 'checking';

interface DashboardWithStatus extends Dashboard {
    status: DashboardStatus;
}

const DEFAULT_DASHBOARDS: Dashboard[] = [
    {
        name: 'AgentPing Storybook',
        port: 6006,
        url: 'http://localhost:6006',
        description: 'AgentPing Component Library & Design System'
    },
    {
        name: 'Sofia UI Storybook',
        port: 6007,
        url: 'http://localhost:6007',
        description: 'Sofia RAG Interface Components'
    },
    {
        name: 'Clawd Dashboard',
        port: 3001,
        url: 'http://localhost:3001',
        description: 'Clawdbot Gateway & Session Management'
    },
    {
        name: 'CEO Stack',
        port: 3003,
        url: 'http://localhost:3003',
        description: 'CEO Executive Dashboard & Analytics'
    },
    {
        name: 'Jarvis Dashboard',
        port: 8080,
        url: 'http://localhost:8080',
        description: 'Jarvis Voice Interface & Control Panel'
    }
];

export function Navigator() {
    const [dashboards, setDashboards] = useState<DashboardWithStatus[]>(
        DEFAULT_DASHBOARDS.map(d => ({ ...d, status: 'checking' as DashboardStatus }))
    );

    // Health check for a single dashboard
    const checkDashboardHealth = async (dashboard: Dashboard): Promise<DashboardStatus> => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

            const response = await fetch(dashboard.url, {
                method: 'GET',
                signal: controller.signal,
                mode: 'no-cors' // Allow checking without CORS issues
            });

            clearTimeout(timeoutId);

            // With no-cors, we can't read the response, but fetch succeeding means server is up
            return 'online';
        } catch (error) {
            // AbortError or network error means server is down
            return 'offline';
        }
    };

    // Check all dashboards
    useEffect(() => {
        const checkAllDashboards = async () => {
            const statusChecks = await Promise.all(
                dashboards.map(async (dashboard) => ({
                    ...dashboard,
                    status: await checkDashboardHealth(dashboard)
                }))
            );
            setDashboards(statusChecks);
        };

        checkAllDashboards();
        const interval = setInterval(checkAllDashboards, 10000); // Check every 10s

        return () => clearInterval(interval);
    }, []);

    const handleOpenDashboard = (url: string) => {
        window.open(url, '_blank');
    };

    const getStatusIcon = (status: DashboardStatus) => {
        switch (status) {
            case 'online':
                return <CheckCircle2 size={18} className="status-icon online" />;
            case 'offline':
                return <XCircle size={18} className="status-icon offline" />;
            case 'checking':
                return <AlertCircle size={18} className="status-icon checking" />;
        }
    };

    const getStatusLabel = (status: DashboardStatus) => {
        switch (status) {
            case 'online':
                return 'ONLINE';
            case 'offline':
                return 'OFFLINE';
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
                        key={dashboard.port}
                        className={`dashboard-card status-${dashboard.status}`}
                        onClick={() => dashboard.status === 'online' && handleOpenDashboard(dashboard.url)}
                        style={{ cursor: dashboard.status === 'online' ? 'pointer' : 'default' }}
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
                                <span className="port-value">{dashboard.port}</span>
                            </div>
                            <div className="dashboard-url">
                                <code>{dashboard.url}</code>
                            </div>
                        </div>

                        {dashboard.status === 'online' && (
                            <div className="card-footer">
                                <span className="open-hint">Click to open in browser</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="navigator-footer">
                <p className="hint">
                    Dashboard status updates automatically every 10 seconds
                </p>
            </div>
        </div>
    );
}
