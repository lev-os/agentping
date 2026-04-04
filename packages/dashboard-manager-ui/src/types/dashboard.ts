export interface DashboardMetadata {
  lane: 'ops' | 'interaction' | 'development'
  openMode: 'embed' | 'external'
  description: string
  primary?: boolean
}

export interface DashboardConfig {
  id: string
  name: string
  port: number
  command: string
  cwd: string
  port_range: [number, number]
  health_check: {
    type: 'http' | 'process'
    path?: string
    timeout_ms?: number
    expected_status?: number | number[]
    interval_ms?: number
  }
  restart_policy: {
    enabled: boolean
    max_retries: number
    backoff_ms: number[]
  }
  metadata?: DashboardMetadata
}

export interface DashboardStatus {
  status: 'starting' | 'online' | 'failed' | 'stopped'
  port?: number
  pid?: number
  startedAt?: string
  restartAttempts: number
  healthy: boolean
  lastHealthCheck?: string
  reason?: string
  timestamp?: string
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

export interface DashboardStatusEvent extends Partial<DashboardStatus> {
  dashboardId: string
}

export interface DashboardHealthFailedEvent {
  dashboardId: string
  reason: string
  timestamp: string
}

export interface DashboardPortChangedEvent {
  dashboardId: string
  oldPort: number
  newPort: number
  reason?: string
  timestamp: string
}

export interface CreateDashboardRequest {
  config: DashboardConfig
}

export type DashboardsListResponse = Dashboard[]
