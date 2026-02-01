import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import { dashboardAPI } from '../api/client'
import { useWebSocket } from '../hooks/useWebSocket'
import { StatusBadge } from './StatusBadge'
import { CreateDashboardModal } from './CreateDashboardModal'
import { AnalyticsPanel } from './AnalyticsPanel'
import type { Dashboard } from '../types/dashboard'
import './DashboardList.css'

export function DashboardList() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()
  const ws = useWebSocket()

  useEffect(() => {
    loadDashboards()
  }, [])

  useEffect(() => {
    if (!ws.isConnected) return

    const handleStatusUpdate = (data: any) => {
      setDashboards(prev =>
        prev.map(d =>
          d.id === data.dashboardId
            ? { ...d, status: { ...d.status, ...data } }
            : d
        )
      )
    }

    ws.on('dashboard:status', handleStatusUpdate)

    return () => {
      ws.off('dashboard:status', handleStatusUpdate)
    }
  }, [ws.isConnected])

  const loadDashboards = async () => {
    try {
      setIsLoading(true)
      const data = await dashboardAPI.listDashboards()
      setDashboards(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboards')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRowClick = (dashboard: Dashboard) => {
    if (dashboard.status.port) {
      window.open(`http://localhost:${dashboard.status.port}`, '_blank')
    }
  }

  const handleViewDetails = (e: React.MouseEvent, dashboardId: string) => {
    e.stopPropagation()
    navigate(`/dashboard/${dashboardId}`)
  }

  const handleCreateSuccess = async () => {
    setShowCreateModal(false)
    await loadDashboards()
  }

  if (isLoading) {
    return <div className="dashboard-list-loading">Loading dashboards...</div>
  }

  if (error) {
    return (
      <div className="dashboard-list-error">
        <p>Error: {error}</p>
        <button onClick={loadDashboards}>Retry</button>
      </div>
    )
  }

  return (
    <div className="dashboard-list">
      <div className="dashboard-list-header">
        <h1>Dashboards</h1>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} />
          New Dashboard
        </button>
      </div>

      {dashboards.length > 0 && <AnalyticsPanel dashboards={dashboards} />}

      {dashboards.length === 0 ? (
        <div className="dashboard-list-empty">
          <p>No dashboards yet</p>
          <button onClick={() => setShowCreateModal(true)}>
            Create your first dashboard
          </button>
        </div>
      ) : (
        <div className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Port</th>
                <th>PID</th>
                <th>Uptime</th>
                <th>Restarts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboards.map(dashboard => (
                <tr
                  key={dashboard.id}
                  className="dashboard-row"
                  onClick={() => handleRowClick(dashboard)}
                >
                  <td className="dashboard-name">
                    <div>
                      <div className="name">{dashboard.config.name}</div>
                      <div className="id">{dashboard.id}</div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge
                      status={dashboard.status.status}
                      healthy={dashboard.status.healthy}
                    />
                  </td>
                  <td>{dashboard.status.port || '-'}</td>
                  <td>{dashboard.status.pid || '-'}</td>
                  <td>
                    {dashboard.status.startedAt
                      ? formatUptime(new Date(dashboard.status.startedAt))
                      : '-'}
                  </td>
                  <td>{dashboard.status.restartAttempts}</td>
                  <td>
                    <button
                      className="btn-primary-sm"
                      onClick={e => handleViewDetails(e, dashboard.id)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateDashboardModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  )
}

function formatUptime(startTime: Date): string {
  const ms = Date.now() - startTime.getTime()
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}
