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

// ============================================================================
// Main Entry Point
// ============================================================================

async function main() {
    console.log('⚡ AgentPing Daemon starting...\n');

    // 1. Load configuration
    const config = await loadConfig();
    console.log(`📁 Config loaded from: ${config.configPath || 'defaults'}`);
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

    // 6. Create HTTP API
    const httpApp = createHttpApi({
        pingService,
        corsOrigins: config.cors?.origins || ['*'],
        enableLogger: config.logging?.enabled ?? true,
    });

    // 7. Create HTTP server and attach WebSocket
    const httpServer = createServer(async (req, res) => {
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
    const leaseManager = new LeaseManager();
    const browserCDPAdapter = createBrowserCDPAdapter({ eventBus, leaseManager });
    browserCDPAdapter.attach(httpServer, '/browser-cdp');
    console.log('✓ Browser CDP adapter attached');

    // 8. Start the server
    httpServer.listen(config.port, () => {
        console.log(`\n🚀 AgentPing daemon running on http://localhost:${config.port}`);
        console.log(`   API: http://localhost:${config.port}/api/v1`);
        console.log(`   WS:  ws://localhost:${config.port}/api/v1/ws`);
        console.log(`   CDP: ws://localhost:${config.port}/browser-cdp`);
        console.log(`\n   Press Ctrl+C to stop\n`);
    });

    // 9. Graceful shutdown
    const shutdown = async () => {
        console.log('\n⏳ Shutting down...');
        httpServer.close();
        wsManager.close();
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
