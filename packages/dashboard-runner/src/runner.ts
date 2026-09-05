/**
 * Dashboard Runner
 *
 * Core orchestration for dashboard lifecycle management.
 * Inspired by ~/lev/core/daemon/src/daemon-core.ts
 */

import { EventEmitter } from 'events';
import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { homedir } from 'os';
import { parse as parseYaml } from 'yaml';
import type { DashboardConfig, DashboardStatus, RunnerConfig, RunnerState, DashboardEvent } from './types.js';
import { DashboardRegistry, registry } from './registry.js';
import { ProcessManager } from './process-manager.js';
import { HealthMonitor } from './health-monitor.js';
import { DashboardLogger } from './logger.js';

export class DashboardRunner extends EventEmitter {
  private config: RunnerConfig;
  private state: RunnerState;
  private registry: DashboardRegistry;
  private processManager: ProcessManager;
  private healthMonitor: HealthMonitor;
  private logger: DashboardLogger;
  private stateDir: string;
  private pidFile: string;
  private stateFile: string;
  private running: boolean = false;

  constructor(config: RunnerConfig) {
    super();
    this.config = config;
    this.registry = registry;

    // Initialize directories
    this.stateDir = config.stateDir || join(
      process.env.XDG_DATA_HOME || join(homedir(), '.local/share'),
      'agentping',
      'dashboard-runner',
    );
    this.pidFile = join(this.stateDir, 'runner.pid');
    this.stateFile = join(this.stateDir, 'state.json');

    // Initialize components
    this.logger = new DashboardLogger({
      logDir: config.logDir || join(this.stateDir, 'logs')
    });

    this.processManager = new ProcessManager({
      logger: this.logger,
      registry: this.registry
    });

    this.healthMonitor = new HealthMonitor({
      logger: this.logger,
      processManager: this.processManager
    });

    // Initialize state
    this.state = {
      startedAt: new Date().toISOString(),
      dashboards: {}
    };

    // Forward events from components
    this.processManager.on('process_started', (data) => {
      // Update state with port, pid, and startedAt
      if (this.state.dashboards[data.dashboardId]) {
        this.state.dashboards[data.dashboardId].port = data.port;
        this.state.dashboards[data.dashboardId].pid = data.pid;
        this.state.dashboards[data.dashboardId].startedAt = new Date();
        this.state.dashboards[data.dashboardId].status = 'online';
        this.saveState();
      }
      this.emit('process_started', data);
    });
    this.processManager.on('process_crashed', (data) => {
      // Track crash metrics and clear runtime data
      if (this.state.dashboards[data.dashboardId]) {
        this.state.dashboards[data.dashboardId].crashes =
          (this.state.dashboards[data.dashboardId].crashes || 0) + 1;
        this.state.dashboards[data.dashboardId].status = 'failed';
        this.state.dashboards[data.dashboardId].port = undefined;
        this.state.dashboards[data.dashboardId].pid = undefined;
        this.saveState();
      }
      this.emit('process_crashed', data);
    });
    this.processManager.on('process_completed', (data: { dashboardId: string; exitCode: number }) => {
      // Successful completion of a build-and-exit dashboard — terminal success state
      if (this.state.dashboards[data.dashboardId]) {
        this.state.dashboards[data.dashboardId].status = 'completed';
        this.state.dashboards[data.dashboardId].healthy = true;
        this.state.dashboards[data.dashboardId].lastExitCode = data.exitCode;
        this.state.dashboards[data.dashboardId].lastCompletedAt = new Date();
        this.state.dashboards[data.dashboardId].port = undefined;
        this.state.dashboards[data.dashboardId].pid = undefined;
        this.saveState();
      }
      this.emit('process_completed', data);
    });
    this.processManager.on('restart_success', (data) => this.emit('restart_success', data));
    this.processManager.on('restart_failed', (data) => this.emit('restart_failed', data));
    this.processManager.on('log_line', (data) => this.emit('log_line', data));
    this.healthMonitor.on('health_check_failed', (data) => this.emit('health_check_failed', data));

    // Load configuration
    this.loadConfig();
  }

