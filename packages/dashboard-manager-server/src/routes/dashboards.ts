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
    port: z.number(),
    command: z.string(),
    cwd: z.string(),
    port_range: z.tuple([z.number(), z.number()]),
    health_check: z.object({
      type: z.enum(['http', 'process', 'build-and-exit']),
      path: z.string().optional(),
      timeout_ms: z.number().optional(),
      expected_status: z.union([z.number(), z.array(z.number())]).optional(),
      interval_ms: z.number().optional(),
    }),
    restart_policy: z.object({
      enabled: z.boolean(),
      max_retries: z.number(),
      backoff_ms: z.array(z.number()),
    }),
    env: z.record(z.string(), z.string()).optional(),
    metadata: z.object({
      lane: z.enum(['ops', 'interaction', 'development', 'apps']),
      openMode: z.enum(['embed', 'external', 'simulator']),
      description: z.string().min(1),
      primary: z.boolean().optional(),
      runtime: z.string().optional(),
      framework: z.string().optional(),
      packageManager: z.string().optional(),
      lifecycle: z.enum(['detected', 'ready']).optional(),
    }).optional(),
  }),
});

// ============================================================================
// Dashboard Routes Factory
// ============================================================================

export interface DashboardRoutesConfig {
  runner: DashboardRunner;
}

function serializeDashboardStatus(status: {
  status: string
  port?: number
  pid?: number
  startedAt?: Date
  restartAttempts: number
  healthy?: boolean
  lastHealthCheck?: Date
  crashes?: number
}) {
  return {
    status: status.status,
    port: status.port,
    pid: status.pid,
    startedAt: status.startedAt?.toISOString(),
    restartAttempts: status.restartAttempts,
    healthy: status.healthy,
    lastHealthCheck: status.lastHealthCheck?.toISOString(),
    crashes: status.crashes ?? 0,
  }
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
        status: serializeDashboardStatus(status),
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
        status: serializeDashboardStatus(status),
      });
    } catch (error) {
      console.error('Error getting dashboard:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // POST /api/dashboards - Register a dashboard
  // =========================================================================

  app.post('/', async (c) => {
    try {
      const body = await c.req.json();
      const parsed = CreateDashboardSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: parsed.error.flatten() }, 400);
      }

      const dashboardConfig = parsed.data.config;
      if (runner.getConfig(dashboardConfig.id)) {
        return c.json({ error: 'Dashboard already exists' }, 409);
      }

      if (!('registerDashboard' in runner) || typeof runner.registerDashboard !== 'function') {
        return c.json({ error: 'Runner does not support dashboard registration' }, 501);
      }

      await runner.registerDashboard(dashboardConfig);

      return c.json({
        id: dashboardConfig.id,
        config: dashboardConfig,
        status: {
          status: 'stopped',
          restartAttempts: 0,
          healthy: false,
        },
      }, 201);
    } catch (error) {
      console.error('Error creating dashboard:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // DELETE /api/dashboards/:id - Unregister a dashboard
  // =========================================================================

  app.delete('/:id', async (c) => {
    try {
      const id = c.req.param('id');
      if (!runner.getConfig(id)) {
        return c.json({ error: 'Dashboard not found' }, 404);
      }

      if (!('unregisterDashboard' in runner) || typeof runner.unregisterDashboard !== 'function') {
        return c.json({ error: 'Runner does not support dashboard removal' }, 501);
      }

      await runner.unregisterDashboard(id);
      return c.body(null, 204);
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // POST /api/dashboards/:id/restart - Restart dashboard
  // =========================================================================

  app.post('/:id/restart', async (c) => {
    try {
      const id = c.req.param('id');
      console.log(`[API] Restart request for dashboard: ${id}`);

      // Fire-and-track restart so the HTTP request does not block on process teardown.
      void runner.restart(id)
        .then(() => {
          console.log(`[API] Restart completed for dashboard: ${id}`);
        })
        .catch((error) => {
          console.error(`[API] Restart failed for dashboard ${id}:`, error);
        });

      return c.json(
        { success: true, message: `Dashboard ${id} restart scheduled` },
        202,
      );
    } catch (error) {
      console.error('[API] Error restarting dashboard:', error);
      console.error('[API] Error stack:', (error as Error).stack);

      if ((error as Error).message?.includes('not found')) {
        return c.json({ error: 'Dashboard not found' }, 404);
      }

      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
    }
  });

  // =========================================================================
  // POST /api/dashboards/restart-all - Restart all dashboards
  // =========================================================================

  app.post('/restart-all', async (c) => {
    try {
      console.log('[API] Restart-all request received');

      const dashboardIds = runner.getAllConfigs().map((cfg) => cfg.id);
      for (const id of dashboardIds) {
        void runner.restart(id).catch((error) => {
          console.error(`[API] Restart-all: restart failed for ${id}:`, error);
        });
      }

      return c.json({
        success: true,
        message: `Scheduled restart for ${dashboardIds.length} dashboard(s)`,
        total: dashboardIds.length,
        scheduled: dashboardIds,
      }, 202);
    } catch (error) {
      console.error('[API] Error restarting all dashboards:', error);
      console.error('[API] Error stack:', (error as Error).stack);

      return c.json({ error: (error as Error).message || 'Internal server error' }, 500);
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
