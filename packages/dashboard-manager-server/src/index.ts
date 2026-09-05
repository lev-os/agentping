/**
 * Dashboard Manager Server
 *
 * HTTP server with REST API and WebSocket support for dashboard-runner
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { createServer as createHTTPServer } from 'node:http';
import type { IncomingHttpHeaders } from 'node:http';
import type { DashboardRunner } from '@lev-os/dashboard-runner';
import { createDashboardRoutes } from './routes/dashboards.js';
import { createProjectsRoutes } from './routes/projects.js';
import { createComponentsRoutes } from './routes/components.js';
import { createParityRoutes } from './routes/parity.js';
import { createExecTraceRoutes } from './routes/exec-traces.js';
import { createLevObservabilityRoutes } from './routes/lev-observability.js';
import { createHeartbeatRoutes, warmHeartbeatResearchCache } from './routes/heartbeat.js';
import { createWorkflowRoutes } from './routes/workflows.js';
import { createWebSocketServer } from './websocket.js';
import type { LevAdapter } from './adapter.js';

// ============================================================================
// Server Configuration
// ============================================================================

export interface ServerConfig {
  runner: DashboardRunner;
  levAdapter?: LevAdapter;
  port?: number;
  host?: string;
  corsOrigins?: string[];
  enableLogger?: boolean;
  enableWebSocket?: boolean;
}

// ============================================================================
// Create HTTP Server
// ============================================================================

export function createServer(config: ServerConfig) {
  const {
    runner,
    levAdapter,
    port = 3030,
    host = '127.0.0.1',
    corsOrigins = ['*'],
    enableLogger = true,
    enableWebSocket = true,
  } = config;

  const app = new Hono();

  // =========================================================================
  // Middleware
  // =========================================================================

  app.use('*', cors({ origin: corsOrigins }));
  if (enableLogger) {
    app.use('*', logger());
  }

  // =========================================================================
  // Health Check
  // =========================================================================

  app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // =========================================================================
  // Dashboard Routes
  // =========================================================================

  const dashboardRoutes = createDashboardRoutes({ runner });
  app.route('/api/dashboards', dashboardRoutes);

  const projectsRoutes = createProjectsRoutes();
  app.route('/api/projects', projectsRoutes);

  const componentsRoutes = createComponentsRoutes();
  app.route('/api/components', componentsRoutes);

  app.route('/api/parity', createParityRoutes());

  const execTraceRoutes = createExecTraceRoutes();
  app.route('/api/exec-traces', execTraceRoutes);

  const levObservabilityRoutes = createLevObservabilityRoutes({ projectionReader: levAdapter?.projectionReader });
  app.route('/api/lev', levObservabilityRoutes);

  const heartbeatRoutes = createHeartbeatRoutes();
  app.route('/api/heartbeat', heartbeatRoutes);

  app.route('/api/workflows', createWorkflowRoutes());

  // =========================================================================
  // Start Server with Optional WebSocket Support
  // =========================================================================

  return {
    app,
    start: () => {
      console.log(`[DashboardServer] Starting HTTP server on ${host}:${port}`);

      // Create HTTP server for Socket.io compatibility
      const httpServer = createHTTPServer(async (req, res) => {
        // Buffer request body for non-GET/HEAD (Node IncomingMessage isn't a Web ReadableStream)
        let bodyBuffer: Buffer | undefined;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(chunk as Buffer);
          }
          bodyBuffer = Buffer.concat(chunks);
        }

        const honoResponse = await app.fetch(
          new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as unknown as Record<string, string>,
            body: bodyBuffer && bodyBuffer.length > 0 ? bodyBuffer : undefined,
          })
        );

        res.writeHead(honoResponse.status, Object.fromEntries(honoResponse.headers));
        if (honoResponse.body) {
          const reader = honoResponse.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        }
        res.end();
      });

      // Initialize WebSocket server if enabled
      let wsServer: ReturnType<typeof createWebSocketServer> | null = null;
      if (enableWebSocket) {
        wsServer = createWebSocketServer({
          httpServer,
          runner,
          corsOrigins,
        });
        console.log('[DashboardServer] WebSocket server initialized');
      }

      // Start listening
      httpServer.listen(port, host, () => {
        console.log(`[DashboardServer] Server running at http://${host}:${port}`);
        if (enableWebSocket) {
          console.log(`[DashboardServer] WebSocket available at ws://${host}:${port}/socket.io`);
        }
        void warmHeartbeatResearchCache().catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          console.warn(`[DashboardServer] Heartbeat research cache warmup failed: ${message}`);
        });
      });

      return {
        httpServer,
        wsServer,
        close: async () => {
          console.log('[DashboardServer] Shutting down server');
          if (wsServer) {
            wsServer.close();
          }
          httpServer.close();
        },
      };
    },
  };
}

export { createDashboardRoutes, createComponentsRoutes, createExecTraceRoutes, createLevObservabilityRoutes, createHeartbeatRoutes, createWorkflowRoutes, createWebSocketServer };
export type { LevAdapter } from './adapter.js';
export { LEV_OBSERVABILITY_PROJECTION_SCHEMA } from './routes/lev-observability-projection.js';
export type {
  LevDiagnostic,
  LevProjection,
  LevProjectionKind,
  LevProjectionReader,
  LevProjectionReadRequest,
  LevProjectionReadResult,
} from './routes/lev-observability-projection.js';
