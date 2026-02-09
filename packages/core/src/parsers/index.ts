/**
 * Interaction Parsers
 *
 * Turn ping payloads into UI hints for rendering.
 *
 * Each parser is built via the createParser() factory which eliminates
 * boilerplate around canParse / parse / priority.
 */

import type {
    Ping,
    ParsedInteraction,
    QuickAction,
    PingPayload,
    StepApprovalPayload,
    ResearchRequestPayload,
    SelectionPayload,
    LeaseRequestPayload,
} from '../domain/ping.js';
import type { IInteractionParser } from '../ports/parser.js';

// ============================================================================
// Parser Factory
// ============================================================================

export interface ParserConfig {
    name: string;
    /** Payload type to match (checked against ping.payload.type) */
    type: string;
    /** Priority — higher values are tried first. Defaults to 50. */
    priority?: number;
    /** Extract the unique parts of the parsed interaction from the payload. */
    parsePayload: (payload: PingPayload, ping: Ping) => {
        interactionType: string;
        quickActions: QuickAction[];
        uiHints: Record<string, unknown>;
        fallbackText: string;
        fallbackOptions?: string[];
    };
}

export function createParser(config: ParserConfig): IInteractionParser {
    return {
        name: config.name,
        priority: config.priority ?? 50,

        canParse(ping: Ping): boolean {
            return ping.payload.type === config.type;
        },

        parse(ping: Ping): ParsedInteraction {
            const result = config.parsePayload(ping.payload, ping);
            return {
                interactionType: result.interactionType,
                quickActions: result.quickActions,
                uiHints: result.uiHints,
                fallbackText: result.fallbackText,
                fallbackOptions: result.fallbackOptions ?? [],
            };
        },
    };
}

// ============================================================================
// Step Approval Parser
// ============================================================================

export const stepApprovalParser: IInteractionParser = createParser({
    name: 'step-approval',
    type: 'step_approval',
    parsePayload(payload) {
        const p = payload as StepApprovalPayload;
        const lowRiskSteps = p.steps.filter(s => s.risk === 'low');
        const lowRiskIds = lowRiskSteps.map(s => s.id);

        const quickActions: QuickAction[] = [
            {
                id: 'approve-all',
                label: 'Approve All',
                shortcut: 'a',
                style: 'primary',
                action: { type: 'approve_all' },
            },
        ];

        if (lowRiskIds.length > 0 && lowRiskIds.length < p.steps.length) {
            quickActions.push({
                id: 'approve-low-risk',
                label: `Approve Low Risk (${lowRiskIds.length})`,
                style: 'secondary',
                action: { type: 'approve_selected', ids: lowRiskIds },
            });
        }

        quickActions.push({
            id: 'deny-all',
            label: 'Deny All',
            shortcut: 'd',
            style: 'danger',
            action: { type: 'deny_all' },
        });

        return {
            interactionType: 'step-checklist',
            quickActions,
            uiHints: {
                groupByRisk: true,
                showReversibleBadge: true,
                defaultExpanded: p.steps.length < 5,
                suggestedDirectives: ['constraint', 'skip', 'prioritize'],
                steps: p.steps.map(step => ({
                    ...step,
                    defaultChecked: (p.defaultApproved ?? []).includes(step.id),
                })),
            },
            fallbackText: `Approve ${p.steps.length} steps for: ${p.title}`,
            fallbackOptions: ['Approve all', 'Deny all', 'Open in UI'],
        };
    },
});

// ============================================================================
// Research Direction Parser
// ============================================================================

export const researchDirectiveParser: IInteractionParser = createParser({
    name: 'research-directive',
    type: 'research_request',
    parsePayload(payload) {
        const p = payload as ResearchRequestPayload;

        const quickActions: QuickAction[] = p.proposedDirections.map(d => ({
            id: `select-${d.id}`,
            label: d.direction,
            style: 'secondary' as const,
            action: { type: 'select' as const, ids: [d.id] },
        }));

        quickActions.push({
            id: 'all',
            label: 'All Directions',
            style: 'primary',
            action: { type: 'select', ids: p.proposedDirections.map(d => d.id) },
        });

        if (p.allowCustomDirection) {
            quickActions.push({
                id: 'custom',
                label: 'Custom Direction...',
                style: 'ghost',
                action: { type: 'open_detail' },
            });
        }

        return {
            interactionType: 'direction-picker',
            quickActions,
            uiHints: {
                showEffortBadges: true,
                showRationale: true,
                suggestedDirectives: ['focus_on', 'skip', 'deep_research', 'reference'],
                directions: p.proposedDirections,
                currentFindings: p.currentFindings,
            },
            fallbackText: `Choose research direction: ${p.proposedDirections.map(d => d.direction).join(', ')}`,
            fallbackOptions: p.proposedDirections.map(d => d.direction),
        };
    },
});

// ============================================================================
// Selection Parser
// ============================================================================

export const selectionParser: IInteractionParser = createParser({
    name: 'selection',
    type: 'selection',
    parsePayload(payload) {
        const p = payload as SelectionPayload;
        const quickActions: QuickAction[] = [];

        // If few options, show as direct buttons
        if (p.options.length <= 4) {
            p.options.forEach(opt => {
                quickActions.push({
                    id: `select-${opt.id}`,
                    label: opt.label,
                    style: 'secondary',
                    action: { type: 'select', ids: [opt.id] },
                });
            });
        } else {
            quickActions.push({
                id: 'select-in-ui',
                label: 'Select in UI',
                style: 'primary',
                action: { type: 'open_detail' },
            });
        }

        if (p.allowMultiple) {
            quickActions.push({
                id: 'select-all',
                label: 'Select All',
                style: 'secondary',
                action: { type: 'select', ids: p.options.map(o => o.id) },
            });
        }

        if (p.allowCustom) {
            quickActions.push({
                id: 'custom',
                label: 'Custom...',
                style: 'ghost',
                action: { type: 'open_detail' },
            });
        }

        return {
            interactionType: 'selection',
            quickActions,
            uiHints: {
                allowMultiple: p.allowMultiple,
                allowCustom: p.allowCustom,
                minSelections: p.minSelections,
                maxSelections: p.maxSelections,
                showPreview: p.options.some(o => o.preview),
                options: p.options,
            },
            fallbackText: `Select from: ${p.options.map(o => o.label).join(', ')}`,
            fallbackOptions: p.options.map(o => o.label),
        };
    },
});

