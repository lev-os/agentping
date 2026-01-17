/**
 * Unit Tests for Parsers
 */

import { describe, it, expect } from 'vitest';
import {
    stepApprovalParser,
    approvalParser,
    questionParser,
    notificationParser,
} from '../parsers';
import type { Ping, PingPayload, ParsedInteraction } from '../domain/ping';

// ============================================================================
// Helper
// ============================================================================

function createPing(payload: PingPayload): Ping {
    return {
        id: 'test-id',
        agentId: 'test-agent',
        agentName: 'Test Agent',
        sessionId: 'test-session',
        type: payload.type,
        payload,
        status: 'pending',
        response: null,
        createdAt: new Date(),
        respondedAt: null,
        expiresAt: new Date(Date.now() + 86400000),
        parsedInteraction: null,
    };
}

// ============================================================================
// Tests
// ============================================================================

describe('Parsers', () => {
    describe('notificationParser', () => {
        it('should parse notification payload', () => {
            const ping = createPing({
                type: 'notification',
                message: 'Test notification',
            } as PingPayload);

            expect(notificationParser.canParse(ping)).toBe(true);

            const result = notificationParser.parse(ping);
            expect(result.interactionType).toBe('notification');
            expect(result.quickActions).toContainEqual(
                expect.objectContaining({ id: 'dismiss' })
            );
        });
    });

    describe('questionParser', () => {
        it('should parse question with options', () => {
            const ping = createPing({
                type: 'question',
                question: 'What is your choice?',
                options: ['A', 'B', 'C'],
            } as PingPayload);

            expect(questionParser.canParse(ping)).toBe(true);

            const result = questionParser.parse(ping);
            expect(result.interactionType).toBe('question');
            expect(result.quickActions).toHaveLength(4); // 3 options + "Type Answer..."
        });

        it('should handle question without options', () => {
            const ping = createPing({
                type: 'question',
                question: 'Free form question?',
            } as PingPayload);

            const result = questionParser.parse(ping);
            expect(result.interactionType).toBe('question');
            expect((result.uiHints as Record<string, unknown>).allowFreeform).toBe(true);
        });
    });

    describe('approvalParser', () => {
        it('should parse approval request', () => {
            const ping = createPing({
                type: 'approval',
                title: 'Approve this action',
                action: 'Deploy to production',
                risk: 'high',
            } as PingPayload);

            expect(approvalParser.canParse(ping)).toBe(true);

            const result = approvalParser.parse(ping);
            expect(result.interactionType).toBe('approval');
            expect(result.quickActions).toContainEqual(
                expect.objectContaining({ id: 'approve', shortcut: 'y' })
            );
            expect(result.quickActions).toContainEqual(
                expect.objectContaining({ id: 'deny', shortcut: 'n' })
            );
        });

        it('should include risk level in uiHints', () => {
            const ping = createPing({
                type: 'approval',
                title: 'Test',
                action: 'Test action',
                risk: 'medium',
            } as PingPayload);

            const result = approvalParser.parse(ping);
            expect((result.uiHints as Record<string, unknown>).showRisk).toBe('medium');
        });
    });

    describe('stepApprovalParser', () => {
        it('should parse step approval with multiple steps', () => {
            const ping = createPing({
                type: 'step_approval',
                title: 'Multi-step approval',
                steps: [
                    { id: 's1', description: 'Step 1', risk: 'low', reversible: true },
                    { id: 's2', description: 'Step 2', risk: 'high', reversible: false },
                ],
            } as PingPayload);

            expect(stepApprovalParser.canParse(ping)).toBe(true);

            const result = stepApprovalParser.parse(ping);
            expect(result.interactionType).toBe('step-checklist');
            const steps = (result.uiHints as Record<string, unknown>).steps as unknown[];
            expect(steps).toHaveLength(2);
            expect(result.quickActions).toContainEqual(
                expect.objectContaining({ id: 'approve-all' })
            );
        });

        it('should calculate low-risk steps correctly', () => {
            const ping = createPing({
                type: 'step_approval',
                title: 'Test',
                steps: [
                    { id: 's1', description: 'Low 1', risk: 'low', reversible: true },
                    { id: 's2', description: 'Low 2', risk: 'low', reversible: true },
                    { id: 's3', description: 'High', risk: 'high', reversible: false },
                ],
            } as PingPayload);

            const result = stepApprovalParser.parse(ping);
            const lowRiskAction = result.quickActions.find(a => a.id === 'approve-low-risk');
            expect(lowRiskAction?.label).toBe('Approve Low Risk (2)');
        });

        it('should handle empty defaultApproved', () => {
            const ping = createPing({
                type: 'step_approval',
                title: 'Test',
                steps: [{ id: 's1', description: 'Step', risk: 'low', reversible: true }],
                // No defaultApproved field
            } as PingPayload);

            // Should not throw
            const result = stepApprovalParser.parse(ping);
            const steps = (result.uiHints as Record<string, unknown>).steps as Array<{ defaultChecked: boolean }>;
            expect(steps[0].defaultChecked).toBe(false);
        });
    });
});
