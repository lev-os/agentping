/**
 * Unit Tests for PingService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PingService } from '../services/ping-service';
import { defaultParsers } from '../parsers';
import type { IPingStore, INotificationChannel, IEventBus, Ping, PingPayload, HumanResponse } from '../index';

// ============================================================================
// Mocks
// ============================================================================

const createMockStore = (): IPingStore => ({
    save: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn().mockResolvedValue(null),
    findPending: vi.fn().mockResolvedValue([]),
    findBySession: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    appendAuditLog: vi.fn().mockResolvedValue(undefined),
    getAuditLog: vi.fn().mockResolvedValue([]),
    saveDirectiveTemplate: vi.fn().mockResolvedValue(undefined),
    getDirectiveTemplates: vi.fn().mockResolvedValue([]),
    incrementTemplateUseCount: vi.fn().mockResolvedValue(undefined),
    initialize: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
});

const createMockChannel = (): INotificationChannel => ({
    name: 'test',
    supportsInlineResponse: false,
    supportedInteractionTypes: ['*'],
    notify: vi.fn().mockResolvedValue(undefined),
});

const createMockEventBus = (): IEventBus => ({
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
});

// ============================================================================
// Tests
// ============================================================================

describe('PingService', () => {
    let service: PingService;
    let mockStore: IPingStore;
    let mockChannel: INotificationChannel;
    let mockEventBus: IEventBus;

    beforeEach(() => {
        vi.clearAllMocks();
        mockStore = createMockStore();
        mockChannel = createMockChannel();
        mockEventBus = createMockEventBus();

        service = new PingService({
            store: mockStore,
            channels: [mockChannel],
            parsers: defaultParsers,
            eventBus: mockEventBus,
        });
    });

    describe('submitPing', () => {
        it('should create a ping with all required fields', async () => {
            const pingData = {
                agentId: 'test-agent',
                agentName: 'Test Agent',
                sessionId: 'test-session',
                payload: {
                    type: 'notification' as const,
                    message: 'Hello World',
                } as PingPayload,
            };

            const result = await service.submitPing(pingData);

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.agentId).toBe('test-agent');
            expect(result.agentName).toBe('Test Agent');
            expect(result.status).toBe('pending');
            expect(result.createdAt).toBeInstanceOf(Date);
            expect(result.expiresAt).toBeInstanceOf(Date);
        });

        it('should call store.save with the ping', async () => {
            await service.submitPing({
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                payload: { type: 'notification', message: 'test' } as PingPayload,
            });

            expect(mockStore.save).toHaveBeenCalledTimes(1);
            expect(mockStore.save).toHaveBeenCalledWith(
                expect.objectContaining({ agentId: 'test' })
            );
        });

        it('should notify all channels', async () => {
            await service.submitPing({
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                payload: { type: 'notification', message: 'test' } as PingPayload,
            });

            expect(mockChannel.notify).toHaveBeenCalledTimes(1);
        });

        it('should emit ping:created event', async () => {
            await service.submitPing({
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                payload: { type: 'notification', message: 'test' } as PingPayload,
            });

            expect(mockEventBus.emit).toHaveBeenCalledWith(
                'ping:created',
                expect.objectContaining({ agentId: 'test' })
            );
        });

        it('should parse the interaction using parsers', async () => {
            const result = await service.submitPing({
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                payload: { type: 'notification', message: 'test' } as PingPayload,
            });

            expect(result.parsedInteraction).toBeDefined();
            expect(result.parsedInteraction?.interactionType).toBeDefined();
        });
    });

    describe('respond', () => {
        it('should update ping status to responded', async () => {
            const existingPing: Ping = {
                id: 'ping-123',
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                type: 'question',
                payload: { type: 'question', question: 'test?' } as PingPayload,
                status: 'pending',
                response: null,
                createdAt: new Date(),
                respondedAt: null,
                expiresAt: new Date(Date.now() + 86400000),
                parsedInteraction: null,
            };

            (mockStore.findById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existingPing);

            const response: HumanResponse = {
                action: 'answered',
                data: { type: 'answer', value: 'yes' },
                respondedAt: new Date(),
                respondedVia: 'test',
            };

            const result = await service.respond('ping-123', response);

            expect(result.status).toBe('responded');
            expect(result.response?.action).toBe('answered');
            expect(result.respondedAt).toBeInstanceOf(Date);
        });

        it('should throw error if ping not found', async () => {
            (mockStore.findById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

            await expect(
                service.respond('nonexistent', { action: 'answered', data: { type: 'answer', value: 'test' }, respondedAt: new Date(), respondedVia: 'test' })
            ).rejects.toThrow('Ping not found');
        });

        it('should emit ping:responded event', async () => {
            const existingPing: Ping = {
                id: 'ping-123',
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                type: 'question',
                payload: { type: 'question', question: 'test?' } as PingPayload,
                status: 'pending',
                response: null,
                createdAt: new Date(),
                respondedAt: null,
                expiresAt: new Date(Date.now() + 86400000),
                parsedInteraction: null,
            };

            (mockStore.findById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existingPing);

            await service.respond('ping-123', { action: 'answered', data: { type: 'answer', value: 'test' }, respondedAt: new Date(), respondedVia: 'test' });

            expect(mockEventBus.emit).toHaveBeenCalledWith(
                'ping:responded',
                expect.objectContaining({ id: 'ping-123', status: 'responded' }),
                expect.objectContaining({ action: 'answered', data: { type: 'answer', value: 'test' } })
            );
        });
    });

    describe('dismiss', () => {
        it('should update ping status to dismissed', async () => {
            const existingPing: Ping = {
                id: 'ping-123',
                agentId: 'test',
                agentName: 'Test',
                sessionId: 'session',
                type: 'notification',
                payload: { type: 'notification', message: 'test' } as PingPayload,
                status: 'pending',
                response: null,
                createdAt: new Date(),
                respondedAt: null,
                expiresAt: new Date(Date.now() + 86400000),
                parsedInteraction: null,
            };

            (mockStore.findById as ReturnType<typeof vi.fn>).mockResolvedValueOnce(existingPing);

            await service.dismiss('ping-123');

            expect(mockStore.update).toHaveBeenCalledWith(
                'ping-123',
                expect.objectContaining({ status: 'dismissed' })
            );
        });
    });

    describe('getPendingPings', () => {
        it('should return pings with pending status', async () => {
            const pendingPings: Ping[] = [
                {
                    id: 'ping-1',
                    agentId: 'test',
                    agentName: 'Test',
                    sessionId: 'session',
                    type: 'notification',
                    payload: { type: 'notification', message: 'test' } as PingPayload,
                    status: 'pending',
                    response: null,
                    createdAt: new Date(),
                    respondedAt: null,
                    expiresAt: new Date(Date.now() + 86400000),
                    parsedInteraction: null,
                },
            ];

            (mockStore.findPending as ReturnType<typeof vi.fn>).mockResolvedValueOnce(pendingPings);

            const result = await service.getPendingPings();

            expect(result).toHaveLength(1);
            expect(mockStore.findPending).toHaveBeenCalled();
        });
    });
});