// ============================================================================
// Approval Parser
// ============================================================================

export const approvalParser: IInteractionParser = createParser({
    name: 'approval',
    type: 'approval',
    parsePayload(payload) {
        return {
            interactionType: 'approval',
            quickActions: [
                {
                    id: 'approve',
                    label: 'Approve',
                    shortcut: 'y',
                    style: 'primary',
                    action: { type: 'approve_all' },
                },
                {
                    id: 'deny',
                    label: 'Deny',
                    shortcut: 'n',
                    style: 'danger',
                    action: { type: 'deny_all' },
                },
            ],
            uiHints: {
                suggestedDirectives: ['constraint', 'alternative'],
                showRisk: 'risk' in payload && payload.risk,
            },
            fallbackText: `Approve: ${'title' in payload ? payload.title : 'Action'}`,
            fallbackOptions: ['Approve', 'Deny'],
        };
    },
});

// ============================================================================
// Question Parser
// ============================================================================

export const questionParser: IInteractionParser = createParser({
    name: 'question',
    type: 'question',
    parsePayload(payload) {
        const p = payload as {
            question: string;
            context?: string;
            options?: string[];
            allowFreeform?: boolean;
        };
        const quickActions: QuickAction[] = [];

        if (p.options && p.options.length > 0) {
            p.options.forEach((opt, i) => {
                quickActions.push({
                    id: `option-${i}`,
                    label: opt,
                    style: 'secondary',
                    action: { type: 'custom', handler: 'answer', payload: { value: opt } },
                });
            });
        }

        if (!p.options || p.options.length === 0 || p.allowFreeform) {
            quickActions.push({
                id: 'answer-in-ui',
                label: 'Type Answer...',
                style: 'primary',
                action: { type: 'open_detail' },
            });
        }

        return {
            interactionType: 'question',
            quickActions,
            uiHints: {
                allowFreeform: p.allowFreeform ?? true,
                options: p.options,
                context: p.context,
            },
            fallbackText: p.question,
            fallbackOptions: p.options ?? ['Open in UI'],
        };
    },
});

// ============================================================================
// Notification Parser
// ============================================================================

export const notificationParser: IInteractionParser = createParser({
    name: 'notification',
    type: 'notification',
    parsePayload(payload) {
        return {
            interactionType: 'notification',
            quickActions: [
                {
                    id: 'dismiss',
                    label: 'Dismiss',
                    shortcut: 'Escape',
                    style: 'ghost',
                    action: { type: 'custom', handler: 'dismiss', payload: {} },
                },
            ],
            uiHints: {
                level: 'level' in payload ? payload.level : 'info',
                noResponseNeeded: true,
            },
            fallbackText: 'message' in payload ? payload.message : 'Notification',
            fallbackOptions: ['OK'],
        };
    },
});

// ============================================================================
// Lease Request Parser
// ============================================================================

export const leaseRequestParser: IInteractionParser = createParser({
    name: 'lease-request',
    type: 'lease_request',
    parsePayload(payload) {
        const p = payload as LeaseRequestPayload;

        const quickActions: QuickAction[] = [
            {
                id: 'grant',
                label: `Grant ${p.scope} lease (${p.ttl})`,
                shortcut: 'y',
                style: 'primary',
                action: { type: 'approve_all' },
            },
            {
                id: 'deny',
                label: 'Deny',
                shortcut: 'n',
                style: 'danger',
                action: { type: 'deny_all' },
            },
        ];

        return {
            interactionType: 'lease-approval',
            quickActions,
            uiHints: {
                scope: p.scope,
                ttl: p.ttl,
                reason: p.reason,
                constraints: p.constraints,
                suggestedDirectives: ['constraint', 'timeline'],
            },
            fallbackText: `Lease request: ${p.scope} for ${p.ttl} — ${p.reason}`,
            fallbackOptions: ['Grant', 'Deny'],
        };
    },
});

// ============================================================================
// Fallback Parser (lowest priority, always matches)
// ============================================================================

export const fallbackParser: IInteractionParser = {
    name: 'fallback',
    priority: 1,

    canParse(): boolean {
        return true; // Always matches
    },

    parse(ping: Ping): ParsedInteraction {
        return {
            interactionType: 'generic',
            quickActions: [
                {
                    id: 'open-in-ui',
                    label: 'Open in UI',
                    style: 'primary',
                    action: { type: 'open_detail' },
                },
                {
                    id: 'dismiss',
                    label: 'Dismiss',
                    style: 'ghost',
                    action: { type: 'custom', handler: 'dismiss', payload: {} },
                },
            ],
            uiHints: {},
            fallbackText: `Ping from ${ping.agentName}`,
            fallbackOptions: ['Open in UI', 'Dismiss'],
        };
    },
};

// ============================================================================
// Default Parsers Export
// ============================================================================

export const defaultParsers: IInteractionParser[] = [
    stepApprovalParser,
    researchDirectiveParser,
    selectionParser,
    approvalParser,
    questionParser,
    notificationParser,
    leaseRequestParser,
    fallbackParser,
];
