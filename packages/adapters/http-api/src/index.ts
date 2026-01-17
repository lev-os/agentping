/**
 * HTTP API Adapter
 * 
 * Exposes AgentPing core via HTTP using Hono.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';
import type { PingService, CreatePingRequest, HumanResponse } from '@agentping/core';



// ============================================================================
// Request Schemas
// ============================================================================

const CreatePingRequestSchema = z.object({
    agentId: z.string(),
    agentName: z.string(),
    sessionId: z.string(),
    payload: z.any(), // Validated by core
    expiresInMs: z.number().optional(),
});

const RespondRequestSchema = z.object({
    action: z.enum(['approved', 'denied', 'selected', 'answered', 'dismissed', 'custom']),
    data: z.any(),
    enrichment: z.object({
        directives: z.array(z.any()).optional(),
        notes: z.string().optional(),
        attachments: z.array(z.any()).optional(),
    }).optional(),
    respondedVia: z.string().default('http-api'),
});

// ============================================================================
// HTTP API Factory
// ============================================================================

export interface HttpApiConfig {
    pingService: PingService;
    corsOrigins?: string[];
    enableLogger?: boolean;
}

export function createHttpApi(config: HttpApiConfig) {
    const { pingService, corsOrigins = ['*'], enableLogger = true } = config;

    const app = new Hono();

    // Middleware
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
    // Create Ping
    // =========================================================================

    app.post('/api/v1/pings', async (c) => {
        try {
            const body = await c.req.json();
            const validated = CreatePingRequestSchema.parse(body);

            const ping = await pingService.submitPing(validated as CreatePingRequest);

            return c.json({ ping }, 201);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({ error: 'Validation error', details: error.issues }, 400);
            }
            console.error('Error creating ping:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    // =========================================================================
    // Get Ping
    // =========================================================================

    app.get('/api/v1/pings/:id', async (c) => {
        try {
            const id = c.req.param('id');
            const ping = await pingService.getPing(id);

            if (!ping) {
                return c.json({ error: 'Ping not found' }, 404);
            }

            return c.json({ ping });
        } catch (error) {
            console.error('Error getting ping:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    // =========================================================================
    // Wait for Response (Long-Poll)
    // =========================================================================

    app.get('/api/v1/pings/:id/wait', async (c) => {
        try {
            const id = c.req.param('id');
            const timeoutStr = c.req.query('timeout');
            const timeoutMs = timeoutStr ? parseInt(timeoutStr, 10) * 1000 : 30000;

            const response = await pingService.waitForResponse(id, timeoutMs);

            if (!response) {
                return c.json({ response: null, timedOut: true }, 408);
            }

            return c.json({ response, timedOut: false });
        } catch (error) {
            if ((error as Error).message?.includes('not found')) {
                return c.json({ error: 'Ping not found' }, 404);
            }
            console.error('Error waiting for response:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    // =========================================================================
    // Respond to Ping
    // =========================================================================

    app.post('/api/v1/pings/:id/respond', async (c) => {
        try {
            const id = c.req.param('id');
            const body = await c.req.json();
            const validated = RespondRequestSchema.parse(body);

            const response: HumanResponse = {
                action: validated.action,
                data: validated.data,
                enrichment: validated.enrichment ? {
                    directives: validated.enrichment.directives ?? [],
                    notes: validated.enrichment.notes,
                    attachments: validated.enrichment.attachments,
                } : undefined,
                respondedAt: new Date(),
                respondedVia: validated.respondedVia,
            };

            const ping = await pingService.respond(id, response);

            return c.json({ ping });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return c.json({ error: 'Validation error', details: error.issues }, 400);
            }
            if ((error as Error).message?.includes('not found')) {
                return c.json({ error: 'Ping not found' }, 404);
            }
            if ((error as Error).message?.includes('not pending')) {
                return c.json({ error: 'Ping is not pending' }, 409);
            }
            console.error('Error responding to ping:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    // =========================================================================
    // List Pings
    // =========================================================================

    app.get('/api/v1/pings', async (c) => {
        try {
            const status = c.req.query('status') as 'pending' | 'responded' | 'expired' | 'dismissed' | undefined;
            const sessionId = c.req.query('session');
            const agentId = c.req.query('agent');
            const limitStr = c.req.query('limit');
            const limit = limitStr ? parseInt(limitStr, 10) : 50;

            const pings = await pingService.getPings({
                status,
                sessionId,
                agentId,
                limit,
            });

            return c.json({ pings, count: pings.length });
        } catch (error) {
            console.error('Error listing pings:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    // =========================================================================
    // Dismiss Ping
    // =========================================================================

    app.post('/api/v1/pings/:id/dismiss', async (c) => {
        try {
            const id = c.req.param('id');
            await pingService.dismiss(id);
            return c.json({ success: true });
        } catch (error) {
            if ((error as Error).message?.includes('not found')) {
                return c.json({ error: 'Ping not found' }, 404);
            }
            console.error('Error dismissing ping:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    // =========================================================================
    // Cancel Ping
    // =========================================================================

    app.delete('/api/v1/pings/:id', async (c) => {
        try {
            const id = c.req.param('id');
            await pingService.cancel(id);
            return c.json({ success: true });
        } catch (error) {
            if ((error as Error).message?.includes('not found')) {
                return c.json({ error: 'Ping not found' }, 404);
            }
            console.error('Error cancelling ping:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    });

    return app;
}

export { Hono };
