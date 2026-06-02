import { describe, expect, it } from 'vitest';
import {
    LeaseRequestPayloadSchema,
    LeaseResponseDataSchema,
    type HumanResponse,
} from '../domain/ping';

describe('lease HITL primitives', () => {
    it('captures authority refs on lease requests', () => {
        const parsed = LeaseRequestPayloadSchema.parse({
            type: 'lease_request',
            scope: 'shell',
            ttl: '15m',
            reason: 'remote session inject',
            actionId: 'session.inject',
            operation: 'inject',
            resourceRef: 'session:abc',
            tenantId: 'tenant:kingly',
            projectId: 'project:lev',
            confirmationRequired: true,
            receiptRefs: ['receipt:lease-request'],
            auditRefs: ['audit:lease-request'],
        });

        expect(parsed).toMatchObject({
            actionId: 'session.inject',
            operation: 'inject',
            resourceRef: 'session:abc',
            tenantId: 'tenant:kingly',
            projectId: 'project:lev',
            confirmationRequired: true,
        });
        expect(parsed.receiptRefs).toContain('receipt:lease-request');
        expect(parsed.auditRefs).toContain('audit:lease-request');
    });

    it('defaults receipt arrays for older lease requests', () => {
        const parsed = LeaseRequestPayloadSchema.parse({
            type: 'lease_request',
            scope: 'browser',
            ttl: '5m',
            reason: 'inspect page',
        });

        expect(parsed.confirmationRequired).toBe(false);
        expect(parsed.receiptRefs).toEqual([]);
        expect(parsed.auditRefs).toEqual([]);
    });

    it('captures decision receipt refs on lease responses', () => {
        const parsed = LeaseResponseDataSchema.parse({
            type: 'lease',
            granted: true,
            token: 'confirm:session.inject:1',
            expiresAt: '2026-05-31T18:45:00.000Z',
            leaseRef: 'lease:1',
            decisionReceiptRef: 'hitl:approved',
            receiptRef: 'receipt:hitl-approved',
            auditRefs: ['audit:hitl-approved'],
        });
        const response: HumanResponse = {
            action: 'approved',
            data: parsed,
            respondedAt: new Date('2026-05-31T18:30:00.000Z'),
            respondedVia: 'agentping:test',
        };

        expect(response.data).toMatchObject({
            type: 'lease',
            granted: true,
            leaseRef: 'lease:1',
            decisionReceiptRef: 'hitl:approved',
            receiptRef: 'receipt:hitl-approved',
        });
    });

    it('allows denied lease responses without bearer tokens', () => {
        const parsed = LeaseResponseDataSchema.parse({
            type: 'lease',
            granted: false,
            decisionReceiptRef: 'hitl:denied',
            receiptRef: 'receipt:hitl-denied',
            auditRefs: ['audit:hitl-denied'],
        });

        expect(parsed.granted).toBe(false);
        expect(parsed.token).toBeUndefined();
        expect(parsed.decisionReceiptRef).toBe('hitl:denied');
    });
});
