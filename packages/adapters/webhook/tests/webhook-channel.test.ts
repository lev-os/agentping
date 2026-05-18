import { createServer, type IncomingMessage } from 'node:http';
import { afterEach, describe, expect, it } from 'vitest';
import { createWebhookChannel } from '../src/index.js';
import type { Ping } from '@agentping/core';

const servers: Array<{ close: () => void }> = [];

afterEach(async () => {
    await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(resolve))));
});

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

function makePing(): Ping {
    return {
        id: 'ping-webhook',
        agentId: 'agent',
        agentName: 'Agent',
        sessionId: 'session',
        type: 'notification',
        payload: { type: 'notification', message: 'Ready', level: 'info' },
        status: 'pending',
        response: null,
        createdAt: new Date('2026-05-17T00:00:00.000Z'),
        respondedAt: null,
        expiresAt: null,
        parsedInteraction: null,
    };
}

describe('WebhookChannel', () => {
    it('posts ping-created payloads with an HMAC signature', async () => {
        const received = new Promise<{ body: string; signature: string | undefined }>((resolve) => {
            const server = createServer(async (req, res) => {
                resolve({
                    body: await readBody(req),
                    signature: req.headers['x-agentping-signature'] as string | undefined,
                });
                res.writeHead(200).end('ok');
            });
            servers.push(server);
            server.listen(0, '127.0.0.1', async () => {
                const address = server.address();
                if (!address || typeof address === 'string') return;
                const channel = createWebhookChannel({
                    url: `http://127.0.0.1:${address.port}`,
                    secret: 'secret',
                    retryCount: 0,
                });
                await channel.notify(makePing());
            });
        });

        const request = await received;
        expect(JSON.parse(request.body)).toEqual(expect.objectContaining({
            event: 'ping:created',
            ping: expect.objectContaining({ id: 'ping-webhook' }),
        }));
        expect(request.signature).toMatch(/^sha256=/);
    });
});
