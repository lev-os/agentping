/**
 * Process Manager
 *
 * Dashboard process lifecycle with auto-restart and exponential backoff
 */

import { spawn, type ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import type { DashboardConfig, DashboardProcess } from './types.js';
import type { DashboardRegistry } from './registry.js';
import type { DashboardLogger } from './logger.js';
import { PortFinder } from './port-finder.js';

export interface ProcessManagerConfig {
  logger: DashboardLogger;
  registry: DashboardRegistry;
}

export class ProcessManager extends EventEmitter {
  private logger: DashboardLogger;
  private registry: DashboardRegistry;
  private portFinder: PortFinder;
  private processes = new Map<string, DashboardProcess>();
  private restartAttempts = new Map<string, number>();
  private restartTimers = new Map<string, NodeJS.Timeout>();

  constructor(config: ProcessManagerConfig) {
    super();
    this.logger = config.logger;
    this.registry = config.registry;
    this.portFinder = new PortFinder();
  }

  /**
   * Start a dashboard process
   */
  async start(dashboardId: string, config: DashboardConfig): Promise<void> {
    // Get ports already allocated by this runner
    const allocatedPorts = Array.from(this.processes.values()).map(p => p.port);

    // Find available port
    const port = await this.portFinder.findAvailablePort(
      config.port,
      config.port_range,
      allocatedPorts
    );

    // Build command with port
    const command = config.command.replace('{port}', String(port));

    this.logger.info(`Starting dashboard: ${dashboardId} on port ${port}`, { dashboardId });
    this.logger.debug(`Command: ${command}`, { dashboardId });

    // Spawn process
    const child = spawn(command, {
      cwd: config.cwd,
      shell: true,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, ...config.env, PORT: String(port) }
    });

    if (!child.pid) {
      throw new Error(`Failed to spawn process for ${dashboardId}`);
    }

    // Capture stdout
    child.stdout?.on('data', (data) => {
      const lines = data.toString().split('\n').filter((l: string) => l.trim());
      for (const line of lines) {
        this.logger.info(line, { dashboardId });
        this.emit('log_line', {
          dashboardId,
          timestamp: new Date().toISOString(),
          stream: 'stdout',
          line
        });
      }
    });

    // Capture stderr
    child.stderr?.on('data', (data) => {
      const lines = data.toString().split('\n').filter((l: string) => l.trim());
      for (const line of lines) {
        this.logger.error(line, { dashboardId });
        this.emit('log_line', {
          dashboardId,
          timestamp: new Date().toISOString(),
          stream: 'stderr',
          line
        });
      }
    });

    // Monitor exit
    child.on('exit', (code, signal) => {
      const reason = signal ? `signal ${signal}` : `exit code ${code}`;
      this.logger.warn(`Dashboard ${dashboardId} exited: ${reason}`, { dashboardId });

      this.processes.delete(dashboardId);

      this.emit('process_crashed', {
        dashboardId,
        reason,
        exitCode: code
      });

      // Auto-restart if enabled
      if (config.restart_policy.enabled) {
        this.scheduleRestart(dashboardId, config);
      }
    });

    // Store process
    const dashboardProcess: DashboardProcess = {
      process: child,
      port,
      config,
      startedAt: new Date(),
      pid: child.pid
    };

    this.processes.set(dashboardId, dashboardProcess);

    this.emit('process_started', {
      dashboardId,
      port,
      pid: child.pid
    });

    this.logger.info(`Dashboard ${dashboardId} started successfully (PID: ${child.pid}, Port: ${port})`, { dashboardId });
  }

  /**
   * Stop a dashboard process
   */
  async stop(dashboardId: string): Promise<void> {
    const dashboardProcess = this.processes.get(dashboardId);
    if (!dashboardProcess) {
      return;
    }

    this.logger.info(`Stopping dashboard: ${dashboardId}`, { dashboardId });

    // Clear any pending restart
    const restartTimer = this.restartTimers.get(dashboardId);
    if (restartTimer) {
      clearTimeout(restartTimer);
      this.restartTimers.delete(dashboardId);
    }

    // Kill process group (negative PID on Unix kills entire process tree)
    try {
      const pid = dashboardProcess.process.pid;
      if (pid) {
        // Kill entire process group
        try {
          process.kill(-pid, 'SIGTERM');
        } catch (err) {
          // Already exited/no such process should not block stop flow
          const message = err instanceof Error ? err.message : String(err);
          if (!message.includes('ESRCH')) {
            this.logger.warn(`SIGTERM failed for ${dashboardId}: ${message}`, { dashboardId });
          }
        }
      }

      // Wait for process to exit (with timeout)
      await new Promise<void>((resolve) => {
        let settled = false;
        const complete = () => {
          if (settled) return;
          settled = true;
          resolve();
        };

        const timeout = setTimeout(() => {
          // Force kill if still running
          if (!dashboardProcess.process.killed && pid) {
            this.logger.warn(`Force killing dashboard: ${dashboardId}`, { dashboardId });
            try {
              process.kill(-pid, 'SIGKILL');
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              if (!message.includes('ESRCH')) {
                this.logger.warn(`SIGKILL failed for ${dashboardId}: ${message}`, { dashboardId });
              }
            }
          }
          complete();
        }, 5000);

        dashboardProcess.process.once('exit', () => {
          clearTimeout(timeout);
          complete();
        });
      });

      this.processes.delete(dashboardId);
      this.logger.info(`Dashboard ${dashboardId} stopped`, { dashboardId });
    } catch (err) {
      this.logger.error(`Failed to stop ${dashboardId}: ${err instanceof Error ? err.message : String(err)}`, { dashboardId });
    } finally {
      // Ensure stale process entries never block future restarts
      this.processes.delete(dashboardId);
    }
  }

  /**
   * Restart a dashboard with exponential backoff
   */
  async restart(dashboardId: string, config: DashboardConfig): Promise<void> {
    // Stop current process if running
    await this.stop(dashboardId);

    // Get current attempt count
    const attempts = this.restartAttempts.get(dashboardId) || 0;

    if (attempts >= config.restart_policy.max_retries) {
      this.logger.error(`Dashboard ${dashboardId} exceeded max retries (${attempts})`, { dashboardId });
      this.emit('restart_failed', { dashboardId, attempts });
      this.restartAttempts.set(dashboardId, 0); // Reset for future manual restarts
      return;
    }

    // Calculate backoff delay
    const backoffMs = config.restart_policy.backoff_ms[attempts] || 16000;
    this.logger.info(`Restarting ${dashboardId} in ${backoffMs}ms (attempt ${attempts + 1}/${config.restart_policy.max_retries})`, { dashboardId });

    // Schedule restart
    const timer = setTimeout(async () => {
      this.restartTimers.delete(dashboardId);

      try {
        await this.start(dashboardId, config);
        this.restartAttempts.set(dashboardId, 0); // Reset on success
        this.emit('restart_success', { dashboardId, attempts: attempts + 1 });
      } catch (err) {
        this.logger.error(`Restart failed for ${dashboardId}: ${err instanceof Error ? err.message : String(err)}`, { dashboardId });
        this.restartAttempts.set(dashboardId, attempts + 1);
        await this.restart(dashboardId, config); // Recursive retry
      }
    }, backoffMs);

    this.restartTimers.set(dashboardId, timer);
  }

  /**
   * Schedule a restart (private helper)
   */
  private scheduleRestart(dashboardId: string, config: DashboardConfig): void {
    // Increment attempt count
    const attempts = this.restartAttempts.get(dashboardId) || 0;
    this.restartAttempts.set(dashboardId, attempts + 1);

    // Restart
    this.restart(dashboardId, config);
  }

  /**
   * Get a dashboard process
   */
  getProcess(dashboardId: string): DashboardProcess | undefined {
    return this.processes.get(dashboardId);
  }

  /**
   * Check if a dashboard is running
   */
  isRunning(dashboardId: string): boolean {
    const process = this.processes.get(dashboardId);
    return process !== undefined && !process.process.killed;
  }

  /**
   * Get restart attempt count
   */
  getRestartAttempts(dashboardId: string): number {
    return this.restartAttempts.get(dashboardId) || 0;
  }
}
