/**
 * PingService - Core Service
 * 
 * The central orchestration service. Handles creating pings, running them
 * through parsers, notifying channels, and processing responses.
 */

import { nanoid } from 'nanoid';
import {
    CreatePingRequestSchema,
    type Ping,
    type CreatePingRequest,
    type HumanResponse,
    type ParsedInteraction,
    type PingStatus,
} from '../domain/ping.js';
import type { IPingStore } from '../ports/store.js';
import type { INotificationChannel } from '../ports/channel.js';
import type { IInteractionParser } from '../ports/parser.js';
import type { IEventBus } from '../events/event-bus.js';

// ============================================================================
// Service Configuration
// ============================================================================

export interface PingServiceConfig {
    store: IPingStore;
    channels: INotificationChannel[];
    parsers: IInteractionParser[];
    eventBus: IEventBus;

    // Optional config
    defaultExpiresInMs?: number;
    enableAuditLog?: boolean;
}

// ============================================================================
// Response Waiters (for long-polling)
// ============================================================================

interface ResponseWaiter {
    resolve: (response: HumanResponse | null) => void;
    timeout: NodeJS.Timeout;
}

// ============================================================================
// PingService Implementation
// ============================================================================

export class PingService {
    private readonly store: IPingStore;
    private readonly channels: INotificationChannel[];
    private readonly parsers: IInteractionParser[];
    private readonly eventBus: IEventBus;
    private readonly defaultExpiresInMs: number;
    private readonly enableAuditLog: boolean;

    // Waiters for long-polling responses
    private readonly waiters: Map<string, ResponseWaiter[]> = new Map();

    constructor(config: PingServiceConfig) {
        this.store = config.store;
        this.channels = config.channels;
        this.parsers = config.parsers.sort((a, b) => b.priority - a.priority);
        this.eventBus = config.eventBus;
        this.defaultExpiresInMs = config.defaultExpiresInMs ?? 24 * 60 * 60 * 1000; // 24 hours
        this.enableAuditLog = config.enableAuditLog ?? true;
    }

    // =========================================================================
    // Core Operations
    // =========================================================================

    /**
     * Submit a new ping
     */
    async submitPing(request: CreatePingRequest): Promise<Ping> {
        // 0. Validate the request (throws ZodError if invalid)
        const validatedRequest = CreatePingRequestSchema.parse(request);

        // 1. Create the ping entity
        const ping = this.createPingEntity(validatedRequest);

        // 2. Run through parsers to get interaction hints
        const parser = this.parsers.find(p => p.canParse(ping));
        if (parser) {
            ping.parsedInteraction = parser.parse(ping);
        }

        // 3. Save to store
        await this.store.save(ping);

        // 4. Audit log
        if (this.enableAuditLog) {
            await this.store.appendAuditLog({
                timestamp: new Date(),
                eventType: 'ping:created',
                pingId: ping.id,
                agentId: ping.agentId,
                data: { type: ping.type },
            });
        }

        // 5. Notify all registered channels
        await this.notifyChannels(ping);

        // 6. Emit event
        this.eventBus.emit('ping:created', ping);

        return ping;
    }

    /**
     * Get a ping by ID
     */
    async getPing(pingId: string): Promise<Ping | null> {
        return this.store.findById(pingId);
    }

    /**
     * Get pings with filters
     */
    async getPings(filters?: {
        status?: 'pending' | 'responded' | 'expired' | 'dismissed';
        agentId?: string;
        sessionId?: string;
        limit?: number;
    }): Promise<Ping[]> {
        return this.store.findPending(filters);
    }

    /**
     * Get pending pings
     */
    async getPendingPings(filters?: {
        agentId?: string;
        sessionId?: string;
        limit?: number;
    }): Promise<Ping[]> {
        return this.store.findPending({
            status: 'pending',
            ...filters,
        });
    }

    /**
     * Submit a response to a ping
     */
    async respond(pingId: string, response: HumanResponse): Promise<Ping> {
        const ping = await this.store.findById(pingId);

        if (!ping) {
            throw new Error(`Ping not found: ${pingId}`);
        }

        if (ping.status !== 'pending') {
            throw new Error(`Ping is not pending: ${ping.status}`);
        }

        // Update ping
        const updatedPing: Ping = {
            ...ping,
            status: 'responded',
            response,
            respondedAt: response.respondedAt,
        };

        await this.store.update(pingId, {
            status: 'responded',
            response,
            respondedAt: response.respondedAt,
        });

        // Audit log
        if (this.enableAuditLog) {
            await this.store.appendAuditLog({
                timestamp: new Date(),
                eventType: 'ping:responded',
                pingId: ping.id,
                agentId: ping.agentId,
                data: { action: response.action, via: response.respondedVia },
            });
        }

        // Notify waiters
        this.resolveWaiters(pingId, response);

        // Emit event
        this.eventBus.emit('ping:responded', updatedPing, response);

        // Update channels
        await this.updateChannels(pingId, { type: 'responded', response: response.action });

        return updatedPing;
    }

