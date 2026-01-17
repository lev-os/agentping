/**
 * WebSocket Server for Real-Time Events
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { IEventBus, Ping, HumanResponse } from '@agentping/core';

// ============================================================================
// WebSocket Manager
// ============================================================================

export interface WebSocketManagerConfig {
    eventBus: IEventBus;
    path?: string;
}

export class WebSocketManager {
    private wss: WebSocketServer | null = null;
    private clients: Set<WebSocket> = new Set();
    private eventBus: IEventBus;

    constructor(config: WebSocketManagerConfig) {
        this.eventBus = config.eventBus;
    }

    /**
     * Attach to an HTTP server
     */
    attach(server: any, path = '/api/v1/ws'): void {
        this.wss = new WebSocketServer({ server, path });

        this.wss.on('connection', (ws: WebSocket) => {
            this.clients.add(ws);
            console.log(`[WS] Client connected (${this.clients.size} total)`);

            ws.on('close', () => {
                this.clients.delete(ws);
                console.log(`[WS] Client disconnected (${this.clients.size} total)`);
            });

            ws.on('error', (error) => {
                console.error('[WS] Client error:', error);
                this.clients.delete(ws);
            });

            // Send welcome message
            ws.send(JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() }));
        });

        // Subscribe to events
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this.eventBus.on('ping:created', (ping: Ping) => {
            this.broadcast({ type: 'ping:created', data: ping });
        });

        this.eventBus.on('ping:responded', (ping: Ping, response: HumanResponse) => {
            this.broadcast({ type: 'ping:responded', data: { ping, response } });
        });

        this.eventBus.on('ping:expired', (ping: Ping) => {
            this.broadcast({ type: 'ping:expired', data: ping });
        });

        this.eventBus.on('ping:dismissed', (ping: Ping) => {
            this.broadcast({ type: 'ping:dismissed', data: ping });
        });

        this.eventBus.on('ping:cancelled', (ping: Ping) => {
            this.broadcast({ type: 'ping:cancelled', data: ping });
        });
    }

    private broadcast(message: { type: string; data: unknown }): void {
        const payload = JSON.stringify(message);

        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        }
    }

    /**
     * Close the WebSocket server
     */
    close(): void {
        if (this.wss) {
            this.wss.close();
            this.wss = null;
        }
        this.clients.clear();
    }

    /**
     * Get the number of connected clients
     */
    getClientCount(): number {
        return this.clients.size;
    }
}

export function createWebSocketManager(config: WebSocketManagerConfig): WebSocketManager {
    return new WebSocketManager(config);
}
