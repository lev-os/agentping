/**
 * WebSocket Layer with Socket.io
 *
 * Real-time event streaming for dashboard status, logs, and health checks
 */

import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { DashboardRunner, DashboardEvent } from '@lev-os/dashboard-runner';

// ============================================================================
// WebSocket Server Configuration
// ============================================================================

export interface WebSocketConfig {
  httpServer: HTTPServer;
  runner: DashboardRunner;
  corsOrigins?: string[];
}

// ============================================================================
// Event Mappings
// ============================================================================

/**
 * Maps DashboardRunner events to Socket.io events
 */
const EVENT_MAP = {
  process_started: 'dashboard:status',
  process_crashed: 'dashboard:status',
  restart_success: 'dashboard:status',
  restart_failed: 'dashboard:status',
  health_check_failed: 'dashboard:health-failed',
  port_changed: 'dashboard:port-changed',
} as const;

// ============================================================================
// Create WebSocket Server
// ============================================================================

export function createWebSocketServer(config: WebSocketConfig) {
  const { httpServer, runner, corsOrigins = ['*'] } = config;

  console.log('[WebSocketServer] Initializing Socket.io');

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  // =========================================================================
  // Client Connection Handling
  // =========================================================================

  io.on('connection', (socket) => {
    console.log(`[WebSocketServer] Client connected: ${socket.id}`);

    // Track subscriptions per socket
    const subscriptions = new Set<string>();

    // -----------------------------------------------------------------------
    // Subscribe to specific dashboard
    // -----------------------------------------------------------------------

    socket.on('dashboard:subscribe', (data: { dashboardId: string }) => {
      const { dashboardId } = data;
      console.log(`[WebSocketServer] Client ${socket.id} subscribed to ${dashboardId}`);

      subscriptions.add(dashboardId);
      socket.join(`dashboard:${dashboardId}`);

      // Send current status immediately
      const allStatus = runner.getAllStatus();
      if (allStatus && allStatus[dashboardId]) {
        const status = allStatus[dashboardId];
        socket.emit('dashboard:status', {
          dashboardId,
          status: status.status,
          port: status.port,
          pid: status.pid,
          startedAt: status.startedAt?.toISOString(),
          restartAttempts: status.restartAttempts,
          healthy: status.healthy,
          lastHealthCheck: status.lastHealthCheck?.toISOString(),
        });
      }
    });

    // -----------------------------------------------------------------------
    // Unsubscribe from dashboard
    // -----------------------------------------------------------------------

    socket.on('dashboard:unsubscribe', (data: { dashboardId: string }) => {
      const { dashboardId } = data;
      console.log(`[WebSocketServer] Client ${socket.id} unsubscribed from ${dashboardId}`);

      subscriptions.delete(dashboardId);
      socket.leave(`dashboard:${dashboardId}`);
    });

    // -----------------------------------------------------------------------
    // Disconnect handling
    // -----------------------------------------------------------------------

    socket.on('disconnect', () => {
      console.log(`[WebSocketServer] Client disconnected: ${socket.id}`);
      subscriptions.clear();
    });
  });

  // =========================================================================
  // Forward DashboardRunner Events to WebSocket Clients
  // =========================================================================

  /**
   * Process started → broadcast status
   */
  runner.on('process_started', (data: Extract<DashboardEvent, { type: 'process_started' }>) => {
    console.log('[WebSocketServer] Broadcasting process_started:', data.dashboardId);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:status', {
      dashboardId: data.dashboardId,
      status: 'online',
      port: data.port,
      pid: data.pid,
      healthy: true,
      restartAttempts: 0,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Process crashed → broadcast status
   */
  runner.on('process_crashed', (data: Extract<DashboardEvent, { type: 'process_crashed' }>) => {
    console.log('[WebSocketServer] Broadcasting process_crashed:', data.dashboardId);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:status', {
      dashboardId: data.dashboardId,
      status: 'failed',
      healthy: false,
      reason: data.reason,
      exitCode: data.exitCode,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Restart success → broadcast status
   */
  runner.on('restart_success', (data: Extract<DashboardEvent, { type: 'restart_success' }>) => {
    console.log('[WebSocketServer] Broadcasting restart_success:', data.dashboardId);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:status', {
      dashboardId: data.dashboardId,
      status: 'online',
      healthy: true,
      restartAttempts: data.attempts,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Restart failed → broadcast status
   */
  runner.on('restart_failed', (data: Extract<DashboardEvent, { type: 'restart_failed' }>) => {
    console.log('[WebSocketServer] Broadcasting restart_failed:', data.dashboardId);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:status', {
      dashboardId: data.dashboardId,
      status: 'failed',
      healthy: false,
      restartAttempts: data.attempts,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Health check failed → broadcast health event
   */
  runner.on('health_check_failed', (data: Extract<DashboardEvent, { type: 'health_check_failed' }>) => {
    console.log('[WebSocketServer] Broadcasting health_check_failed:', data.dashboardId);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:health-failed', {
      dashboardId: data.dashboardId,
      reason: data.reason,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Port changed → broadcast port change event
   */
  runner.on('port_changed', (data: Extract<DashboardEvent, { type: 'port_changed' }>) => {
    console.log('[WebSocketServer] Broadcasting port_changed:', data.dashboardId);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:port-changed', {
      dashboardId: data.dashboardId,
      oldPort: data.oldPort,
      newPort: data.newPort,
      reason: 'port_reassigned',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * Log line → stream to subscribed clients
   */
  runner.on('log_line', (data: Extract<DashboardEvent, { type: 'log_line' }>) => {
    console.log(`[WebSocketServer] Broadcasting log_line: ${data.dashboardId} - ${data.line.substring(0, 50)}...`);

    io.to(`dashboard:${data.dashboardId}`).emit('dashboard:log-line', {
      dashboardId: data.dashboardId,
      timestamp: data.timestamp,
      stream: data.stream,
      line: data.line,
    });
  });

  console.log('[WebSocketServer] Event listeners registered');

  return {
    io,
    close: () => {
      console.log('[WebSocketServer] Closing Socket.io server');
      io.close();
    },
  };
}
