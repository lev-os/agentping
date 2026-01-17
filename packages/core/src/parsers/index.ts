/**
 * Interaction Parsers
 * 
 * Turn ping payloads into UI hints for rendering.
 */

import type { Ping, ParsedInteraction, QuickAction, StepApprovalPayload, ResearchRequestPayload, SelectionPayload } from '../domain/ping.js';
import type { IInteractionParser } from '../ports/parser.js';

// ============================================================================
// Step Approval Parser
// ============================================================================

export const stepApprovalParser: IInteractionParser = {
    name: 'step-approval',
    priority: 50,

    canParse(ping: Ping): boolean {
        return ping.payload.type === 'step_approval';
    },

    parse(ping: Ping): ParsedInteraction {
        const payload = ping.payload as StepApprovalPayload;
        const lowRiskSteps = payload.steps.filter(s => s.risk === 'low');
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

        if (lowRiskIds.length > 0 && lowRiskIds.length < payload.steps.length) {
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
                defaultExpanded: payload.steps.length < 5,
                suggestedDirectives: ['constraint', 'skip', 'prioritize'],
                steps: payload.steps.map(step => ({
                    ...step,
                    defaultChecked: (payload.defaultApproved ?? []).includes(step.id),
                })),
            },
            fallbackText: `Approve ${payload.steps.length} steps for: ${payload.title}`,
            fallbackOptions: ['Approve all', 'Deny all', 'Open in UI'],
        };
    },
};

// ============================================================================
// Research Direction Parser
// ============================================================================

export const researchDirectiveParser: IInteractionParser = {
    name: 'research-directive',
    priority: 50,

    canParse(ping: Ping): boolean {
        return ping.payload.type === 'research_request';
    },

    parse(ping: Ping): ParsedInteraction {
        const payload = ping.payload as ResearchRequestPayload;

        const quickActions: QuickAction[] = payload.proposedDirections.map(d => ({
            id: `select-${d.id}`,
            label: d.direction,
            style: 'secondary' as const,
            action: { type: 'select' as const, ids: [d.id] },
        }));

        quickActions.push({
            id: 'all',
            label: 'All Directions',
            style: 'primary',
            action: { type: 'select', ids: payload.proposedDirections.map(d => d.id) },
        });

        if (payload.allowCustomDirection) {
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
                directions: payload.proposedDirections,
                currentFindings: payload.currentFindings,
            },
            fallbackText: `Choose research direction: ${payload.proposedDirections.map(d => d.direction).join(', ')}`,
            fallbackOptions: payload.proposedDirections.map(d => d.direction),
        };
    },
};

// ============================================================================
// Selection Parser
// ============================================================================

export const selectionParser: IInteractionParser = {
    name: 'selection',
    priority: 50,

    canParse(ping: Ping): boolean {
        return ping.payload.type === 'selection';
    },

    parse(ping: Ping): ParsedInteraction {
        const payload = ping.payload as SelectionPayload;
        const quickActions: QuickAction[] = [];

        // If few options, show as direct buttons
        if (payload.options.length <= 4) {
            payload.options.forEach(opt => {
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

        if (payload.allowMultiple) {
            quickActions.push({
                id: 'select-all',
                label: 'Select All',
                style: 'secondary',
                action: { type: 'select', ids: payload.options.map(o => o.id) },
            });
        }

        if (payload.allowCustom) {
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
                allowMultiple: payload.allowMultiple,
                allowCustom: payload.allowCustom,
                minSelections: payload.minSelections,
                maxSelections: payload.maxSelections,
                showPreview: payload.options.some(o => o.preview),
                options: payload.options,
            },
            fallbackText: `Select from: ${payload.options.map(o => o.label).join(', ')}`,
            fallbackOptions: payload.options.map(o => o.label),
        };
    },
};

// ============================================================================
// Approval Parser
// ============================================================================

export const approvalParser: IInteractionParser = {
    name: 'approval',
    priority: 50,

    canParse(ping: Ping): boolean {
        return ping.payload.type === 'approval';
    },

    parse(ping: Ping): ParsedInteraction {
        const payload = ping.payload;

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
};

// ============================================================================
// Question Parser
// ============================================================================

export const questionParser: IInteractionParser = {
    name: 'question',
    priority: 50,

    canParse(ping: Ping): boolean {
        return ping.payload.type === 'question';
    },

    parse(ping: Ping): ParsedInteraction {
        const payload = ping.payload as {
            question: string;
            context?: string;
            options?: string[];
            allowFreeform?: boolean;
        };
        const quickActions: QuickAction[] = [];

        if (payload.options && payload.options.length > 0) {
            payload.options.forEach((opt, i) => {
                quickActions.push({
                    id: `option-${i}`,
                    label: opt,
                    style: 'secondary',
                    action: { type: 'custom', handler: 'answer', payload: { value: opt } },
                });
            });
        }

        if (!payload.options || payload.options.length === 0 || payload.allowFreeform) {
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
                allowFreeform: payload.allowFreeform ?? true,
                options: payload.options,
                context: payload.context,
            },
            fallbackText: payload.question,
            fallbackOptions: payload.options ?? ['Open in UI'],
        };
    },
};

// ============================================================================
// Notification Parser
// ============================================================================

export const notificationParser: IInteractionParser = {
    name: 'notification',
    priority: 50,

    canParse(ping: Ping): boolean {
        return ping.payload.type === 'notification';
    },

    parse(ping: Ping): ParsedInteraction {
        const payload = ping.payload;

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
};

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
    fallbackParser,
];
