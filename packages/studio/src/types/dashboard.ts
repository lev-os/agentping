/**
 * Dashboard Metrics Types
 *
 * Type definitions for dashboard monitoring and metrics tracking
 */

export interface RestartRecord {
  timestamp: Date;
  reason: 'crash' | 'manual' | 'health_failure';
  previousUptime: number;
  attempts: number;
  success: boolean;
}

export interface CrashRecord {
  timestamp: Date;
  reason: string;
  exitCode: number | null;
  uptime: number;
  port: number;
  pid: number;
}

export interface HealthCheckRecord {
  timestamp: Date;
  success: boolean;
  responseTime?: number;
  statusCode?: number;
  error?: string;
}

export interface DashboardMetrics {
  // Identity
  dashboardId: string;

  // Lifecycle tracking
  uptime: number;
  totalUptime: number;
  startedAt: Date;
  firstStartedAt: Date;

  // Restart tracking
  totalRestarts: number;
  restartHistory: RestartRecord[];
  currentRestartAttempts: number;

  // Crash tracking
  totalCrashes: number;
  lastCrashTime?: Date;
  crashHistory: CrashRecord[];

  // Health monitoring
  healthCheckHistory: HealthCheckRecord[];
  healthCheckSuccess: number;
  healthCheckFailed: number;
  healthCheckRate: number;

  // Performance
  averageResponseTime?: number;
  peakMemoryUsage?: number;
}

export interface AggregateStats {
  // Fleet overview
  totalDashboards: number;
  runningCount: number;
  stoppedCount: number;
  failedCount: number;

  // Aggregate metrics
  totalRestarts: number;
  totalCrashes: number;
  averageUptime: number;
  fleetHealthRate: number;

  // Fleet performance
  totalHealthChecks: number;
  healthCheckSuccessRate: number;
  averageRestartTime: number;

  // Time windows
  last24hRestarts: number;
  last24hCrashes: number;
  last7dUptime: number;
}

export interface MetricsEvent {
  type: 'metrics_updated';
  dashboardId: string;
  metrics: DashboardMetrics;
}

export interface GetMetricsRequest {
  dashboardId: string;
}

export interface GetMetricsResponse {
  success: boolean;
  metrics?: DashboardMetrics;
  error?: string;
}

export interface GetAllMetricsResponse {
  success: boolean;
  metrics?: Record<string, DashboardMetrics>;
  error?: string;
}

export interface GetAggregateStatsResponse {
  success: boolean;
  stats?: AggregateStats;
  error?: string;
}
