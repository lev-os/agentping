/**
 * IPingStore - Storage Port
 * 
 * Persistence layer for pings. Implemented by storage adapters
 * (SQLite, Postgres, In-Memory, etc.)
 */

import type { Ping, HumanResponse } from '../domain/ping.js';

export interface PingFilters {
    status?: 'pending' | 'responded' | 'expired' | 'dismissed';
    agentId?: string;
    sessionId?: string;
    type?: string;
    limit?: number;
    offset?: number;
    createdAfter?: Date;
    createdBefore?: Date;
}

export interface AuditEntry {
    id?: number;
    timestamp: Date;
    eventType: AuditEventType;
    pingId?: string;
    agentId?: string;
    data?: Record<string, unknown>;
}

export type AuditEventType =
    | 'ping:created'
    | 'ping:responded'
    | 'ping:expired'
    | 'ping:dismissed'
    | 'ping:cancelled'
    | 'session:started'
    | 'session:ended';

export interface AuditFilters {
    eventType?: AuditEventType;
    pingId?: string;
    agentId?: string;
    limit?: number;
    offset?: number;
    after?: Date;
    before?: Date;
}

export interface DirectiveTemplate {
    id: string;
    name: string;
    directive: Record<string, unknown>;
    useCount: number;
}

export interface IPingStore {
    // =========================================================================
    // Ping CRUD
    // =========================================================================

    /**
     * Save a new ping
     */
    save(ping: Ping): Promise<void>;

    /**
     * Find a ping by ID
     */
    findById(id: string): Promise<Ping | null>;

    /**
     * Find pending pings with optional filters
     */
    findPending(filters?: PingFilters): Promise<Ping[]>;

    /**
     * Find all pings for a session
     */
    findBySession(sessionId: string): Promise<Ping[]>;

    /**
     * Update a ping
     */
    update(id: string, updates: Partial<Ping>): Promise<void>;

    /**
     * Delete a ping
     */
    delete(id: string): Promise<void>;

    // =========================================================================
    // Audit Log
    // =========================================================================

    /**
     * Append an entry to the audit log
     */
    appendAuditLog(entry: AuditEntry): Promise<void>;

    /**
     * Get audit log entries
     */
    getAuditLog(filters?: AuditFilters): Promise<AuditEntry[]>;

    // =========================================================================
    // Directive Templates
    // =========================================================================

    /**
     * Save a directive template
     */
    saveDirectiveTemplate(template: DirectiveTemplate): Promise<void>;

    /**
     * Get all directive templates
     */
    getDirectiveTemplates(): Promise<DirectiveTemplate[]>;

    /**
     * Increment the use count of a template
     */
    incrementTemplateUseCount(id: string): Promise<void>;

    // =========================================================================
    // Lifecycle
    // =========================================================================

    /**
     * Initialize the store (create tables, etc.)
     */
    initialize(): Promise<void>;

    /**
     * Close the store
     */
    close(): Promise<void>;
}
