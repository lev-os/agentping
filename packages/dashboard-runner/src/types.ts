/**
 * Type definitions for dashboard-runner
 */

import type { ChildProcess } from 'child_process';

export interface DashboardMetadata {
  lane: 'ops' | 'interaction' | 'development' | 'apps';
  openMode: 'embed' | 'external' | 'simulator';
  description: string;
  primary?: boolean;
  runtime?: string;
  framework?: string;
  packageManager?: string;
  lifecycle?: 'detected' | 'ready';
}

export interface DashboardConfig {
  name: string;
  id: string;
  port: number;
  port_range: number[];
  command: string;
  cwd: string;
  health_check: HealthCheckConfig;
  restart_policy: RestartPolicyConfig;
  env?: Record<string, string>;
  metadata?: DashboardMetadata;
}

export interface HealthCheckConfig {
  type: 'http' | 'process';
  path?: string;
  timeout_ms?: number;
  expected_status?: number | number[];
  interval_ms?: number;
}

export interface RestartPolicyConfig {
  enabled: boolean;
  max_retries: number;
  backoff_ms: number[];
}

export interface DashboardProcess {
  process: ChildProcess;
  port: number;
  config: DashboardConfig;
  startedAt: Date;
  pid: number;
}

export interface DashboardStatus {
  id: string;
  status: 'starting' | 'online' | 'restarting' | 'failed' | 'stopped';
  port?: number;
  pid?: number;
  startedAt?: Date;
  restartAttempts: number;
  lastHealthCheck?: Date;
  healthy?: boolean;
  crashes?: number;
}

export interface RunnerConfig {
  configPath: string;
  logDir?: string;
  stateDir?: string;
}

export interface RunnerState {
  startedAt: string;
  dashboards: Record<string, DashboardStatus>;
}

export interface HealthStatus {
  healthy: boolean;
  process: boolean;
  http: boolean;
  checkedAt: Date;
}

export type DashboardEvent =
  | { type: 'process_started'; dashboardId: string; port: number; pid: number }
  | { type: 'process_crashed'; dashboardId: string; reason: string; exitCode: number | null }
  | { type: 'restart_success'; dashboardId: string; attempts: number }
  | { type: 'restart_failed'; dashboardId: string; attempts: number }
  | { type: 'health_check_failed'; dashboardId: string; reason: string }
  | { type: 'port_changed'; dashboardId: string; oldPort: number; newPort: number }
  | { type: 'log_line'; dashboardId: string; timestamp: string; stream: 'stdout' | 'stderr'; line: string };
