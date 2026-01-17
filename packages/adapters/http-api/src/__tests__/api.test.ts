/**
 * Integration Tests for HTTP API
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_BASE = 'http://localhost:7890';

// Skip if daemon not running
const daemonRunning = async () => {
    try {
        const res = await fetch(`${API_BASE}/health`);
        return res.ok;
    } catch {
        return false;
    }
};

describe.skipIf(!(await daemonRunning()))('HTTP API Integration', () => {
    let createdPingId: string;

    describe('Health', () => {
        it('GET /health returns ok', async () => {
            const res = await fetch(`${API_BASE}/health`);
            expect(res.ok).toBe(true);
            const data = await res.json();
            expect(data.status).toBe('ok');
        });
    });

    describe('Pings CRUD', () => {
        it('POST /api/v1/pings creates a ping', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'integration-test',
                    agentName: 'Integration Test',
                    sessionId: 'test-session',
                    payload: {
                        type: 'notification',
                        message: 'Integration test ping',
                    },
                }),
            });

            expect(res.status).toBe(201);
            const data = await res.json();
            expect(data.ping).toBeDefined();
            expect(data.ping.id).toBeDefined();
            expect(data.ping.status).toBe('pending');
            createdPingId = data.ping.id;
        });

        it('GET /api/v1/pings lists pings', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings`);
            expect(res.ok).toBe(true);
            const data = await res.json();
            expect(data.pings).toBeDefined();
            expect(Array.isArray(data.pings)).toBe(true);
            expect(data.count).toBeGreaterThan(0);
        });

        it('GET /api/v1/pings/:id returns a ping', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings/${createdPingId}`);
            expect(res.ok).toBe(true);
            const data = await res.json();
            expect(data.ping.id).toBe(createdPingId);
        });

        it('GET /api/v1/pings/:id returns 404 for nonexistent', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings/nonexistent-id`);
            expect(res.status).toBe(404);
        });

        it('POST /api/v1/pings/:id/dismiss dismisses a ping', async () => {
            // Create a ping to dismiss
            const createRes = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'test',
                    payload: { type: 'notification', message: 'dismiss me' },
                }),
            });
            const { ping } = await createRes.json();

            const res = await fetch(`${API_BASE}/api/v1/pings/${ping.id}/dismiss`, {
                method: 'POST',
            });
            expect(res.ok).toBe(true);
            const data = await res.json();
            expect(data.success).toBe(true);
        });

        it('POST /api/v1/pings/:id/respond updates ping', async () => {
            // Create a question ping
            const createRes = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'test',
                    payload: { type: 'question', question: 'Test?' },
                }),
            });
            const { ping } = await createRes.json();

            const res = await fetch(`${API_BASE}/api/v1/pings/${ping.id}/respond`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'answered',
                    data: { value: 'yes' },
                }),
            });
            expect(res.ok).toBe(true);
            const data = await res.json();
            expect(data.ping.status).toBe('responded');
            expect(data.ping.response.action).toBe('answered');
        });
    });

    describe('Ping Types', () => {
        it('creates notification ping', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'test',
                    payload: { type: 'notification', message: 'Test' },
                }),
            });
            const { ping } = await res.json();
            expect(ping.parsedInteraction.interactionType).toBe('notification');
        });

        it('creates question ping', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'test',
                    payload: {
                        type: 'question',
                        question: 'What?',
                        options: ['A', 'B'],
                    },
                }),
            });
            const { ping } = await res.json();
            expect(ping.parsedInteraction.interactionType).toBe('question');
        });

        it('creates approval ping', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'test',
                    payload: {
                        type: 'approval',
                        title: 'Approve?',
                        action: 'Do something',
                        risk: 'low',
                    },
                }),
            });
            const { ping } = await res.json();
            expect(ping.parsedInteraction.interactionType).toBe('approval');
        });

        it('creates step_approval ping', async () => {
            const res = await fetch(`${API_BASE}/api/v1/pings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'test',
                    payload: {
                        type: 'step_approval',
                        title: 'Steps',
                        steps: [
                            { id: 's1', description: 'Step 1', risk: 'low', reversible: true },
                        ],
                    },
                }),
            });
            const { ping } = await res.json();
            expect(ping.parsedInteraction.interactionType).toBe('step-checklist');
        });
    });
});
