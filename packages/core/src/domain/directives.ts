/**
 * AgentPing Directive System
 * 
 * Structured hints that agents can understand and act on.
 * This is how humans add rich feedback beyond yes/no.
 */

import { z } from 'zod';

// ============================================================================
// Directive Types
// ============================================================================

export const FocusOnDirectiveSchema = z.object({
    type: z.literal('focus_on'),
    target: z.string(),
});

export const SkipDirectiveSchema = z.object({
    type: z.literal('skip'),
    target: z.string(),
    reason: z.string().optional(),
});

export const DeepResearchDirectiveSchema = z.object({
    type: z.literal('deep_research'),
    topic: z.string(),
});

export const SimplifyDirectiveSchema = z.object({
    type: z.literal('simplify'),
    aspect: z.string().optional(),
});

export const ExpandDirectiveSchema = z.object({
    type: z.literal('expand'),
    section: z.string(),
});

export const PrioritizeDirectiveSchema = z.object({
    type: z.literal('prioritize'),
    items: z.array(z.string()),
});

export const ConstraintDirectiveSchema = z.object({
    type: z.literal('constraint'),
    rule: z.string(),
});

export const ReferenceDirectiveSchema = z.object({
    type: z.literal('reference'),
    url: z.string().url(),
    note: z.string().optional(),
});

export const AlternativeDirectiveSchema = z.object({
    type: z.literal('alternative'),
    suggestion: z.string(),
});

export const TimelineDirectiveSchema = z.object({
    type: z.literal('timeline'),
    deadline: z.string(),
    flexibility: z.enum(['hard', 'soft']),
});

export const CustomDirectiveSchema = z.object({
    type: z.literal('custom'),
    key: z.string(),
    value: z.unknown(),
});

// Union of all directive types
export const DirectiveSchema = z.discriminatedUnion('type', [
    FocusOnDirectiveSchema,
    SkipDirectiveSchema,
    DeepResearchDirectiveSchema,
    SimplifyDirectiveSchema,
    ExpandDirectiveSchema,
    PrioritizeDirectiveSchema,
    ConstraintDirectiveSchema,
    ReferenceDirectiveSchema,
    AlternativeDirectiveSchema,
    TimelineDirectiveSchema,
    CustomDirectiveSchema,
]);

export type Directive = z.infer<typeof DirectiveSchema>;

// Individual directive types
export type FocusOnDirective = z.infer<typeof FocusOnDirectiveSchema>;
export type SkipDirective = z.infer<typeof SkipDirectiveSchema>;
export type DeepResearchDirective = z.infer<typeof DeepResearchDirectiveSchema>;
export type SimplifyDirective = z.infer<typeof SimplifyDirectiveSchema>;
export type ExpandDirective = z.infer<typeof ExpandDirectiveSchema>;
export type PrioritizeDirective = z.infer<typeof PrioritizeDirectiveSchema>;
export type ConstraintDirective = z.infer<typeof ConstraintDirectiveSchema>;
export type ReferenceDirective = z.infer<typeof ReferenceDirectiveSchema>;
export type AlternativeDirective = z.infer<typeof AlternativeDirectiveSchema>;
export type TimelineDirective = z.infer<typeof TimelineDirectiveSchema>;
export type CustomDirective = z.infer<typeof CustomDirectiveSchema>;

// ============================================================================
// Directive Type Registry
// ============================================================================

export const DIRECTIVE_TYPES = [
    'focus_on',
    'skip',
    'deep_research',
    'simplify',
    'expand',
    'prioritize',
    'constraint',
    'reference',
    'alternative',
    'timeline',
    'custom',
] as const;

export type DirectiveType = typeof DIRECTIVE_TYPES[number];

// ============================================================================
// Directive Metadata (for UI)
// ============================================================================

export interface DirectiveMetadata {
    type: DirectiveType;
    label: string;
    description: string;
    icon: string;
    requiresInput: boolean;
    inputPlaceholder?: string;
}

