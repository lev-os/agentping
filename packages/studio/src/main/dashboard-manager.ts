/**
 * Dashboard Manager - Main Process
 *
 * Manages dashboard processes using @lev-os/dashboard-runner
 * and forwards events to renderer processes via IPC
 */

import type { DashboardRunner, DashboardEvent } from 'dashboard-runner';
import { BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { spawn, ChildProcess } from 'child_process';
import { homedir } from 'os';
import { createReadStream, promises as fs } from 'fs';
import { createInterface } from 'readline';
import type {
    DashboardMetrics,
    RestartRecord,
    CrashRecord,
    HealthCheckRecord,
    AggregateStats,
    GetMetricsResponse,
    GetAllMetricsResponse,
    GetAggregateStatsResponse
} from '../types/dashboard';

export class DashboardManager {
    public runner: DashboardRunner | null = null;
    private configPath: string;
    private logStreams: Map<string, ChildProcess> = new Map();
    private metricsStore: Map<string, DashboardMetrics> = new Map();
    private metricsPath: string;
    private metricsTimer: NodeJS.Timeout | null = null;

    constructor() {
        // Config path relative to main process
        this.configPath = join(__dirname, '../../dashboard-runner/config/dashboards.yaml');
        this.metricsPath = join(homedir(), '.local/share/lev/dashboard-runner/metrics.json');
        console.log('[DashboardManager] Config path:', this.configPath);
        console.log('[DashboardManager] Metrics path:', this.metricsPath);
        this.setupIpcHandlers();
    }

    /**
     * Initialize and start dashboard runner
     */
    async start(): Promise<void> {
        try {
            console.log('[DashboardManager] Starting dashboard runner...');

            // Load existing metrics
            await this.loadMetrics();

            // Dynamic import to handle ESM package
            const { DashboardRunner } = await import('dashboard-runner');
            this.runner = new DashboardRunner({
                configPath: this.configPath
            });

            // Forward events to all renderer windows and track metrics
            this.runner.on('process_started', (data: Extract<DashboardEvent, { type: 'process_started' }>) => {
                console.log('[DashboardManager] Process started:', data);
                this.updateMetricsOnStart(data.dashboardId, data.pid);
                this.sendToAllWindows('dashboard:process_started', data);
                this.emitMetricsUpdate(data.dashboardId);
            });

            this.runner.on('process_crashed', (data: Extract<DashboardEvent, { type: 'process_crashed' }>) => {
                console.log('[DashboardManager] Process crashed:', data);
                const status = this.runner?.getAllStatus()?.[data.dashboardId];
                this.updateMetricsOnCrash(data.dashboardId, data.reason, data.exitCode, status?.port || 0, status?.pid || 0);
                this.sendToAllWindows('dashboard:process_crashed', data);
                this.emitMetricsUpdate(data.dashboardId);
            });

            this.runner.on('restart_success', (data: Extract<DashboardEvent, { type: 'restart_success' }>) => {
                console.log('[DashboardManager] Restart success:', data);
                this.updateMetricsOnRestart(data.dashboardId, 'manual', true, data.attempts);
                this.sendToAllWindows('dashboard:restart_success', data);
                this.emitMetricsUpdate(data.dashboardId);
            });

            this.runner.on('restart_failed', (data: Extract<DashboardEvent, { type: 'restart_failed' }>) => {
                console.log('[DashboardManager] Restart failed:', data);
                this.updateMetricsOnRestart(data.dashboardId, 'crash', false, data.attempts);
                this.sendToAllWindows('dashboard:restart_failed', data);
                this.emitMetricsUpdate(data.dashboardId);
            });

            this.runner.on('health_check_failed', (data: Extract<DashboardEvent, { type: 'health_check_failed' }>) => {
                console.log('[DashboardManager] Health check failed:', data);
                this.updateMetricsOnHealthCheck(data.dashboardId, false, undefined, undefined, data.reason);
                this.sendToAllWindows('dashboard:health_check_failed', data);
                this.emitMetricsUpdate(data.dashboardId);
            });

            this.runner.on('port_changed', (data: Extract<DashboardEvent, { type: 'port_changed' }>) => {
                console.log('[DashboardManager] Port changed:', data);
                this.sendToAllWindows('dashboard:port_changed', data);
            });

            // Start all dashboards
            await this.runner.start();
            console.log('[DashboardManager] Dashboard runner started successfully');

            // Start auto-save timer (every 60s)
            this.metricsTimer = setInterval(() => {
                this.saveMetrics().catch(err => {
                    console.error('[DashboardManager] Failed to auto-save metrics:', err);
                });
            }, 60000);

        } catch (err) {
            console.error('[DashboardManager] Failed to start:', err);
            throw err;
        }
    }

    /**
     * Stop dashboard runner and all processes
     */
    async stop(): Promise<void> {
        // Stop auto-save timer
        if (this.metricsTimer) {
            clearInterval(this.metricsTimer);
            this.metricsTimer = null;
        }

        // Save metrics one last time
        await this.saveMetrics();

        if (this.runner) {
            console.log('[DashboardManager] Stopping dashboard runner...');
            await this.runner.stop();
            this.runner = null;
            console.log('[DashboardManager] Dashboard runner stopped');
        }

        // Clean up log streams
        this.logStreams.forEach((proc, id) => {
            console.log(`[DashboardManager] Killing log stream for ${id}`);
            proc.kill();
        });
        this.logStreams.clear();
    }

    /**
     * Restart a specific dashboard
     */
    async restart(dashboardId: string): Promise<void> {
        if (this.runner) {
            console.log(`[DashboardManager] Restarting dashboard: ${dashboardId}`);
            await this.runner.restart(dashboardId);
        } else {
            console.warn('[DashboardManager] Cannot restart - runner not initialized');
        }
    }

    /**
     * Get status of all dashboards
     */
    getAllStatus(): Record<string, any> | null {
        if (this.runner) {
            return this.runner.getAllStatus();
        }
        return null;
    }

    /**
     * Send event to all renderer windows
     */
    private sendToAllWindows(channel: string, data: any): void {
        const windows = BrowserWindow.getAllWindows();
        windows.forEach(win => {
            if (win && !win.isDestroyed()) {
                win.webContents.send(channel, data);
            }
        });
    }

    /**
     * Setup IPC handlers for dashboard operations
     */
    private setupIpcHandlers(): void {
        // Stream logs for a specific dashboard
        ipcMain.handle('dashboard:stream-logs', async (event, { dashboardId, lines = 100, follow = true }) => {
            try {
                // Validate dashboardId to prevent path traversal
                if (!/^[a-z0-9-]+$/i.test(dashboardId)) {
                    throw new Error('Invalid dashboard ID format');
                }

                const logPath = join(homedir(), '.local/share/lev/dashboard-runner/logs', `${dashboardId}.log`);
                console.log('[DashboardManager] Streaming logs from:', logPath);

                // Stop existing stream for this dashboard if any
                this.stopLogStream(dashboardId);

                // Send historical lines first
                await this.sendHistoricalLogs(event.sender, dashboardId, logPath, lines);

                // Start tail -f for live streaming if requested
                if (follow) {
                    this.startLogStream(event.sender, dashboardId, logPath);
                }

                return { success: true };
            } catch (err) {
                console.error('[DashboardManager] Stream logs error:', err);
                event.sender.send('dashboard:log-stream-error', {
                    dashboardId,
                    error: err instanceof Error ? err.message : String(err)
                });
                return { success: false, error: err instanceof Error ? err.message : String(err) };
            }
        });

        // Stop log streaming
        ipcMain.handle('dashboard:stop-stream-logs', async (event, { dashboardId }) => {
            this.stopLogStream(dashboardId);
            return { success: true };
        });

        // Metrics handlers
        ipcMain.handle('dashboard:get-metrics', async (event, { dashboardId }: { dashboardId: string }) => {
            try {
                const metrics = this.metricsStore.get(dashboardId);
                if (!metrics) {
                    return {
                        success: false,
                        error: `No metrics found for dashboard: ${dashboardId}`
                    } as GetMetricsResponse;
                }
                return {
                    success: true,
                    metrics: this.calculateDerivedMetrics(metrics)
                } as GetMetricsResponse;
            } catch (err) {
                return {
                    success: false,
                    error: (err as Error).message
                } as GetMetricsResponse;
            }
        });

        ipcMain.handle('dashboard:get-all-metrics', async () => {
            try {
                const allMetrics: Record<string, DashboardMetrics> = {};
                this.metricsStore.forEach((metrics, id) => {
                    allMetrics[id] = this.calculateDerivedMetrics(metrics);
                });
                return {
                    success: true,
                    metrics: allMetrics
                } as GetAllMetricsResponse;
            } catch (err) {
                return {
                    success: false,
                    error: (err as Error).message
                } as GetAllMetricsResponse;
            }
        });

        ipcMain.handle('dashboard:get-aggregate-stats', async () => {
            try {
                const stats = this.calculateAggregateStats();
                return {
                    success: true,
                    stats
                } as GetAggregateStatsResponse;
            } catch (err) {
                return {
                    success: false,
                    error: (err as Error).message
                } as GetAggregateStatsResponse;
            }
        });
    }

    /**
     * Send historical log lines from file
     */
    private async sendHistoricalLogs(sender: Electron.WebContents, dashboardId: string, logPath: string, lines: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const tailProc = spawn('tail', ['-n', String(lines), logPath]);
            let lineNumber = 0;

            tailProc.stdout.on('data', (data) => {
                const logLines = data.toString().split('\n').filter(Boolean);
                logLines.forEach((line: string) => {
                    const parsedLog = this.parseLogLine(line, lineNumber++);
                    sender.send('dashboard:log-line', {
                        dashboardId,
                        ...parsedLog
                    });
                });
            });

            tailProc.stderr.on('data', (data) => {
                console.error('[DashboardManager] tail stderr:', data.toString());
            });

            tailProc.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`tail exited with code ${code}`));
                }
            });

            tailProc.on('error', (err) => {
                reject(err);
            });
        });
    }

    /**
     * Start streaming new log lines with tail -f
     */
    private startLogStream(sender: Electron.WebContents, dashboardId: string, logPath: string): void {
        const tailProc = spawn('tail', ['-f', logPath]);
        let lineNumber = 0;

        tailProc.stdout.on('data', (data) => {
            const logLines = data.toString().split('\n').filter(Boolean);
            logLines.forEach((line: string) => {
                const parsedLog = this.parseLogLine(line, lineNumber++);
                sender.send('dashboard:log-line', {
                    dashboardId,
                    ...parsedLog
                });
            });
        });

        tailProc.stderr.on('data', (data) => {
            console.error('[DashboardManager] tail -f stderr:', data.toString());
        });

        tailProc.on('error', (err) => {
            console.error('[DashboardManager] tail -f error:', err);
            sender.send('dashboard:log-stream-error', {
                dashboardId,
                error: err.message
            });
        });

        tailProc.on('close', (code) => {
            console.log(`[DashboardManager] tail -f closed for ${dashboardId} with code ${code}`);
            sender.send('dashboard:log-stream-end', {
                dashboardId,
                totalLines: lineNumber
            });
        });

        this.logStreams.set(dashboardId, tailProc);
    }

    /**
     * Stop log streaming for a dashboard
     */
    private stopLogStream(dashboardId: string): void {
        const proc = this.logStreams.get(dashboardId);
        if (proc) {
            proc.kill();
            this.logStreams.delete(dashboardId);
            console.log(`[DashboardManager] Stopped log stream for ${dashboardId}`);
        }
    }

    /**
     * Parse log line and detect level
     */
    private parseLogLine(line: string, lineNumber: number): { timestamp: string; level: string; message: string; line: number } {
        // Detect log level from line content
        let level = 'info';
        if (/ERROR|error|ERR/i.test(line)) {
            level = 'error';
        } else if (/WARN|warn|warning/i.test(line)) {
            level = 'warn';
        } else if (/DEBUG|debug/i.test(line)) {
            level = 'debug';
        }

        // Try to extract timestamp (ISO format or common patterns)
        const timestampMatch = line.match(/(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d{3})?)/);
        const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString();

        // Sanitize message (escape HTML to prevent injection)
        const message = line
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');

        return { timestamp, level, message, line: lineNumber };
    }

    /**
    /**
     * Initialize metrics for a dashboard
     */
    private initializeMetrics(dashboardId: string): DashboardMetrics {
        const now = new Date();
        const metrics: DashboardMetrics = {
            dashboardId,
            uptime: 0,
            totalUptime: 0,
            startedAt: now,
            firstStartedAt: now,
            totalRestarts: 0,
            restartHistory: [],
            currentRestartAttempts: 0,
            totalCrashes: 0,
            crashHistory: [],
            healthCheckHistory: [],
            healthCheckSuccess: 0,
            healthCheckFailed: 0,
            healthCheckRate: 0
        };
        this.metricsStore.set(dashboardId, metrics);
        return metrics;
    }

    /**
     * Update metrics when process starts
     */
    private updateMetricsOnStart(dashboardId: string, pid: number): void {
        let metrics = this.metricsStore.get(dashboardId);
        if (!metrics) {
            metrics = this.initializeMetrics(dashboardId);
        }
        const now = new Date();
        metrics.startedAt = now;
        metrics.currentRestartAttempts = 0;
        console.log(`[DashboardManager] Metrics updated for ${dashboardId} start (PID: ${pid})`);
    }

    /**
     * Update metrics when process crashes
     */
    private updateMetricsOnCrash(
        dashboardId: string,
        reason: string,
        exitCode: number | null,
        port: number,
        pid: number
    ): void {
        let metrics = this.metricsStore.get(dashboardId);
        if (!metrics) {
            metrics = this.initializeMetrics(dashboardId);
        }

        const now = new Date();
        const uptime = now.getTime() - metrics.startedAt.getTime();

        const crashRecord: CrashRecord = {
            timestamp: now,
            reason,
            exitCode,
            uptime,
            port,
            pid
        };

        metrics.totalCrashes++;
        metrics.lastCrashTime = now;
        metrics.crashHistory.unshift(crashRecord);

        // Keep only last 50 crashes
        if (metrics.crashHistory.length > 50) {
            metrics.crashHistory = metrics.crashHistory.slice(0, 50);
        }

        // Update total uptime
        metrics.totalUptime += uptime;

        console.log(`[DashboardManager] Metrics updated for ${dashboardId} crash`);
    }

    /**
     * Update metrics when restart happens
     */
    private updateMetricsOnRestart(
        dashboardId: string,
        reason: 'crash' | 'manual' | 'health_failure',
        success: boolean,
        attempts: number
    ): void {
        let metrics = this.metricsStore.get(dashboardId);
        if (!metrics) {
            metrics = this.initializeMetrics(dashboardId);
        }

        const now = new Date();
        const previousUptime = now.getTime() - metrics.startedAt.getTime();

        const restartRecord: RestartRecord = {
            timestamp: now,
            reason,
            previousUptime,
            attempts,
            success
        };

        if (success) {
            metrics.totalRestarts++;
        }
        metrics.currentRestartAttempts = attempts;
        metrics.restartHistory.unshift(restartRecord);

        // Keep only last 100 restarts
        if (metrics.restartHistory.length > 100) {
            metrics.restartHistory = metrics.restartHistory.slice(0, 100);
        }

        console.log(`[DashboardManager] Metrics updated for ${dashboardId} restart`);
    }

    /**
     * Update metrics when health check occurs
     */
    private updateMetricsOnHealthCheck(
        dashboardId: string,
        success: boolean,
        responseTime?: number,
        statusCode?: number,
        error?: string
    ): void {
        let metrics = this.metricsStore.get(dashboardId);
        if (!metrics) {
            metrics = this.initializeMetrics(dashboardId);
        }

        const now = new Date();
        const healthRecord: HealthCheckRecord = {
            timestamp: now,
            success,
            responseTime,
            statusCode,
            error
        };

        metrics.healthCheckHistory.unshift(healthRecord);

        // Keep only last 500 health checks
        if (metrics.healthCheckHistory.length > 500) {
            metrics.healthCheckHistory = metrics.healthCheckHistory.slice(0, 500);
        }

        if (success) {
            metrics.healthCheckSuccess++;
        } else {
            metrics.healthCheckFailed++;
        }

        console.log(`[DashboardManager] Metrics updated for ${dashboardId} health check`);
    }

    /**
     * Calculate derived metrics (uptime, health rate, etc.)
     */
    private calculateDerivedMetrics(metrics: DashboardMetrics): DashboardMetrics {
        const now = new Date();
        const currentUptime = now.getTime() - metrics.startedAt.getTime();

        const totalChecks = metrics.healthCheckSuccess + metrics.healthCheckFailed;
        const healthCheckRate = totalChecks > 0 ? metrics.healthCheckSuccess / totalChecks : 0;

        const avgResponseTime = metrics.healthCheckHistory.length > 0
            ? metrics.healthCheckHistory
                .filter(h => h.responseTime !== undefined)
                .reduce((sum, h) => sum + (h.responseTime || 0), 0) /
              metrics.healthCheckHistory.filter(h => h.responseTime !== undefined).length
            : undefined;

        return {
            ...metrics,
            uptime: currentUptime,
            healthCheckRate,
            averageResponseTime: avgResponseTime
        };
    }

    /**
     * Calculate aggregate statistics across all dashboards
     */
    private calculateAggregateStats(): AggregateStats {
        const allStatus = this.getAllStatus() || {};
        const statusValues = Object.values(allStatus);

        const runningCount = statusValues.filter((s: any) => s.status === 'running').length;
        const stoppedCount = statusValues.filter((s: any) => s.status === 'stopped').length;
        const failedCount = statusValues.filter((s: any) => s.status === 'failed').length;

        let totalRestarts = 0;
        let totalCrashes = 0;
        let totalHealthChecks = 0;
        let healthCheckSuccess = 0;
        let totalUptime = 0;
        let dashboardCount = 0;

        const now = Date.now();
        const last24h = now - 24 * 60 * 60 * 1000;
        const last7d = now - 7 * 24 * 60 * 60 * 1000;

        let last24hRestarts = 0;
        let last24hCrashes = 0;
        let last7dUptime = 0;

        this.metricsStore.forEach((metrics) => {
            dashboardCount++;
            totalRestarts += metrics.totalRestarts;
            totalCrashes += metrics.totalCrashes;
            totalHealthChecks += metrics.healthCheckSuccess + metrics.healthCheckFailed;
            healthCheckSuccess += metrics.healthCheckSuccess;
            totalUptime += metrics.uptime;

            // Time window calculations
            last24hRestarts += metrics.restartHistory.filter(r =>
                r.timestamp.getTime() > last24h
            ).length;

            last24hCrashes += metrics.crashHistory.filter(c =>
                c.timestamp.getTime() > last24h
            ).length;

            // Calculate 7-day uptime
            const metricsAge = now - metrics.firstStartedAt.getTime();
            if (metricsAge <= last7d) {
                last7dUptime += metrics.totalUptime;
            }
        });

        const averageUptime = dashboardCount > 0 ? totalUptime / dashboardCount : 0;
        const healthCheckSuccessRate = totalHealthChecks > 0 ? healthCheckSuccess / totalHealthChecks : 0;
        const fleetHealthRate = healthCheckSuccessRate;

        // Calculate average restart time from restart history
        let totalRestartTime = 0;
        let restartCount = 0;
        this.metricsStore.forEach((metrics) => {
            metrics.restartHistory.forEach((r, idx) => {
                if (idx > 0 && r.success) {
                    const prevRestart = metrics.restartHistory[idx - 1];
                    const restartTime = r.timestamp.getTime() - prevRestart.timestamp.getTime();
                    totalRestartTime += restartTime;
                    restartCount++;
                }
            });
        });
        const averageRestartTime = restartCount > 0 ? totalRestartTime / restartCount : 0;

        return {
            totalDashboards: dashboardCount,
            runningCount,
            stoppedCount,
            failedCount,
            totalRestarts,
            totalCrashes,
            averageUptime,
            fleetHealthRate,
            totalHealthChecks,
            healthCheckSuccessRate,
            averageRestartTime,
            last24hRestarts,
            last24hCrashes,
            last7dUptime
        };
    }

    /**
     * Emit metrics update event to renderer
     */
    private emitMetricsUpdate(dashboardId: string): void {
        const metrics = this.metricsStore.get(dashboardId);
        if (metrics) {
            this.sendToAllWindows('dashboard:metrics_updated', {
                type: 'metrics_updated',
                dashboardId,
                metrics: this.calculateDerivedMetrics(metrics)
            });
        }
    }

    /**
     * Load metrics from disk
     */
    private async loadMetrics(): Promise<void> {
        try {
            const data = await fs.readFile(this.metricsPath, 'utf-8');
            const parsed = JSON.parse(data);

            if (parsed.dashboards) {
                Object.entries(parsed.dashboards).forEach(([id, metrics]: [string, any]) => {
                    // Convert date strings back to Date objects
                    metrics.startedAt = new Date(metrics.startedAt);
                    metrics.firstStartedAt = new Date(metrics.firstStartedAt);
                    if (metrics.lastCrashTime) {
                        metrics.lastCrashTime = new Date(metrics.lastCrashTime);
                    }
                    metrics.restartHistory = metrics.restartHistory.map((r: any) => ({
                        ...r,
                        timestamp: new Date(r.timestamp)
                    }));
                    metrics.crashHistory = metrics.crashHistory.map((c: any) => ({
                        ...c,
                        timestamp: new Date(c.timestamp)
                    }));
                    metrics.healthCheckHistory = metrics.healthCheckHistory.map((h: any) => ({
                        ...h,
                        timestamp: new Date(h.timestamp)
                    }));

                    this.metricsStore.set(id, metrics);
                });
                console.log(`[DashboardManager] Loaded metrics for ${this.metricsStore.size} dashboards`);
            }
        } catch (err: any) {
            if (err.code !== 'ENOENT') {
                console.error('[DashboardManager] Failed to load metrics:', err);
            } else {
                console.log('[DashboardManager] No existing metrics file found, starting fresh');
            }
        }
    }

    /**
     * Save metrics to disk (atomic write)
     */
    private async saveMetrics(): Promise<void> {
        try {
            const dir = join(homedir(), '.local/share/lev/dashboard-runner');
            await fs.mkdir(dir, { recursive: true });

            const dashboards: Record<string, DashboardMetrics> = {};
            this.metricsStore.forEach((metrics, id) => {
                dashboards[id] = this.calculateDerivedMetrics(metrics);
            });

            const data = JSON.stringify({
                version: 1,
                lastUpdated: new Date().toISOString(),
                dashboards
            }, null, 2);

            const tmpPath = `${this.metricsPath}.tmp`;
            await fs.writeFile(tmpPath, data, 'utf-8');
            await fs.rename(tmpPath, this.metricsPath);

            console.log(`[DashboardManager] Saved metrics for ${this.metricsStore.size} dashboards`);
        } catch (err) {
            console.error('[DashboardManager] Failed to save metrics:', err);
            throw err;
        }
    }
}
