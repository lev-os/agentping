import type { CreatePingRequest, HumanResponse, StepApprovalPayload } from '@agentping/core';

export const GENUI_RUNTIME_INTENT_SCHEMA = 'lev.genui.runtime_intent.v0';
export const GENUI_AGENTPING_APPROVAL_ADAPTER_SCHEMA = 'lev.agentping.runtime_intent_approval.v0';
export const GENUI_RUNTIME_APPROVAL_SCHEMA = 'lev.genui.approval.v0';

export interface RuntimeIntentDeclaration {
    kind: string;
    id: string;
    statementId?: string;
    capability?: string;
    guard?: string;
    effect?: string;
    route?: {
        owner?: string;
        capability?: string;
    };
    [key: string]: unknown;
}

export interface RuntimeIntentPacket {
    schema: string;
    version: number;
    source?: {
        id?: string;
        app?: string;
        surface?: string;
    };
    mode?: string;
    declarations: RuntimeIntentDeclaration[];
    policy: {
        rendererCanExecute: boolean;
        mutationsRequireApproval: boolean;
        dryRunOnly?: boolean;
        externalEffectsBlockedUntilApproved?: boolean;
        [key: string]: unknown;
    };
}

export interface BuildRuntimeIntentApprovalPingInput {
    runId: string;
    runtimeIntent: RuntimeIntentPacket;
    sessionId?: string;
    agentId?: string;
    agentName?: string;
    expiresInMs?: number;
}

export interface RuntimeIntentApprovalBridge {
    schema: typeof GENUI_AGENTPING_APPROVAL_ADAPTER_SCHEMA;
    runtimeIntentSchema: typeof GENUI_RUNTIME_INTENT_SCHEMA;
    runId: string;
    requiredStepIds: string[];
    rendererCanExecute: false;
    rendererNetworkOwner: false;
    networkOwner: 'agentping-host';
    approvalPayload: StepApprovalPayload;
    pingRequest: CreatePingRequest;
}

export interface RuntimeIntentApprovalDecision {
    schema: typeof GENUI_RUNTIME_APPROVAL_SCHEMA;
    runtimeIntentSchema: typeof GENUI_RUNTIME_INTENT_SCHEMA;
    runId: string;
    status: 'approved' | 'held';
    action: 'resume' | 'hold';
    approvedStepIds: string[];
    deniedStepIds: string[];
    rendererCanExecute: false;
    rendererNetworkOwner: false;
    networkOwner: 'agentping-host';
    respondedVia: string;
}

function requireRuntimeIntent(runtimeIntent: RuntimeIntentPacket): void {
    if (runtimeIntent.schema !== GENUI_RUNTIME_INTENT_SCHEMA) {
        throw new Error(`Unsupported runtime intent schema: ${runtimeIntent.schema}`);
    }
    if (runtimeIntent.policy.rendererCanExecute !== false) {
        throw new Error('AgentPing approval bridge refuses renderer-executable runtime intent');
    }
    if (runtimeIntent.policy.mutationsRequireApproval !== true) {
        throw new Error('AgentPing approval bridge requires policy.mutationsRequireApproval=true');
    }
}

function approvalMutations(runtimeIntent: RuntimeIntentPacket): RuntimeIntentDeclaration[] {
    return runtimeIntent.declarations.filter((declaration) =>
        declaration.kind === 'mutation' && String(declaration.guard ?? '').includes('approval')
    );
}

function approvalTitle(runtimeIntent: RuntimeIntentPacket): string {
    const source = runtimeIntent.source;
    return `Approve GenUI runtime intent: ${source?.app ?? source?.id ?? 'unnamed app'}`;
}

function approvalContext(runtimeIntent: RuntimeIntentPacket): string {
    const source = runtimeIntent.source;
    return [
        'AgentPing owns the human decision boundary for this runtime intent.',
        'Renderers cannot call AgentPing, Poly, daemon, or Exec directly.',
        `Source: ${source?.id ?? 'unknown'} ${source?.surface ? `(${source.surface})` : ''}`.trim(),
        `Mode: ${runtimeIntent.mode ?? 'unknown'}; dry-run only: ${runtimeIntent.policy.dryRunOnly === true ? 'yes' : 'no'}`,
    ].join('\n');
}

export function buildRuntimeIntentApprovalPing(input: BuildRuntimeIntentApprovalPingInput): RuntimeIntentApprovalBridge {
    requireRuntimeIntent(input.runtimeIntent);
    const mutations = approvalMutations(input.runtimeIntent);
    if (mutations.length === 0) {
        throw new Error('AgentPing approval bridge requires at least one approval-guarded mutation');
    }

    const steps = mutations.map((mutation) => ({
        id: mutation.id,
        description: `${mutation.capability ?? mutation.id} via ${mutation.route?.owner ?? 'FlowMind/Poly'}`,
        risk: mutation.effect === 'external_effect' ? 'high' as const : 'medium' as const,
        reversible: input.runtimeIntent.policy.dryRunOnly === true,
        details: JSON.stringify({
            runId: input.runId,
            statementId: mutation.statementId ?? mutation.id,
            capability: mutation.capability ?? mutation.id,
            guard: mutation.guard ?? null,
            effect: mutation.effect ?? null,
            route: mutation.route ?? null,
            rendererCanExecute: false,
            executionOwner: 'Exec/Daemon',
        }),
    }));

    const approvalPayload: StepApprovalPayload = {
        type: 'step_approval',
        title: approvalTitle(input.runtimeIntent),
        context: approvalContext(input.runtimeIntent),
        steps,
        allowPartial: false,
        defaultApproved: [],
    };

    const pingRequest: CreatePingRequest = {
        agentId: input.agentId ?? 'lev.genui.runtime-intent',
        agentName: input.agentName ?? 'Lev GenUI Runtime Intent',
        sessionId: input.sessionId ?? input.runId,
        payload: approvalPayload,
        expiresInMs: input.expiresInMs,
    };

    return {
        schema: GENUI_AGENTPING_APPROVAL_ADAPTER_SCHEMA,
        runtimeIntentSchema: GENUI_RUNTIME_INTENT_SCHEMA,
        runId: input.runId,
        requiredStepIds: steps.map((step) => step.id),
        rendererCanExecute: false,
        rendererNetworkOwner: false,
        networkOwner: 'agentping-host',
        approvalPayload,
        pingRequest,
    };
}

export function resolveRuntimeIntentApprovalResponse(
    bridge: RuntimeIntentApprovalBridge,
    response: HumanResponse
): RuntimeIntentApprovalDecision {
    const approvedStepIds = response.data.type === 'step_approval' ? response.data.approvedSteps : [];
    const deniedStepIds = response.data.type === 'step_approval' ? response.data.deniedSteps : bridge.requiredStepIds;
    const approved = response.action === 'approved'
        && response.data.type === 'step_approval'
        && deniedStepIds.length === 0
        && bridge.requiredStepIds.every((stepId) => approvedStepIds.includes(stepId));

    return {
        schema: GENUI_RUNTIME_APPROVAL_SCHEMA,
        runtimeIntentSchema: bridge.runtimeIntentSchema,
        runId: bridge.runId,
        status: approved ? 'approved' : 'held',
        action: approved ? 'resume' : 'hold',
        approvedStepIds,
        deniedStepIds,
        rendererCanExecute: false,
        rendererNetworkOwner: false,
        networkOwner: 'agentping-host',
        respondedVia: response.respondedVia,
    };
}
