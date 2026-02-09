/**
 * PingService - Core Service
 *
 * Thin orchestrator that delegates to focused collaborators:
 *   - WaiterPool     — long-polling waiter management
 *   - ChannelManager — notification channel dispatch
 *   - ParserRegistry — interaction parser selection
 *   - AuditLogger    — conditional audit logging
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
import { WaiterPool } from './waiter-pool.js';
import { ChannelManager } from './channel-manager.js';
import { ParserRegistry } from './parser-registry.js';
import { AuditLogger } from './audit-logger.js';

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
// PingService Implementation
// ============================================================================

export class PingService {
    private readonly store: IPingStore;
    private readonly eventBus: IEventBus;
    private readonly defaultExpiresInMs: number;

    // Collaborators
    private readonly waiterPool: WaiterPool;
    private readonly channelManager: ChannelManager;
    private readonly parserRegistry: ParserRegistry;
    private readonly auditLogger: AuditLogger;

    constructor(config: PingServiceConfig) {
        this.store = config.store;
        this.eventBus = config.eventBus;
        this.defaultExpiresInMs = config.defaultExpiresInMs ?? 24 * 60 * 60 * 1000; // 24 hours

        this.waiterPool = new WaiterPool();
        this.channelManager = new ChannelManager(config.channels);
        this.parserRegistry = new ParserRegistry(config.parsers);
        this.auditLogger = new AuditLogger(config.store, config.enableAuditLog ?? true);
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
        ping.parsedInteraction = this.parserRegistry.parse(ping);

        // 3. Save to store
        await this.store.save(ping);

        // 4. Audit log
        await this.auditLogger.log('ping:created', ping.id, {
            agentId: ping.agentId,
            type: ping.type,
        });

        // 5. Notify all registered channels
        await this.channelManager.notifyChannels(ping, ping.parsedInteraction);

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
        await this.auditLogger.log('ping:responded', ping.id, {
            agentId: ping.agentId,
            action: response.action,
            via: response.respondedVia,
        });

        // Notify waiters
        this.waiterPool.resolveWaiters(pingId, response);

        // Emit event
        this.eventBus.emit('ping:responded', updatedPing, response);

        // Update channels
        await this.channelManager.updateChannels(pingId, { type: 'responded', response: response.action });

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

        // Delegate to waiter pool
        return this.waiterPool.wait(pingId, timeoutMs);
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

        await this.auditLogger.log('ping:cancelled', ping.id, {
            agentId: ping.agentId,
        });

        this.waiterPool.resolveWaiters(pingId, null);
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

        await this.auditLogger.log('ping:dismissed', ping.id, {
            agentId: ping.agentId,
        });

        this.eventBus.emit('ping:dismissed', { ...ping, status: 'dismissed' });
        await this.channelManager.updateChannels(pingId, { type: 'dismissed' });
    }

    // =========================================================================
    // Parser Management
    // =========================================================================

    /**
     * Register a new parser
     */
    registerParser(parser: IInteractionParser): void {
        this.parserRegistry.register(parser);
    }

    /**
     * Get all registered parsers
     */
    getParsers(): IInteractionParser[] {
        return this.parserRegistry.getAll();
    }

    // =========================================================================
    // Channel Management
    // =========================================================================

    /**
     * Register a new notification channel
     */
    registerChannel(channel: INotificationChannel): void {
        this.channelManager.registerChannel(channel);
    }

    /**
     * Get all registered channels
     */
    getChannels(): INotificationChannel[] {
        return this.channelManager.getChannels();
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
}

/**
 * Create a new PingService instance
 */
export function createPingService(config: PingServiceConfig): PingService {
    return new PingService(config);
}
