/**
 * Navigator with Dashboard Manager Integration
 *
 * Single source of truth: dashboards are loaded from dashboard-manager-server.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, ExternalLink, RotateCw, XCircle } from 'lucide-react';
import './Navigator.css';

type DashboardHealthStatus = 'online' | 'offline' | 'checking' | 'restarting' | 'failed';

interface DashboardStatusApi {
  status?: string;
  port?: number;
  healthy?: boolean;
  restartAttempts?: number;
}

interface DashboardApiItem {
  id: string;
  config?: {
    name?: string;
    port?: number;
  };
  status?: DashboardStatusApi;
}

interface DashboardUI {
  id: string;
  name: string;
  url: string;
  port: number;
  status: DashboardHealthStatus;
  healthy: boolean;
  restartAttempts: number;
}

interface NavigatorWithDashboardsProps {
  onSelectDashboard?: (dashboardId: string) => void;
}

const DASHBOARD_API_BASE =
  (import.meta.env.VITE_DASHBOARD_API_URL as string | undefined) ?? 'http://127.0.0.1:3030';

const DESCRIPTION_BY_ID: Record<string, string> = {
  agentping: 'AgentPing component gallery and design system',
  sofia: 'Sofia Storybook surface',
  'web-ui': 'AgentPing web adapter surface',
  canvas: 'Unified canvas renderer and polymorph playground',
  'dashboard-manager-ui': 'Dashboard manager operations UI',
  studio: 'AgentPing Studio runtime surface',
};

function statusFromApi(status?: DashboardStatusApi): DashboardHealthStatus {
  if (!status || !status.status) return 'checking';
  if (status.status === 'online' && status.healthy !== false) return 'online';
  if (status.status === 'online' && status.healthy === false) return 'failed';
  if (status.status === 'failed') return 'failed';
  if (status.status === 'starting' || status.status === 'restarting') return 'restarting';
  return 'offline';
}

function dashboardUrl(id: string, port: number): string {
  return `http://localhost:${port}`;
}

export function NavigatorWithDashboards({ onSelectDashboard }: NavigatorWithDashboardsProps = {}) {
  const [dashboards, setDashboards] = useState<DashboardUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restarting, setRestarting] = useState<Set<string>>(new Set());

  const loadDashboards = useCallback(async () => {
    try {
      const response = await fetch(`${DASHBOARD_API_BASE}/api/dashboards`);
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboards (${response.status})`);
      }

      const payload = (await response.json()) as DashboardApiItem[];
      const next = payload.map((item) => {
        const port = item.status?.port ?? item.config?.port ?? 0;
        return {
          id: item.id,
          name: item.config?.name ?? item.id,
          url: dashboardUrl(item.id, port),
          port,
          status: statusFromApi(item.status),
          healthy: item.status?.healthy !== false,
          restartAttempts: item.status?.restartAttempts ?? 0,
        } satisfies DashboardUI;
      });

      setDashboards(next);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboards();
    const interval = setInterval(() => {
      void loadDashboards();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadDashboards]);

  const handleOpenDashboard = (url: string) => {
    window.open(url, '_blank');
  };

  const handleRestartDashboard = async (dashboardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRestarting((prev) => new Set(prev).add(dashboardId));

    try {
      const response = await fetch(`${DASHBOARD_API_BASE}/api/dashboards/${dashboardId}/restart`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Restart failed (${response.status})`);
      }
      await loadDashboards();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setRestarting((prev) => {
        const next = new Set(prev);
        next.delete(dashboardId);
        return next;
      });
    }
  };

  const getStatusIcon = (status: DashboardHealthStatus) => {
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

  const getStatusLabel = (status: DashboardHealthStatus) => {
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

  const onlineCount = useMemo(
    () => dashboards.filter((dashboard) => dashboard.status === 'online').length,
    [dashboards],
  );

  return (
    <div className="navigator animate-in">
      <div className="navigator-header">
        <div className="header-title">
          <Activity size={20} className="text-accent-primary" />
          <h1>Dashboard Navigator</h1>
        </div>
        <div className="status-summary">
          <span className={onlineCount === dashboards.length ? 'all-online' : 'partial-online'}>
            {onlineCount}/{dashboards.length} ONLINE
          </span>
        </div>
      </div>

      {loading && (
        <div className="navigator-footer">
          <p className="hint">Loading dashboard status…</p>
        </div>
      )}

      {error && (
        <div className="navigator-footer">
          <p className="hint" style={{ color: 'var(--status-error)' }}>
            Dashboard API error: {error}
          </p>
        </div>
      )}

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
              <p className="dashboard-description">
                {DESCRIPTION_BY_ID[dashboard.id] ?? 'Dashboard surface'}
              </p>
              <div className="dashboard-meta">
                <span className="port-label">PORT</span>
                <span className="port-value">{dashboard.port}</span>
              </div>
              {dashboard.restartAttempts > 0 && (
                <div className="restart-info">
                  <span className="restart-attempts">
                    Restart attempts: {dashboard.restartAttempts}
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
              {(dashboard.status === 'offline' || dashboard.status === 'failed') && (
                <button
                  className="restart-button"
                  onClick={(e) => void handleRestartDashboard(dashboard.id, e)}
                  disabled={restarting.has(dashboard.id)}
                >
                  <RotateCw size={12} /> {restarting.has(dashboard.id) ? 'Restarting' : 'Restart'}
                </button>
              )}
              {onSelectDashboard && (
                <button
                  className="details-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDashboard(dashboard.id);
                  }}
                >
                  Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="navigator-footer">
        <p className="hint">Source of truth: {DASHBOARD_API_BASE}/api/dashboards</p>
      </div>
    </div>
  );
}
