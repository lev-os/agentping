/**
 * Dashboard REST API Routes
 *
 * Provides CRUD operations for dashboard management
 */

import { Hono } from 'hono';
import { z } from 'zod';
import type { DashboardRunner } from '@lev-os/dashboard-runner';

// ============================================================================
// Request Schemas
// ============================================================================

const CreateDashboardSchema = z.object({
  config: z.object({
    id: z.string(),
    name: z.string(),
    command: z.string(),
    cwd: z.string(),
    port_range: z.tuple([z.number(), z.number()]),
    health_check: z.object({
      type: z.enum(['http', 'process']),
      path: z.string().optional(),
      timeout_ms: z.number().optional(),
      expected_status: z.union([z.number(), z.array(z.number())]).optional(),
      interval_ms: z.number().optional(),
    }).optional(),
    restart_policy: z.object({
      enabled: z.boolean(),
      max_retries: z.number(),
      backoff_ms: z.array(z.number()),
    }).optional(),
    env: z.record(z.string(), z.string()).optional(),
  }),
});

// ============================================================================
// Dashboard Routes Factory
// ============================================================================

export interface DashboardRoutesConfig {
  runner: DashboardRunner;
}

export function createDashboardRoutes(config: DashboardRoutesConfig) {
  const { runner } = config;
  const app = new Hono();

  // =========================================================================
  // GET /api/dashboards - List all dashboards
  // =========================================================================

  app.get('/', (c) => {
    try {
      const allStatus = runner.getAllStatus();
      const allConfigs = runner.getAllConfigs();

      if (!allStatus) {
        return c.json({ dashboards: [] });
      }

      // Create a map of configs by id for quick lookup
      const configMap = new Map(allConfigs.map(cfg => [cfg.id, cfg]));

      const dashboards = Object.values(allStatus).map((status) => ({
        id: status.id,
        config: configMap.get(status.id),
        status: {
          status: status.status,
          port: status.port,
          pid: status.pid,
          startedAt: status.startedAt?.toISOString(),
          restartAttempts: status.restartAttempts,
          healthy: status.healthy,
          lastHealthCheck: status.lastHealthCheck?.toISOString(),
        },
      }));

      return c.json(dashboards);
    } catch (error) {
      console.error('Error listing dashboards:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // GET /api/dashboards/:id - Get single dashboard status
  // =========================================================================

  app.get('/:id', (c) => {
    try {
      const id = c.req.param('id');
      const allStatus = runner.getAllStatus();
      const config = runner.getConfig(id);

      if (!allStatus || !allStatus[id]) {
        return c.json({ error: 'Dashboard not found' }, 404);
      }

      const status = allStatus[id];

      return c.json({
        id: status.id,
        config,
        status: {
          status: status.status,
          port: status.port,
          pid: status.pid,
          startedAt: status.startedAt?.toISOString(),
          restartAttempts: status.restartAttempts,
          healthy: status.healthy,
          lastHealthCheck: status.lastHealthCheck?.toISOString(),
        },
      });
    } catch (error) {
      console.error('Error getting dashboard:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // POST /api/dashboards/:id/restart - Restart dashboard
  // =========================================================================

  app.post('/:id/restart', async (c) => {
    try {
      const id = c.req.param('id');

      await runner.restart(id);

      return c.json({ success: true, message: `Dashboard ${id} restart initiated` });
    } catch (error) {
      console.error('Error restarting dashboard:', error);

      if ((error as Error).message?.includes('not found')) {
        return c.json({ error: 'Dashboard not found' }, 404);
      }

      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // GET /api/dashboards/:id/metrics - Get dashboard metrics
  // =========================================================================

  app.get('/:id/metrics', (c) => {
    try {
      const id = c.req.param('id');
      const allStatus = runner.getAllStatus();

      if (!allStatus || !allStatus[id]) {
        return c.json({ error: 'Dashboard not found' }, 404);
      }

      const status = allStatus[id];

      // Calculate uptime if dashboard is running
      let uptime_ms = 0;
      if (status.startedAt && status.status === 'online') {
        uptime_ms = Date.now() - status.startedAt.getTime();
      }

      return c.json({
        uptime_ms,
        restarts: status.restartAttempts,
        crashes: status.crashes || 0,
        last_health_check: status.lastHealthCheck?.toISOString(),
        healthy: status.healthy ?? false,
      });
    } catch (error) {
      console.error('Error getting metrics:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  return app;
}
