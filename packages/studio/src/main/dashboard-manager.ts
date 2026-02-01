/**
 * Dashboard Manager - Main Process
 *
 * Manages dashboard processes using @lev-os/dashboard-runner
 * and forwards events to renderer processes via IPC
 */

import { DashboardRunner } from 'dashboard-runner';
import type { DashboardEvent } from 'dashboard-runner';
import { BrowserWindow } from 'electron';
import { join } from 'path';

export class DashboardManager {
    private runner: DashboardRunner | null = null;
    private configPath: string;

    constructor() {
        // Config path relative to main process
        this.configPath = join(__dirname, '../../dashboard-runner/config/dashboards.yaml');
        console.log('[DashboardManager] Config path:', this.configPath);
    }

    /**
     * Initialize and start dashboard runner
     */
    async start(): Promise<void> {
        try {
            console.log('[DashboardManager] Starting dashboard runner...');

            this.runner = new DashboardRunner({
                configPath: this.configPath
            });

            // Forward events to all renderer windows
            this.runner.on('process_started', (data: Extract<DashboardEvent, { type: 'process_started' }>) => {
                console.log('[DashboardManager] Process started:', data);
                this.sendToAllWindows('dashboard:process_started', data);
            });

            this.runner.on('process_crashed', (data: Extract<DashboardEvent, { type: 'process_crashed' }>) => {
                console.log('[DashboardManager] Process crashed:', data);
                this.sendToAllWindows('dashboard:process_crashed', data);
            });

            this.runner.on('restart_success', (data: Extract<DashboardEvent, { type: 'restart_success' }>) => {
                console.log('[DashboardManager] Restart success:', data);
                this.sendToAllWindows('dashboard:restart_success', data);
            });

            this.runner.on('restart_failed', (data: Extract<DashboardEvent, { type: 'restart_failed' }>) => {
                console.log('[DashboardManager] Restart failed:', data);
                this.sendToAllWindows('dashboard:restart_failed', data);
            });

            this.runner.on('health_check_failed', (data: Extract<DashboardEvent, { type: 'health_check_failed' }>) => {
                console.log('[DashboardManager] Health check failed:', data);
                this.sendToAllWindows('dashboard:health_check_failed', data);
            });

            this.runner.on('port_changed', (data: Extract<DashboardEvent, { type: 'port_changed' }>) => {
                console.log('[DashboardManager] Port changed:', data);
                this.sendToAllWindows('dashboard:port_changed', data);
            });

            // Start all dashboards
            await this.runner.start();
            console.log('[DashboardManager] Dashboard runner started successfully');

        } catch (err) {
            console.error('[DashboardManager] Failed to start:', err);
            throw err;
        }
    }

    /**
     * Stop dashboard runner and all processes
     */
    async stop(): Promise<void> {
        if (this.runner) {
            console.log('[DashboardManager] Stopping dashboard runner...');
            await this.runner.stop();
            this.runner = null;
            console.log('[DashboardManager] Dashboard runner stopped');
        }
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
}
