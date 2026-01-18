/**
 * AgentPing ext-apps Bridge
 * SEP-1865 MCP UI Extensions - Host-to-UI communication bridge
 */

import type { Ping, HumanResponse } from '@agentping/core';

// ============================================================================
// Message Types
// ============================================================================

export interface UIMessage {
    jsonrpc: '2.0';
    method: string;
    params?: Record<string, unknown>;
    id?: string | number;
}

export interface UIResponse {
    jsonrpc: '2.0';
    result?: unknown;
    error?: { code: number; message: string };
    id: string | number;
}

export type BridgeEventType =
    | 'ping:display'
    | 'ping:update'
    | 'ui:response'
    | 'ui:dismiss'
    | 'ui:error';

export interface BridgeEvent {
    type: BridgeEventType;
    payload: unknown;
    timestamp: number;
}

// ============================================================================
// Bridge Class
// ============================================================================

export class ExtAppsBridge {
    private listeners = new Map<string, Set<(event: BridgeEvent) => void>>();
    private allowedOrigin: string;

    constructor(config: { allowedOrigin?: string } = {}) {
        this.allowedOrigin = config.allowedOrigin || '*';
        this.setupMessageListener();
    }

    private setupMessageListener(): void {
        if (typeof window === 'undefined') return;

        window.addEventListener('message', (event) => {
            // Validate origin if specified
            if (this.allowedOrigin !== '*' && event.origin !== this.allowedOrigin) {
                console.warn(`[ExtAppsBridge] Rejected message from origin: ${event.origin}`);
                return;
            }

            const data = event.data as UIMessage;
            if (!data?.jsonrpc || data.jsonrpc !== '2.0') return;

            this.handleMessage(data, event.origin);
        });
    }

    private handleMessage(message: UIMessage, origin: string): void {
        const eventType = this.methodToEventType(message.method);
        if (!eventType) return;

        const event: BridgeEvent = {
            type: eventType,
            payload: message.params,
            timestamp: Date.now(),
        };

        this.emit(eventType, event);
    }

    private methodToEventType(method: string): BridgeEventType | null {
        const mapping: Record<string, BridgeEventType> = {
            'ui/response': 'ui:response',
            'ui/dismiss': 'ui:dismiss',
            'ui/error': 'ui:error',
            'ping/display': 'ping:display',
            'ping/update': 'ping:update',
        };
        return mapping[method] || null;
    }

    // ========================================================================
    // Event Emitter Pattern
    // ========================================================================

    on(event: BridgeEventType, callback: (event: BridgeEvent) => void): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    private emit(event: BridgeEventType, data: BridgeEvent): void {
        this.listeners.get(event)?.forEach(cb => cb(data));
    }

    // ========================================================================
    // Host-to-UI Communication
    // ========================================================================

    sendToUI(method: string, params: Record<string, unknown>, targetWindow?: Window): void {
        const message: UIMessage = {
            jsonrpc: '2.0',
            method,
            params,
        };

        const target = targetWindow || window.parent;
        target.postMessage(message, this.allowedOrigin);
    }

    displayPing(ping: Ping, targetWindow?: Window): void {
        this.sendToUI('ping/display', { ping }, targetWindow);
    }

    updatePing(pingId: string, updates: Partial<Ping>, targetWindow?: Window): void {
        this.sendToUI('ping/update', { pingId, updates }, targetWindow);
    }

    // ========================================================================
    // Response Handling
    // ========================================================================

    waitForResponse(pingId: string, timeoutMs = 300000): Promise<HumanResponse | null> {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                unsubscribe();
                resolve(null);
            }, timeoutMs);

            const unsubscribe = this.on('ui:response', (event) => {
                const payload = event.payload as { pingId: string; response: HumanResponse };
                if (payload.pingId === pingId) {
                    clearTimeout(timeout);
                    unsubscribe();
                    resolve(payload.response);
                }
            });
        });
    }

    destroy(): void {
        this.listeners.clear();
    }
}

// ============================================================================
// Factory
// ============================================================================

export function createBridge(config?: { allowedOrigin?: string }): ExtAppsBridge {
    return new ExtAppsBridge(config);
}
