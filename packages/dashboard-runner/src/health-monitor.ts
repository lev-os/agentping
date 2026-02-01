/**
 * Health Monitor
 *
 * HTTP and process health checking
 */

import { EventEmitter } from 'events';
import type { DashboardProcess, HealthCheckConfig, HealthStatus } from './types.js';
import type { DashboardLogger } from './logger.js';
import type { ProcessManager } from './process-manager.js';

export interface HealthMonitorConfig {
  logger: DashboardLogger;
  processManager: ProcessManager;
}

export class HealthMonitor extends EventEmitter {
  private logger: DashboardLogger;
  private processManager: ProcessManager;
  private timers = new Map<string, NodeJS.Timeout>();

  constructor(config: HealthMonitorConfig) {
    super();
    this.logger = config.logger;
    this.processManager = config.processManager;
  }

  /**
   * Check health of a dashboard
   */
  async checkHealth(dashboard: DashboardProcess): Promise<HealthStatus> {
    const processHealthy = this.checkProcessHealth(dashboard.process);
    const httpHealthy = await this.checkHttpHealth(dashboard.port, dashboard.config.health_check);

    return {
      healthy: processHealthy && httpHealthy,
      process: processHealthy,
      http: httpHealthy,
      checkedAt: new Date()
    };
  }

  /**
   * Check if process is alive
   */
  private checkProcessHealth(process: any): boolean {
    try {
      return process.pid !== undefined && !process.killed;
    } catch {
      return false;
    }
  }

  /**
   * Check HTTP health endpoint
   */
  private async checkHttpHealth(port: number, config: HealthCheckConfig): Promise<boolean> {
    if (config.type !== 'http') {
      return true; // Skip HTTP check if not configured
    }

    try {
      const url = `http://localhost:${port}${config.path || '/'}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeout_ms || 5000);

      const response = await fetch(url, {
        signal: controller.signal
      });

      clearTimeout(timeout);

      // Check expected status
      const expectedStatus = config.expected_status || 200;
      if (Array.isArray(expectedStatus)) {
        return expectedStatus.includes(response.status);
      }
      return response.status === expectedStatus;
    } catch (err) {
      // HTTP check failed
      return false;
    }
  }

  /**
   * Start monitoring a dashboard
   */
  startMonitoring(dashboardId: string, intervalMs: number = 10000): void {
    const timer = setInterval(async () => {
      const dashboard = this.processManager.getProcess(dashboardId);
      if (!dashboard) {
        this.stopMonitoring(dashboardId);
        return;
      }

      const health = await this.checkHealth(dashboard);

      if (!health.healthy) {
        const reason = !health.process
          ? 'process not running'
          : 'HTTP check failed';

        this.logger.warn(
          `Health check failed for ${dashboardId}: ${reason} (process=${health.process}, http=${health.http})`,
          { dashboardId }
        );

        this.emit('health_check_failed', { dashboardId, reason });

        // Don't trigger restart here - ProcessManager handles that via exit event
      }
    }, intervalMs);

    this.timers.set(dashboardId, timer);
    this.logger.debug(`Started health monitoring for ${dashboardId} (interval: ${intervalMs}ms)`, { dashboardId });
  }

  /**
   * Stop monitoring a dashboard
   */
  stopMonitoring(dashboardId: string): void {
    const timer = this.timers.get(dashboardId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(dashboardId);
      this.logger.debug(`Stopped health monitoring for ${dashboardId}`, { dashboardId });
    }
  }

  /**
   * Stop all monitoring
   */
  stopAll(): void {
    for (const [dashboardId, timer] of this.timers.entries()) {
      clearInterval(timer);
      this.logger.debug(`Stopped health monitoring for ${dashboardId}`, { dashboardId });
    }
    this.timers.clear();
  }
}
