/**
 * @lev-os/dashboard-runner
 *
 * Resilient process management for dashboard applications
 */

export { DashboardRunner } from './runner.js';
export { DashboardRegistry, registry } from './registry.js';
export { ProcessManager } from './process-manager.js';
export { PortFinder } from './port-finder.js';
export { HealthMonitor } from './health-monitor.js';
export { DashboardLogger } from './logger.js';
export { validateDashboardConfig, validateDashboardsConfig } from './validator.js';

export type {
  DashboardConfig,
  HealthCheckConfig,
  RestartPolicyConfig,
  DashboardProcess,
  DashboardStatus,
  RunnerConfig,
  RunnerState,
  HealthStatus,
  DashboardEvent
} from './types.js';

export type { ValidationError, ValidationResult } from './validator.js';