  /**
   * Load dashboard configurations from YAML
   */
  private loadConfig(): void {
    const configPath = resolve(this.config.configPath);
    if (!existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    const yaml = readFileSync(configPath, 'utf-8');
    const config = parseYaml(yaml) as { dashboards: DashboardConfig[] };

    if (!config.dashboards || !Array.isArray(config.dashboards)) {
      throw new Error('Invalid config: missing dashboards array');
    }

    const projectRoot = this.findProjectRoot(dirname(configPath));
    let loadedCount = 0;

    // Register all dashboards
    for (const dashboard of config.dashboards) {
      const cwd = this.resolveDashboardCwd(dashboard, projectRoot);
      if (!cwd) {
        continue;
      }

      const normalizedDashboard = { ...dashboard, cwd };
      this.registry.register(normalizedDashboard.id, normalizedDashboard);
      this.state.dashboards[dashboard.id] = {
        id: dashboard.id,
        status: 'stopped',
        restartAttempts: 0,
        crashes: 0
      };
      loadedCount++;
    }

    this.logger.info(`Loaded ${loadedCount} dashboard configurations`);
  }

  private findProjectRoot(startDir: string): string {
    let current = startDir;

    while (true) {
      if (existsSync(join(current, 'pnpm-workspace.yaml')) && existsSync(join(current, 'package.json'))) {
        return current;
      }

      const parent = dirname(current);
      if (parent === current) {
        return process.cwd();
      }
      current = parent;
    }
  }

  private resolveDashboardCwd(dashboard: DashboardConfig, projectRoot: string): string | undefined {
    const hostWorkspace = dashboard.metadata?.host_workspace === true;
    let cwd = dashboard.cwd.split('{project_root}').join(projectRoot);

    if (cwd.includes('{host_root}')) {
      const hostRoot = process.env.AGENTPING_HOST_ROOT?.trim();
      if (!hostRoot) {
        this.logger.warn(
          `Skipping host-workspace dashboard ${dashboard.id}: set AGENTPING_HOST_ROOT to enable ${dashboard.cwd}`
        );
        return undefined;
      }
      cwd = cwd.split('{host_root}').join(this.expandHome(hostRoot));
    }

    cwd = this.expandHome(cwd);

    if (hostWorkspace && !existsSync(cwd)) {
      this.logger.warn(`Skipping host-workspace dashboard ${dashboard.id}: cwd does not exist (${cwd})`);
      return undefined;
    }

    return cwd;
  }

  private expandHome(path: string): string {
    if (path === '~') {
      return homedir();
    }

    if (path.startsWith('~/')) {
      return join(homedir(), path.slice(2));
    }

    return path;
  }

  /**
   * Start the runner and all dashboards
   */
  async start(): Promise<void> {
    if (this.running) {
      this.logger.warn('Runner already running');
      return;
    }

    this.logger.info('Starting dashboard runner...');

    // Check for existing runner
    if (this.isAlreadyRunning()) {
      throw new Error('Another runner is already running');
    }

    // Create state directory
    mkdirSync(this.stateDir, { recursive: true });

    // Write PID file
    writeFileSync(this.pidFile, String(process.pid));

    // Set up signal handlers
    this.setupSignalHandlers();

    this.running = true;

    // Start all dashboards
    const dashboards = this.registry.list();
    for (const dashboard of dashboards) {
      try {
        await this.processManager.start(dashboard.id, dashboard);
        this.state.dashboards[dashboard.id].status = 'online';
      } catch (err) {
        this.logger.error(`Failed to start ${dashboard.id}: ${err instanceof Error ? err.message : String(err)}`);
        this.state.dashboards[dashboard.id].status = 'failed';
      }
    }

    // Start health monitoring
    for (const dashboard of dashboards) {
      this.healthMonitor.startMonitoring(
        dashboard.id,
        dashboard.health_check.interval_ms || 10000
      );
    }

    this.saveState();
    this.logger.info('Dashboard runner started');
  }

  /**
   * Stop the runner and all dashboards
   */
  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    this.logger.info('Stopping dashboard runner...');
    this.running = false;

    // Stop health monitoring
    this.healthMonitor.stopAll();

    // Stop all dashboards
    const dashboards = this.registry.list();
    for (const dashboard of dashboards) {
      try {
        await this.processManager.stop(dashboard.id);
        this.state.dashboards[dashboard.id].status = 'stopped';
      } catch (err) {
        this.logger.error(`Failed to stop ${dashboard.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Remove PID file
    if (existsSync(this.pidFile)) {
      try {
        unlinkSync(this.pidFile);
      } catch (err) {
        this.logger.warn(`Failed to remove PID file: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    this.saveState();
    this.logger.info('Dashboard runner stopped');
  }

  /**
   * Restart a specific dashboard
   */
  async restart(dashboardId: string): Promise<void> {
    const config = this.registry.get(dashboardId);
    if (!config) {
      throw new Error(`Dashboard not found: ${dashboardId}`);
    }

    this.logger.info(`Restarting dashboard: ${dashboardId}`);
    await this.processManager.restart(dashboardId, config);
  }

  /**
   * Restart all dashboards
   */
  async restartAll(): Promise<Array<{ id: string; success: boolean; error?: string }>> {
    const configs = this.registry.list();
    const results: Array<{ id: string; success: boolean; error?: string }> = [];

    this.logger.info(`Restarting all dashboards (${configs.length} total)`);

    for (const config of configs) {
      try {
        await this.processManager.restart(config.id, config);
        results.push({ id: config.id, success: true });
        this.logger.info(`Restarted dashboard: ${config.id}`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        results.push({ id: config.id, success: false, error: errorMsg });
        this.logger.error(`Failed to restart ${config.id}: ${errorMsg}`);
      }
    }

    return results;
  }

  /**
   * Get status of a dashboard
   */
  getStatus(dashboardId: string): DashboardStatus | undefined {
    return this.state.dashboards[dashboardId];
  }

  /**
   * Get status of all dashboards
   */
  getAllStatus(): Record<string, DashboardStatus> {
    return { ...this.state.dashboards };
  }

  /**
   * Get dashboard config
   */
  getConfig(dashboardId: string): DashboardConfig | undefined {
    return this.registry.get(dashboardId);
  }

  /**
   * Get all dashboard configs
   */
  getAllConfigs(): DashboardConfig[] {
    return this.registry.list();
  }

  /**
   * Register a new dashboard config at runtime.
   */
  async registerDashboard(config: DashboardConfig): Promise<void> {
    if (this.registry.has(config.id)) {
      throw new Error(`Dashboard already exists: ${config.id}`);
    }

    const normalizedConfig = {
      ...config,
      cwd:
        config.cwd && config.cwd.startsWith('~')
          ? config.cwd.replace(/^~/, homedir())
          : config.cwd,
    };

    this.registry.register(normalizedConfig.id, normalizedConfig);
    this.state.dashboards[normalizedConfig.id] = {
      id: normalizedConfig.id,
      status: 'stopped',
      restartAttempts: 0,
      crashes: 0,
    };

    if (this.running) {
      await this.processManager.start(normalizedConfig.id, normalizedConfig);
      this.state.dashboards[normalizedConfig.id] = {
        ...this.state.dashboards[normalizedConfig.id],
        status: 'online',
      };
      this.healthMonitor.startMonitoring(
        normalizedConfig.id,
        normalizedConfig.health_check.interval_ms || 10000,
      );
    }

    this.saveState();
  }

  /**
   * Unregister a dashboard config at runtime.
   */
  async unregisterDashboard(dashboardId: string): Promise<void> {
    if (!this.registry.has(dashboardId)) {
      throw new Error(`Dashboard not found: ${dashboardId}`);
    }

    if (this.running) {
      this.healthMonitor.stopMonitoring(dashboardId);
      try {
        await this.processManager.stop(dashboardId);
      } catch {
        // Best-effort stop before registry removal.
      }
    }

    this.registry.unregister(dashboardId);
    delete this.state.dashboards[dashboardId];
    this.saveState();
  }

  /**
   * Check if another runner is already running
   */
  private isAlreadyRunning(): boolean {
    if (!existsSync(this.pidFile)) {
      return false;
    }

    try {
      const pid = parseInt(readFileSync(this.pidFile, 'utf-8').trim());
      process.kill(pid, 0); // Check if process exists
      return true;
    } catch {
      // Process doesn't exist, clean up stale PID file
      unlinkSync(this.pidFile);
      return false;
    }
  }

  /**
   * Set up signal handlers for graceful shutdown
   */
  private setupSignalHandlers(): void {
    let shuttingDown = false;

    const gracefulShutdown = async (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;

      this.logger.info(`Received ${signal}, shutting down gracefully...`);
      try {
        await this.stop();
        process.exit(0);
      } catch (err) {
        this.logger.error(`Shutdown error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

    process.on('uncaughtException', async (err) => {
      this.logger.error(`Uncaught exception: ${err.message}`);
      if (!shuttingDown) {
        shuttingDown = true;
        try {
          await this.stop();
        } catch {
          // Ignore errors during emergency shutdown
        }
      }
      process.exit(1);
    });
  }

  /**
   * Save runner state to disk
   */
  private saveState(): void {
    try {
      writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    } catch (err) {
      this.logger.error(`Failed to save state: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  /**
   * Update dashboard status
   */
  updateStatus(dashboardId: string, updates: Partial<DashboardStatus>): void {
    if (this.state.dashboards[dashboardId]) {
      this.state.dashboards[dashboardId] = {
        ...this.state.dashboards[dashboardId],
        ...updates
      };
      this.saveState();
    }
  }
}
