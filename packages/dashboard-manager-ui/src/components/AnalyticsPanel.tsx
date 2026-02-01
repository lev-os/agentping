interface Dashboard {
  status: {
    status: string
    restartAttempts: number
  }
}

interface AnalyticsPanelProps {
  dashboards: Dashboard[]
}

export function AnalyticsPanel({ dashboards }: AnalyticsPanelProps) {
  const totalDashboards = dashboards.length
  const onlineDashboards = dashboards.filter(d => d.status.status === 'online').length
  const totalRestarts = dashboards.reduce((sum, d) => sum + d.status.restartAttempts, 0)
  const failedDashboards = dashboards.filter(d => d.status.status === 'failed').length

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '0.5rem',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <StatCard
        label="Total Dashboards"
        value={totalDashboards}
        color="#3b82f6"
      />
      <StatCard
        label="Online"
        value={onlineDashboards}
        color="#22c55e"
      />
      <StatCard
        label="Total Restarts"
        value={totalRestarts}
        color="#f59e0b"
      />
      <StatCard
        label="Failed"
        value={failedDashboards}
        color="#ef4444"
      />
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  )
}
