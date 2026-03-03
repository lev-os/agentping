/**
 * AuditLogger - Audit Log Management
 *
 * Conditionally appends audit log entries to the store based on
 * the enableAuditLog configuration flag.
 */

import type { IPingStore, AuditEventType } from '../ports/store.js';

// ============================================================================
// AuditLogger Implementation
// ============================================================================

export class AuditLogger {
    private readonly store: IPingStore;
    private readonly enabled: boolean;

    constructor(store: IPingStore, enableAuditLog: boolean) {
        this.store = store;
        this.enabled = enableAuditLog;
    }

    /**
     * Log an audit event if audit logging is enabled.
     */
    async log(
        eventType: AuditEventType,
        pingId: string,
        data?: { agentId?: string } & Record<string, unknown>,
    ): Promise<void> {
        if (!this.enabled) {
            return;
        }

        await this.store.appendAuditLog({
            timestamp: new Date(),
            eventType,
            pingId,
            agentId: data?.agentId,
            data: data ? { ...data } : undefined,
        });
    }
}
