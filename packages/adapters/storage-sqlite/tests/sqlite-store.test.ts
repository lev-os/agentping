import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { SQLiteStore } from '../src/index.js';
import type { Ping } from '@agentping/core';

const tempDirs: string[] = [];

afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
        rmSync(dir, { recursive: true, force: true });
    }
});

function makePing(): Ping {
    return {
        id: 'ping-sqlite',
        agentId: 'agent',
        agentName: 'Agent',
        sessionId: 'session',
        type: 'question',
        payload: { type: 'question', question: 'Continue?' },
        status: 'pending',
        response: null,
        createdAt: new Date('2026-05-17T00:00:00.000Z'),
        respondedAt: null,
        expiresAt: null,
        parsedInteraction: null,
    };
}

describe('SQLiteStore', () => {
    it('persists and reads a pending ping', async () => {
        const dir = mkdtempSync(join(tmpdir(), 'agentping-sqlite-'));
        tempDirs.push(dir);
        const store = new SQLiteStore(join(dir, 'pings.sqlite'));

        await store.initialize();
        await store.save(makePing());

        await expect(store.findById('ping-sqlite')).resolves.toEqual(expect.objectContaining({
            id: 'ping-sqlite',
            status: 'pending',
            sessionId: 'session',
        }));
        await expect(store.findPending({ sessionId: 'session' })).resolves.toHaveLength(1);

        await store.close();
    });
});
