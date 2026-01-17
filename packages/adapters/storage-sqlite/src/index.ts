/**
 * SQLite Storage Adapter using sql.js
 * 
 * Implements IPingStore using sql.js (pure JS SQLite).
 */

import initSqlJs, { Database } from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import type {
    IPingStore,
    PingFilters,
    AuditEntry,
    AuditFilters,
    DirectiveTemplate,
} from '@agentping/core';
import type { Ping } from '@agentping/core';

// ============================================================================
// SQLite Store Implementation
// ============================================================================

export class SQLiteStore implements IPingStore {
    private db: Database | null = null;
    private dbPath: string;

    constructor(dbPath: string) {
        this.dbPath = dbPath;
    }

    // =========================================================================
    // Lifecycle
    // =========================================================================

    async initialize(): Promise<void> {
        const SQL = await initSqlJs();

        // Ensure directory exists
        const dir = dirname(this.dbPath);
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        // Load existing database or create new
        if (existsSync(this.dbPath)) {
            const buffer = readFileSync(this.dbPath);
            this.db = new SQL.Database(buffer);
        } else {
            this.db = new SQL.Database();
        }

        // Create tables
        this.db.run(`
      CREATE TABLE IF NOT EXISTS pings (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        session_id TEXT NOT NULL,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        parsed_interaction TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        response TEXT,
        created_at TEXT NOT NULL,
        responded_at TEXT,
        expires_at TEXT
      )
    `);

        this.db.run(`CREATE INDEX IF NOT EXISTS idx_pings_status ON pings(status)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_pings_session ON pings(session_id)`);

        this.db.run(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        ping_id TEXT,
        agent_id TEXT,
        data TEXT
      )
    `);

        this.db.run(`
      CREATE TABLE IF NOT EXISTS directive_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        directive TEXT NOT NULL,
        use_count INTEGER DEFAULT 0
      )
    `);

        this.persist();
    }

    async close(): Promise<void> {
        if (this.db) {
            this.persist();
            this.db.close();
            this.db = null;
        }
    }

    private persist(): void {
        if (this.db) {
            const data = this.db.export();
            const buffer = Buffer.from(data);
            writeFileSync(this.dbPath, buffer);
        }
    }

    // =========================================================================
    // Ping CRUD
    // =========================================================================

    async save(ping: Ping): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        this.db.run(
            `INSERT INTO pings (id, agent_id, agent_name, session_id, type, payload, 
        parsed_interaction, status, response, created_at, responded_at, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                ping.id,
                ping.agentId,
                ping.agentName,
                ping.sessionId,
                ping.type,
                JSON.stringify(ping.payload),
                ping.parsedInteraction ? JSON.stringify(ping.parsedInteraction) : null,
                ping.status,
                ping.response ? JSON.stringify(ping.response) : null,
                ping.createdAt.toISOString(),
                ping.respondedAt?.toISOString() ?? null,
                ping.expiresAt?.toISOString() ?? null,
            ]
        );
        this.persist();
    }

    async findById(id: string): Promise<Ping | null> {
        if (!this.db) throw new Error('Database not initialized');

        const result = this.db.exec('SELECT * FROM pings WHERE id = ?', [id]);
        if (result.length === 0 || result[0].values.length === 0) {
            return null;
        }

        return this.rowToPing(result[0].columns, result[0].values[0]);
    }

    async findPending(filters?: PingFilters): Promise<Ping[]> {
        if (!this.db) throw new Error('Database not initialized');

        let query = 'SELECT * FROM pings WHERE 1=1';
        const params: (string | number)[] = [];

        if (filters?.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        } else {
            query += ' AND status = ?';
            params.push('pending');
        }

        if (filters?.agentId) {
            query += ' AND agent_id = ?';
            params.push(filters.agentId);
        }

        if (filters?.sessionId) {
            query += ' AND session_id = ?';
            params.push(filters.sessionId);
        }

        query += ' ORDER BY created_at DESC';

        if (filters?.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        const result = this.db.exec(query, params);
        if (result.length === 0) return [];

        return result[0].values.map(row => this.rowToPing(result[0].columns, row));
    }

    async findBySession(sessionId: string): Promise<Ping[]> {
        if (!this.db) throw new Error('Database not initialized');

        const result = this.db.exec(
            'SELECT * FROM pings WHERE session_id = ? ORDER BY created_at DESC',
            [sessionId]
        );
        if (result.length === 0) return [];

        return result[0].values.map(row => this.rowToPing(result[0].columns, row));
    }

    async update(id: string, updates: Partial<Ping>): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        const sets: string[] = [];
        const params: (string | null)[] = [];

        if (updates.status !== undefined) {
            sets.push('status = ?');
            params.push(updates.status);
        }

        if (updates.response !== undefined) {
            sets.push('response = ?');
            params.push(JSON.stringify(updates.response));
        }

        if (updates.respondedAt !== undefined) {
            sets.push('responded_at = ?');
            params.push(updates.respondedAt?.toISOString() ?? null);
        }

        if (sets.length === 0) return;

        params.push(id);
        this.db.run(`UPDATE pings SET ${sets.join(', ')} WHERE id = ?`, params);
        this.persist();
    }

    async delete(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        this.db.run('DELETE FROM pings WHERE id = ?', [id]);
        this.persist();
    }

    // =========================================================================
    // Audit Log
    // =========================================================================

    async appendAuditLog(entry: AuditEntry): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        this.db.run(
            `INSERT INTO audit_log (timestamp, event_type, ping_id, agent_id, data)
       VALUES (?, ?, ?, ?, ?)`,
            [
                entry.timestamp.toISOString(),
                entry.eventType,
                entry.pingId ?? null,
                entry.agentId ?? null,
                entry.data ? JSON.stringify(entry.data) : null,
            ]
        );
        this.persist();
    }

    async getAuditLog(filters?: AuditFilters): Promise<AuditEntry[]> {
        if (!this.db) throw new Error('Database not initialized');

        let query = 'SELECT * FROM audit_log WHERE 1=1';
        const params: (string | number)[] = [];

        if (filters?.eventType) {
            query += ' AND event_type = ?';
            params.push(filters.eventType);
        }

        if (filters?.pingId) {
            query += ' AND ping_id = ?';
            params.push(filters.pingId);
        }

        query += ' ORDER BY timestamp DESC';

        if (filters?.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        const result = this.db.exec(query, params);
        if (result.length === 0) return [];

        return result[0].values.map(row => ({
            id: row[0] as number,
            timestamp: new Date(row[1] as string),
            eventType: row[2] as AuditEntry['eventType'],
            pingId: row[3] as string | undefined,
            agentId: row[4] as string | undefined,
            data: row[5] ? JSON.parse(row[5] as string) : undefined,
        }));
    }

    // =========================================================================
    // Directive Templates
    // =========================================================================

    async saveDirectiveTemplate(template: DirectiveTemplate): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');

        this.db.run(
            `INSERT OR REPLACE INTO directive_templates (id, name, directive, use_count)
       VALUES (?, ?, ?, ?)`,
            [template.id, template.name, JSON.stringify(template.directive), template.useCount]
        );
        this.persist();
    }

    async getDirectiveTemplates(): Promise<DirectiveTemplate[]> {
        if (!this.db) throw new Error('Database not initialized');

        const result = this.db.exec('SELECT * FROM directive_templates ORDER BY use_count DESC');
        if (result.length === 0) return [];

        return result[0].values.map(row => ({
            id: row[0] as string,
            name: row[1] as string,
            directive: JSON.parse(row[2] as string),
            useCount: row[3] as number,
        }));
    }

    async incrementTemplateUseCount(id: string): Promise<void> {
        if (!this.db) throw new Error('Database not initialized');
        this.db.run('UPDATE directive_templates SET use_count = use_count + 1 WHERE id = ?', [id]);
        this.persist();
    }

    // =========================================================================
    // Private Helpers
    // =========================================================================

    private rowToPing(columns: string[], values: unknown[]): Ping {
        const row: Record<string, unknown> = {};
        columns.forEach((col, i) => {
            row[col] = values[i];
        });

        return {
            id: row.id as string,
            agentId: row.agent_id as string,
            agentName: row.agent_name as string,
            sessionId: row.session_id as string,
            type: row.type as Ping['type'],
            payload: JSON.parse(row.payload as string),
            parsedInteraction: row.parsed_interaction ? JSON.parse(row.parsed_interaction as string) : null,
            status: row.status as Ping['status'],
            response: row.response ? JSON.parse(row.response as string) : null,
            createdAt: new Date(row.created_at as string),
            respondedAt: row.responded_at ? new Date(row.responded_at as string) : null,
            expiresAt: row.expires_at ? new Date(row.expires_at as string) : null,
        };
    }
}

// ============================================================================
// Factory
// ============================================================================

export function createSQLiteStore(dbPath: string): SQLiteStore {
    return new SQLiteStore(dbPath);
}
