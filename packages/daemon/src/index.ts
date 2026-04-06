#!/usr/bin/env node
/**
 * AgentPing Daemon
 * 
 * Main entry point that wires the hexagonal architecture together.
 */

import { serve } from '@hono/node-server';
import { createServer } from 'http';
import {
    PingService,
    createEventBus,
    defaultParsers,
} from '@agentping/core';
import { SQLiteStore } from '@agentping/storage-sqlite';
import { createHttpApi } from '@agentping/http-api';
import { createWebSocketManager } from '@agentping/http-api/websocket';
import { loadConfig, type DaemonConfig } from './config.js';
import { createBrowserCDPAdapter } from './browser-cdp-adapter.js';
import { LeaseManager } from './lease-manager.js';
import { CDPProxy } from './cdp-proxy.js';

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
    console.log('⚡ AgentPing Daemon starting...\n');

    // 1. Load configuration
    const config = await loadConfig();
    console.log(`📁 Config loaded`);
    console.log(`💾 Database: ${config.database.path}`);

    // 2. Initialize storage
    const store = new SQLiteStore(config.database.path);
    await store.initialize();
    console.log('✓ SQLite store initialized');

    // 3. Create event bus
    const eventBus = createEventBus();

    // 4. Create notification channels (output adapters)
    const channels: any[] = [];

    // Console channel for debugging
    channels.push({
        name: 'console',
        supportsInlineResponse: false,
        supportedInteractionTypes: ['*'],
        async notify(ping: any) {
            console.log(`\n📮 [PING] ${ping.agentName}: ${ping.payload.title || ping.type}`);
        },
    });

    console.log(`✓ ${channels.length} notification channel(s) registered`);

    // 5. Create core service
    const pingService = new PingService({
        store,
        channels,
        parsers: defaultParsers,
        eventBus,
        enableAuditLog: true,
    });
    console.log(`✓ PingService initialized with ${defaultParsers.length} parsers`);

    // 6. Create lease manager and browser CDP adapter (before HTTP API)
    const leaseManager = new LeaseManager({ eventBus });
    const browserCDPAdapter = createBrowserCDPAdapter({
        eventBus,
        leaseManager,
        extensionConfig: {
            notification: {
                style: (config as any).notification?.style || 'modal',
                position: (config as any).notification?.position || 'right',
                maxStack: (config as any).notification?.maxStack || 5,
                soundEnabled: (config as any).notification?.soundEnabled ?? true,
                soundVolume: (config as any).notification?.soundVolume || 0.15,
            },
            theme: {
                mode: (config as any).theme?.mode || 'system',
            },
        },
    });

    // 7. Create HTTP API with browserCDPAdapter
    const httpApp = createHttpApi({
        pingService,
        browserCDPAdapter,
        corsOrigins: config.cors?.origins || ['*'],
        enableLogger: config.logging?.enabled ?? true,
    });

    // 8. Create HTTP server and attach WebSocket
    const httpServer = createServer(async (req, res) => {
        // Tool API — Chrome APIs only, no CDP
        if (req.url === '/api/v1/tool' && req.method === 'POST') {
            try {
                const body = await readBody(req);
                const { action, params } = JSON.parse(body as string);
                if (!action) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing action' }));
                    return;
                }

                // Auto-lease: if no active lease, request one and wait
                if (!leaseManager.getActiveLease()) {
                    console.log('[Tool] No active lease — requesting (approve in extension)...');
                    const requestId = await browserCDPAdapter.requestLease(
                        'webmcp-tool',
                        ['browser', 'tabs', 'scripting', 'cookies'],
                        undefined,
                        '10m',
                        `Tool action: ${action}`,
                    );
                    const decision = await browserCDPAdapter.waitForLeaseDecision(requestId, 60000);
                    if (!decision.approved) {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Lease denied' }));
                        return;
                    }
                    console.log('[Tool] Lease granted');
                }

                const result = await browserCDPAdapter.sendToolRequest(action, params || {});
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ result }));
            } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: (err as Error).message }));
            }
            return;
        }

        // Forward to Hono
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        const request = new Request(url.toString(), {
            method: req.method,
            headers: req.headers as any,
            body: req.method !== 'GET' && req.method !== 'HEAD'
                ? await readBody(req)
                : undefined,
        });

        const response = await httpApp.fetch(request);

        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const body = await response.text();
        res.end(body);
    });

    // Attach WebSocket
    const wsManager = createWebSocketManager({ eventBus });
    wsManager.attach(httpServer, '/api/v1/ws');
    console.log('✓ WebSocket server attached');

    // Attach Browser CDP adapter
    browserCDPAdapter.attach(httpServer, '/browser-cdp');
    console.log('✓ Browser CDP adapter attached');

    // Route lease_request pings to browser extension
    eventBus.on('ping:created', (ping: any) => {
        if (ping.payload?.type === 'lease_request' && browserCDPAdapter.isExtensionConnected()) {
            browserCDPAdapter.requestLease(
                ping.agentName || ping.agentId,
                ping.payload.scopes || [ping.payload.scope || 'browser'],
                ping.payload.tabId,
                ping.payload.ttl || (config as any).lease?.defaultTtlMinutes || '5m',
                ping.payload.reason,
            ).catch((err: Error) => console.error('[Daemon] Failed to route lease to extension:', err));
            console.log(`[Daemon] Routed lease_request to extension for ${ping.agentName}`);
        }
    });

    // 9. Start CDP Proxy (raw CDP WebSocket for Playwright/agent-browser)
    const cdpProxyPort = parseInt(process.env.AGENTPING_CDP_PROXY_PORT || '7891', 10);
    const cdpProxy = new CDPProxy({
        port: cdpProxyPort,
        browserCDPAdapter: browserCDPAdapter,
        leaseManager,
        eventBus,
    });
    await cdpProxy.start();

    // 10. Start the server
    httpServer.listen(config.port, () => {
        console.log(`\n🚀 AgentPing daemon running on http://localhost:${config.port}`);
        console.log(`   API: http://localhost:${config.port}/api/v1`);
        console.log(`   WS:  ws://localhost:${config.port}/api/v1/ws`);
        console.log(`   CDP: ws://localhost:${config.port}/browser-cdp`);
        console.log(`   CDP Proxy: agent-browser --cdp ${cdpProxyPort} open <url>`);
        console.log(`\n   Press Ctrl+C to stop\n`);
    });

    // 11. Graceful shutdown
    const shutdown = async () => {
        console.log('\n⏳ Shutting down...');
        httpServer.close();
        wsManager.close();
        cdpProxy.close();
        browserCDPAdapter.close();
        await store.close();
        console.log('✓ Goodbye!\n');
        process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

// ============================================================================
// Helpers
// ============================================================================

async function readBody(req: any): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk: any) => { data += chunk; });
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}

// ============================================================================
// Run
// ============================================================================

main().catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
