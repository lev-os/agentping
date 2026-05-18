import { describe, expect, it } from 'vitest';
import type { HumanResponse } from '@agentping/core';
import {
    buildRuntimeIntentApprovalPing,
    GENUI_AGENTPING_APPROVAL_ADAPTER_SCHEMA,
    GENUI_RUNTIME_APPROVAL_SCHEMA,
    GENUI_RUNTIME_INTENT_SCHEMA,
    resolveRuntimeIntentApprovalResponse,
    type RuntimeIntentPacket,
} from '../src/runtime-intent-approval.js';

function runtimeIntent(overrides: Partial<RuntimeIntentPacket> = {}): RuntimeIntentPacket {
    return {
        schema: GENUI_RUNTIME_INTENT_SCHEMA,
        version: 0,
        source: { id: 'brief-dashboard-agentping', app: 'Operator Briefs', surface: '/briefs' },
        mode: 'declaration_only',
        declarations: [
            {
                kind: 'mutation',
                id: 'ask_human',
                statementId: 'mutation.ask_human',
                capability: 'agentping.question.create',
                guard: 'approval.required',
                effect: 'hitl_gate',
                route: { owner: 'FlowMind/Poly', capability: 'agentping.question.create' },
            },
            {
                kind: 'target',
                id: 'daemon_dry_run',
                capability: 'genui.runtime.dry_run',
            },
        ],
        policy: {
            rendererCanExecute: false,
            mutationsRequireApproval: true,
            dryRunOnly: true,
            externalEffectsBlockedUntilApproved: true,
        },
        ...overrides,
    };
}

function response(data: HumanResponse['data'], action: HumanResponse['action'] = 'approved'): HumanResponse {
    return {
        action,
        data,
        respondedAt: new Date('2026-05-17T00:00:00.000Z'),
        respondedVia: 'agentping-fixture',
    };
}

describe('runtime intent approval bridge', () => {
    it('builds an AgentPing step approval payload without giving renderers network ownership', () => {
        const bridge = buildRuntimeIntentApprovalPing({
            runId: 'run-s4',
            runtimeIntent: runtimeIntent(),
        });

        expect(bridge.schema).toBe(GENUI_AGENTPING_APPROVAL_ADAPTER_SCHEMA);
        expect(bridge.rendererCanExecute).toBe(false);
        expect(bridge.rendererNetworkOwner).toBe(false);
        expect(bridge.networkOwner).toBe('agentping-host');
        expect(bridge.pingRequest).toEqual(expect.objectContaining({
            agentId: 'lev.genui.runtime-intent',
            agentName: 'Lev GenUI Runtime Intent',
            sessionId: 'run-s4',
        }));
        expect(bridge.pingRequest.payload).toEqual(expect.objectContaining({
            type: 'step_approval',
            allowPartial: false,
            defaultApproved: [],
        }));
        expect(bridge.approvalPayload.steps).toEqual([
            expect.objectContaining({
                id: 'ask_human',
                reversible: true,
                details: expect.stringContaining('"executionOwner":"Exec/Daemon"'),
            }),
        ]);
    });

    it('refuses runtime intent packets that allow renderer execution', () => {
        expect(() => buildRuntimeIntentApprovalPing({
            runId: 'run-bad',
            runtimeIntent: runtimeIntent({
                policy: {
                    rendererCanExecute: true,
                    mutationsRequireApproval: true,
                    dryRunOnly: true,
                },
            }),
        })).toThrow('refuses renderer-executable runtime intent');
    });

    it('resolves complete approval to resume', () => {
        const bridge = buildRuntimeIntentApprovalPing({
            runId: 'run-s4',
            runtimeIntent: runtimeIntent(),
        });

        const decision = resolveRuntimeIntentApprovalResponse(bridge, response({
            type: 'step_approval',
            approvedSteps: ['ask_human'],
            deniedSteps: [],
        }));

        expect(decision).toEqual(expect.objectContaining({
            schema: GENUI_RUNTIME_APPROVAL_SCHEMA,
            runId: 'run-s4',
            status: 'approved',
            action: 'resume',
            rendererCanExecute: false,
            rendererNetworkOwner: false,
        }));
    });

    it('resolves denied or partial approval to hold', () => {
        const bridge = buildRuntimeIntentApprovalPing({
            runId: 'run-s4',
            runtimeIntent: runtimeIntent(),
        });

        const decision = resolveRuntimeIntentApprovalResponse(bridge, response({
            type: 'step_approval',
            approvedSteps: [],
            deniedSteps: ['ask_human'],
        }, 'denied'));

        expect(decision).toEqual(expect.objectContaining({
            status: 'held',
            action: 'hold',
            deniedStepIds: ['ask_human'],
            networkOwner: 'agentping-host',
        }));
    });
});