    /**
     * Wait for a response (long-polling)
     */
    async waitForResponse(pingId: string, timeoutMs: number): Promise<HumanResponse | null> {
        // Check if already responded
        const ping = await this.store.findById(pingId);
        if (!ping) {
            throw new Error(`Ping not found: ${pingId}`);
        }

        if (ping.status === 'responded' && ping.response) {
            return ping.response;
        }

        if (ping.status !== 'pending') {
            return null;
        }

        // Wait for response
        return new Promise((resolve) => {
            const waiter: ResponseWaiter = {
                resolve,
                timeout: setTimeout(() => {
                    this.removeWaiter(pingId, waiter);
                    resolve(null);
                }, timeoutMs),
            };

            if (!this.waiters.has(pingId)) {
                this.waiters.set(pingId, []);
            }
            this.waiters.get(pingId)!.push(waiter);
        });
    }

    /**
     * Cancel a ping
     */
    async cancel(pingId: string): Promise<void> {
        const ping = await this.store.findById(pingId);

        if (!ping) {
            throw new Error(`Ping not found: ${pingId}`);
        }

        if (ping.status !== 'pending') {
            return; // Already not pending
        }

        await this.store.update(pingId, { status: 'dismissed' });

        if (this.enableAuditLog) {
            await this.store.appendAuditLog({
                timestamp: new Date(),
                eventType: 'ping:cancelled',
                pingId: ping.id,
                agentId: ping.agentId,
            });
        }

        this.resolveWaiters(pingId, null);
        this.eventBus.emit('ping:cancelled', { ...ping, status: 'dismissed' });
    }

    /**
     * Dismiss a ping (user chose to dismiss without responding)
     */
    async dismiss(pingId: string): Promise<void> {
        const ping = await this.store.findById(pingId);

        if (!ping) {
            throw new Error(`Ping not found: ${pingId}`);
        }

        await this.store.update(pingId, { status: 'dismissed' });

        if (this.enableAuditLog) {
            await this.store.appendAuditLog({
                timestamp: new Date(),
                eventType: 'ping:dismissed',
                pingId: ping.id,
                agentId: ping.agentId,
            });
        }

        this.eventBus.emit('ping:dismissed', { ...ping, status: 'dismissed' });
        await this.updateChannels(pingId, { type: 'dismissed' });
    }

    // =========================================================================
    // Parser Management
    // =========================================================================

    /**
     * Register a new parser
     */
    registerParser(parser: IInteractionParser): void {
        this.parsers.push(parser);
        this.parsers.sort((a, b) => b.priority - a.priority);
    }

    /**
     * Get all registered parsers
     */
    getParsers(): IInteractionParser[] {
        return [...this.parsers];
    }

    // =========================================================================
    // Channel Management
    // =========================================================================

    /**
     * Register a new notification channel
     */
    registerChannel(channel: INotificationChannel): void {
        this.channels.push(channel);
    }

    /**
     * Get all registered channels
     */
    getChannels(): INotificationChannel[] {
        return [...this.channels];
    }

    // =========================================================================
    // Private Helpers
    // =========================================================================

    private createPingEntity(request: CreatePingRequest): Ping {
        const now = new Date();
        const expiresInMs = request.expiresInMs ?? this.defaultExpiresInMs;

        return {
            id: nanoid(),
            agentId: request.agentId,
            agentName: request.agentName,
            sessionId: request.sessionId,
            type: request.payload.type as any,
            payload: request.payload,
            status: 'pending',
            response: null,
            createdAt: now,
            respondedAt: null,
            expiresAt: new Date(now.getTime() + expiresInMs),
            parsedInteraction: null,
        };
    }

    private async notifyChannels(ping: Ping): Promise<void> {
        const notifications = this.channels.map(async (channel) => {
            try {
                await channel.notify(ping, ping.parsedInteraction);
            } catch (error) {
                console.error(`Failed to notify channel ${channel.name}:`, error);
            }
        });

        await Promise.all(notifications);
    }

    private async updateChannels(pingId: string, update: { type: string; response?: string }): Promise<void> {
        const updates = this.channels.map(async (channel) => {
            if (channel.update) {
                try {
                    await channel.update(pingId, update as any);
                } catch (error) {
                    console.error(`Failed to update channel ${channel.name}:`, error);
                }
            }
        });

        await Promise.all(updates);
    }

    private resolveWaiters(pingId: string, response: HumanResponse | null): void {
        const waiters = this.waiters.get(pingId);
        if (waiters) {
            for (const waiter of waiters) {
                clearTimeout(waiter.timeout);
                waiter.resolve(response);
            }
            this.waiters.delete(pingId);
        }
    }

    private removeWaiter(pingId: string, waiter: ResponseWaiter): void {
        const waiters = this.waiters.get(pingId);
        if (waiters) {
            const index = waiters.indexOf(waiter);
            if (index !== -1) {
                waiters.splice(index, 1);
            }
            if (waiters.length === 0) {
                this.waiters.delete(pingId);
            }
        }
    }
}

/**
 * Create a new PingService instance
 */
export function createPingService(config: PingServiceConfig): PingService {
    return new PingService(config);
}
