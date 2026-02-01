export interface DashboardConfig {
  id: string
  name: string
  command: string
  cwd: string
  port_range: [number, number]
  health_check?: {
    type: 'http' | 'tcp'
    path?: string
    timeout_ms?: number
  }
}

export interface DashboardStatus {
  status: 'starting' | 'online' | 'failed' | 'stopped'
  port?: number
  pid?: number
  startedAt?: string
  restartAttempts: number
  healthy: boolean
  lastHealthCheck?: string
}

export interface Dashboard {
  id: string
  config: DashboardConfig
  status: DashboardStatus
}

export interface DashboardMetrics {
  uptime_ms: number
  restarts: number
  crashes: number
  last_health_check: string
  healthy: boolean
}

export interface DashboardLogLine {
  dashboardId: string
  timestamp: string
  stream: 'stdout' | 'stderr'
  line: string
}

export interface CreateDashboardRequest {
  config: DashboardConfig
}

export interface DashboardsListResponse {
  dashboards: Dashboard[]
}
