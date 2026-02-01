import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCw, ExternalLink } from 'lucide-react'
import { dashboardAPI } from '../api/client'
import { useWebSocket } from '../hooks/useWebSocket'
import { StatusBadge } from './StatusBadge'
import { LogViewer } from './LogViewer'
import { UptimeChart } from './charts/UptimeChart'
import { RestartHistogram } from './charts/RestartHistogram'
import type { Dashboard, DashboardMetrics } from '../types/dashboard'
import './DashboardDetail.css'

export function DashboardDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRestarting, setIsRestarting] = useState(false)
  const ws = useWebSocket()

  useEffect(() => {
    if (!id) return
    loadDashboard()
    loadMetrics()
    const interval = setInterval(loadMetrics, 5000)
    return () => clearInterval(interval)
  }, [id])

  useEffect(() => {
    if (!id || !ws.isConnected) return

    ws.subscribe(id)

    const handleStatusUpdate = (data: any) => {
      if (data.dashboardId === id) {
        setDashboard(prev =>
          prev ? { ...prev, status: { ...prev.status, ...data } } : null
        )
      }
    }

    ws.on('dashboard:status', handleStatusUpdate)

    return () => {
      ws.off('dashboard:status', handleStatusUpdate)
      ws.unsubscribe(id)
    }
  }, [id, ws.isConnected])

  const loadDashboard = async () => {
    if (!id) return
    try {
      setIsLoading(true)
      const data = await dashboardAPI.getDashboard(id)
      setDashboard(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMetrics = async () => {
    if (!id) return
    try {
      const data = await dashboardAPI.getDashboardMetrics(id)
      setMetrics(data)
    } catch (err) {
      console.error('Failed to load metrics:', err)
    }
  }

  const handleRestart = async () => {
    if (!id) return
    setIsRestarting(true)
    try {
      await dashboardAPI.restartDashboard(id)
      await loadDashboard()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to restart dashboard')
    } finally {
      setIsRestarting(false)
    }
  }

  const handleOpenDashboard = () => {
    if (dashboard?.status.port) {
      window.open(`http://localhost:${dashboard.status.port}`, '_blank')
    }
  }

  if (isLoading) {
    return <div className="detail-loading">Loading dashboard...</div>
  }

  if (error || !dashboard) {
    return (
      <div className="detail-error">
        <p>Error: {error || 'Dashboard not found'}</p>
        <button onClick={() => navigate('/')}>Back to List</button>
      </div>
    )
  }

  return (
    <div className="dashboard-detail">
      <div className="detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="detail-title">
          <h1>{dashboard.config.name}</h1>
          <code className="dashboard-id">{dashboard.id}</code>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={handleOpenDashboard}
            disabled={!dashboard.status.port}
          >
            <ExternalLink size={16} />
            Open Dashboard
          </button>
          <button
            className="restart-button"
            onClick={handleRestart}
            disabled={isRestarting}
          >
            <RotateCw size={16} className={isRestarting ? 'spinning' : ''} />
            {isRestarting ? 'Restarting...' : 'Restart'}
          </button>
        </div>
      </div>

      <div className="detail-status">
        <div className="status-item">
          <span className="label">Status</span>
          <StatusBadge
            status={dashboard.status.status}
            healthy={dashboard.status.healthy}
          />
        </div>
        <div className="status-item">
          <span className="label">Port</span>
          <span className="value">{dashboard.status.port || '-'}</span>
        </div>
        <div className="status-item">
          <span className="label">PID</span>
          <span className="value">{dashboard.status.pid || '-'}</span>
        </div>
        <div className="status-item">
          <span className="label">Restarts</span>
          <span className="value">{dashboard.status.restartAttempts}</span>
        </div>
        {dashboard.status.startedAt && (
          <div className="status-item">
            <span className="label">Started</span>
            <span className="value">
              {new Date(dashboard.status.startedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="detail-settings">
        <h2>Settings</h2>
        <div className="settings-grid">
          <div className="setting-item">
            <span className="setting-label">Port Range</span>
            <span className="setting-value">
              {dashboard.config.port_range[0]} - {dashboard.config.port_range[1]}
            </span>
          </div>
          <div className="setting-item">
            <span className="setting-label">Command</span>
            <code className="setting-value">{dashboard.config.command}</code>
          </div>
          <div className="setting-item">
            <span className="setting-label">Working Directory</span>
            <code className="setting-value">{dashboard.config.cwd}</code>
          </div>
          {dashboard.config.health_check && (
            <>
              <div className="setting-item">
                <span className="setting-label">Health Check Type</span>
                <span className="setting-value">{dashboard.config.health_check.type}</span>
              </div>
              {dashboard.config.health_check.path && (
                <div className="setting-item">
                  <span className="setting-label">Health Check Path</span>
                  <code className="setting-value">{dashboard.config.health_check.path}</code>
                </div>
              )}
              {dashboard.config.health_check.timeout_ms && (
                <div className="setting-item">
                  <span className="setting-label">Health Check Timeout</span>
                  <span className="setting-value">{dashboard.config.health_check.timeout_ms}ms</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {metrics && (
        <div className="detail-metrics">
          <h2>Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <UptimeChart uptimeMs={metrics.uptime_ms} />
            </div>
            <div className="metric-card">
              <RestartHistogram restarts={metrics.restarts} />
            </div>
          </div>
        </div>
      )}

      <div className="detail-logs">
        <h2>Logs</h2>
        <LogViewer dashboardId={id!} />
      </div>
    </div>
  )
}
