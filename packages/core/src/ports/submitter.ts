/**
 * IPingSubmitter - Input Port
 * 
 * How pings enter the system. Implemented by input adapters
 * (HTTP API, CLI, MCP Server, etc.)
 */

import type { Ping, CreatePingRequest, HumanResponse } from '../domain/ping.js';

export interface IPingSubmitter {
    /**
     * Submit a new ping and get back the created Ping object
     */
    submit(request: CreatePingRequest): Promise<Ping>;

    /**
     * Get the current status of a ping
     */
    getStatus(pingId: string): Promise<Ping | null>;

    /**
     * Long-poll for a response. Returns null if timeout is reached.
     */
    waitForResponse(pingId: string, timeoutMs: number): Promise<HumanResponse | null>;

    /**
     * Cancel a pending ping
     */
    cancel(pingId: string): Promise<void>;
}