export const DIRECTIVE_METADATA: Record<DirectiveType, DirectiveMetadata> = {
    focus_on: {
        type: 'focus_on',
        label: 'Focus On',
        description: 'Direct the agent to focus on a specific area',
        icon: '🎯',
        requiresInput: true,
        inputPlaceholder: 'e.g., the authentication flow',
    },
    skip: {
        type: 'skip',
        label: 'Skip',
        description: 'Tell the agent to skip or ignore something',
        icon: '⏭️',
        requiresInput: true,
        inputPlaceholder: 'e.g., unit tests',
    },
    deep_research: {
        type: 'deep_research',
        label: 'Deep Research',
        description: 'Request deeper investigation on a topic',
        icon: '🔬',
        requiresInput: true,
        inputPlaceholder: 'e.g., performance implications',
    },
    simplify: {
        type: 'simplify',
        label: 'Simplify',
        description: 'The output or approach is too complex',
        icon: '✂️',
        requiresInput: false,
        inputPlaceholder: 'e.g., the data model',
    },
    expand: {
        type: 'expand',
        label: 'Expand',
        description: 'Request more detail on something',
        icon: '📝',
        requiresInput: true,
        inputPlaceholder: 'e.g., error handling',
    },
    prioritize: {
        type: 'prioritize',
        label: 'Prioritize',
        description: 'Specify priority order',
        icon: '📊',
        requiresInput: true,
        inputPlaceholder: 'e.g., security, performance, readability',
    },
    constraint: {
        type: 'constraint',
        label: 'Constraint',
        description: 'Add a rule or constraint to follow',
        icon: '🚧',
        requiresInput: true,
        inputPlaceholder: 'e.g., must be backwards compatible',
    },
    reference: {
        type: 'reference',
        label: 'Reference',
        description: 'Provide a reference URL to check',
        icon: '🔗',
        requiresInput: true,
        inputPlaceholder: 'https://...',
    },
    alternative: {
        type: 'alternative',
        label: 'Alternative',
        description: 'Suggest an alternative approach',
        icon: '💡',
        requiresInput: true,
        inputPlaceholder: 'e.g., consider using Redis instead',
    },
    timeline: {
        type: 'timeline',
        label: 'Timeline',
        description: 'Specify a time constraint',
        icon: '⏰',
        requiresInput: true,
        inputPlaceholder: 'e.g., end of day',
    },
    custom: {
        type: 'custom',
        label: 'Custom',
        description: 'Add a custom directive',
        icon: '⚙️',
        requiresInput: true,
        inputPlaceholder: 'key: value',
    },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a directive from a type and value
 */
export function createDirective(type: DirectiveType, value: string): Directive {
    switch (type) {
        case 'focus_on':
            return { type: 'focus_on', target: value };
        case 'skip':
            return { type: 'skip', target: value };
        case 'deep_research':
            return { type: 'deep_research', topic: value };
        case 'simplify':
            return { type: 'simplify', aspect: value || undefined };
        case 'expand':
            return { type: 'expand', section: value };
        case 'prioritize':
            return { type: 'prioritize', items: value.split(',').map(s => s.trim()) };
        case 'constraint':
            return { type: 'constraint', rule: value };
        case 'reference':
            return { type: 'reference', url: value };
        case 'alternative':
            return { type: 'alternative', suggestion: value };
        case 'timeline':
            return { type: 'timeline', deadline: value, flexibility: 'soft' };
        case 'custom':
            const [key, ...rest] = value.split(':');
            return { type: 'custom', key: key.trim(), value: rest.join(':').trim() };
    }
}

/**
 * Format a directive for display
 */
export function formatDirective(directive: Directive): string {
    const meta = DIRECTIVE_METADATA[directive.type];

    switch (directive.type) {
        case 'focus_on':
            return `${meta.icon} Focus on: ${directive.target}`;
        case 'skip':
            return `${meta.icon} Skip: ${directive.target}${directive.reason ? ` (${directive.reason})` : ''}`;
        case 'deep_research':
            return `${meta.icon} Deep research: ${directive.topic}`;
        case 'simplify':
            return `${meta.icon} Simplify${directive.aspect ? `: ${directive.aspect}` : ''}`;
        case 'expand':
            return `${meta.icon} Expand: ${directive.section}`;
        case 'prioritize':
            return `${meta.icon} Prioritize: ${directive.items.join(' → ')}`;
        case 'constraint':
            return `${meta.icon} Constraint: ${directive.rule}`;
        case 'reference':
            return `${meta.icon} Reference: ${directive.url}${directive.note ? ` (${directive.note})` : ''}`;
        case 'alternative':
            return `${meta.icon} Alternative: ${directive.suggestion}`;
        case 'timeline':
            return `${meta.icon} Timeline: ${directive.deadline} (${directive.flexibility})`;
        case 'custom':
            return `${meta.icon} ${directive.key}: ${String(directive.value)}`;
    }
}
