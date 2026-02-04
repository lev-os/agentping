/**
 * AgentPing Core Domain Models
 * 
 * The fundamental unit of agent-human communication.
 */

import { z } from 'zod';

// ============================================================================
// Ping Types
// ============================================================================

export const PingTypeSchema = z.enum([
    'notification',      // FYI, no response needed
    'question',          // Need an answer
    'approval',          // Yes/no for an action
    'step_approval',     // Approve N of M steps
    'research_request',  // Agent wants direction on research
    'review_request',    // Agent wants feedback on output
    'selection',         // Pick from options
    'task_workflow',     // Multi-step task for human to complete
    'custom',            // Extensible
    'secret',            // Secure input request
    'canvas_interaction', // Studio managing canvas
    'lease_request',     // Agent requests a scoped capability lease (e.g. browser)
]);

export type PingType = z.infer<typeof PingTypeSchema>;

// ============================================================================
// Ping Payloads (Type-Specific Structured Data)
// ============================================================================

export const StepSchema = z.object({
    id: z.string(),
    description: z.string().min(1, "Step description is required"),
    risk: z.enum(['low', 'medium', 'high']),
    reversible: z.boolean(),
    details: z.string().optional(),
    estimatedImpact: z.string().optional(),
});

export type Step = z.infer<typeof StepSchema>;

export const StepApprovalPayloadSchema = z.object({
    type: z.literal('step_approval'),
    title: z.string().min(1, "Title is required"),
    context: z.string(),
    steps: z.array(StepSchema),
    allowPartial: z.boolean(),
    defaultApproved: z.array(z.string()),
});

export type StepApprovalPayload = z.infer<typeof StepApprovalPayloadSchema>;

export const ResearchDirectionSchema = z.object({
    id: z.string(),
    direction: z.string().min(1, "Direction is required"),
    rationale: z.string(),
    estimatedEffort: z.enum(['quick', 'medium', 'deep']),
});

export type ResearchDirection = z.infer<typeof ResearchDirectionSchema>;

export const ResearchRequestPayloadSchema = z.object({
    type: z.literal('research_request'),
    title: z.string().min(1, "Title is required"),
    currentFindings: z.string(),
    proposedDirections: z.array(ResearchDirectionSchema),
    allowCustomDirection: z.boolean(),
});

export type ResearchRequestPayload = z.infer<typeof ResearchRequestPayloadSchema>;

export const SelectionOptionSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Option label is required"),
    description: z.string().optional(),
    preview: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SelectionOption = z.infer<typeof SelectionOptionSchema>;

export const SelectionPayloadSchema = z.object({
    type: z.literal('selection'),
    title: z.string().min(1, "Title is required"),
    context: z.string(),
    options: z.array(SelectionOptionSchema),
    allowMultiple: z.boolean(),
    allowCustom: z.boolean(),
    minSelections: z.number().optional(),
    maxSelections: z.number().optional(),
});

export type SelectionPayload = z.infer<typeof SelectionPayloadSchema>;

export const ApprovalPayloadSchema = z.object({
    type: z.literal('approval'),
    title: z.string().min(1, "Title is required"),
    action: z.string(),
    details: z.string().optional(),
    risk: z.enum(['low', 'medium', 'high']).optional(),
});

export type ApprovalPayload = z.infer<typeof ApprovalPayloadSchema>;

export const QuestionPayloadSchema = z.object({
    type: z.literal('question'),
    question: z.string().min(1, "Question is required"),
    context: z.string().optional(),
    options: z.array(z.string()).optional(),
    allowFreeform: z.boolean().default(true),
});

export type QuestionPayload = z.infer<typeof QuestionPayloadSchema>;

export const NotificationPayloadSchema = z.object({
    type: z.literal('notification'),
    message: z.string().min(1, "Message is required"),
    level: z.enum(['info', 'success', 'warning', 'error']).default('info'),
});

export type NotificationPayload = z.infer<typeof NotificationPayloadSchema>;

export const ReviewRequestPayloadSchema = z.object({
    type: z.literal('review_request'),
    title: z.string().min(1, "Title is required"),
    content: z.string(),
    contentType: z.enum(['code', 'text', 'markdown', 'json']).default('text'),
    filePath: z.string().optional(),
});

export type ReviewRequestPayload = z.infer<typeof ReviewRequestPayloadSchema>;

export const SecretPayloadSchema = z.object({
    type: z.literal('secret'),
    title: z.string().min(1, "Title is required"),
    question: z.string().min(1, "Question is required"),
});

export type SecretPayload = z.infer<typeof SecretPayloadSchema>;

export const CustomPayloadSchema = z.object({
    type: z.literal('custom'),
    customType: z.string(),
    data: z.record(z.string(), z.unknown()),
});

export type CustomPayload = z.infer<typeof CustomPayloadSchema>;

export const TaskStepSchema = z.object({
    id: z.string(),
    instruction: z.string(),
    details: z.string().optional(),
    estimatedMinutes: z.number().optional(),
});

export type TaskStep = z.infer<typeof TaskStepSchema>;

export const TaskWorkflowPayloadSchema = z.object({
    type: z.literal('task_workflow'),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    steps: z.array(TaskStepSchema),
    allowNotes: z.boolean().default(true),
});

export type TaskWorkflowPayload = z.infer<typeof TaskWorkflowPayloadSchema>;

export const CanvasInteractionPayloadSchema = z.object({
    type: z.literal('canvas_interaction'),
    action: z.enum(['render', 'selection']),
    componentType: z.string().optional(),
    componentName: z.string().optional(),
    props: z.record(z.string(), z.unknown()).optional(),
    instruction: z.string().optional(),
    selectionType: z.string().optional(),
});

export type CanvasInteractionPayload = z.infer<typeof CanvasInteractionPayloadSchema>;

export const LeaseRequestPayloadSchema = z.object({
    type: z.literal('lease_request'),
    scope: z.enum(['browser', 'filesystem', 'network', 'shell', 'custom']),
    ttl: z.string(), // e.g. "15m", "1h", "30s"
    reason: z.string(),
    constraints: z.record(z.string(), z.unknown()).optional(),
});

export type LeaseRequestPayload = z.infer<typeof LeaseRequestPayloadSchema>;

export const PingPayloadSchema = z.discriminatedUnion('type', [
    StepApprovalPayloadSchema,
    ResearchRequestPayloadSchema,
    SelectionPayloadSchema,
    ApprovalPayloadSchema,
    QuestionPayloadSchema,
    NotificationPayloadSchema,
    ReviewRequestPayloadSchema,
    TaskWorkflowPayloadSchema,
    SecretPayloadSchema,
    CustomPayloadSchema,
    CanvasInteractionPayloadSchema,
    LeaseRequestPayloadSchema,
]);

export type PingPayload = z.infer<typeof PingPayloadSchema>;

// ============================================================================
// Ping Status
// ============================================================================

export const PingStatusSchema = z.enum(['pending', 'responded', 'expired', 'dismissed']);
export type PingStatus = z.infer<typeof PingStatusSchema>;

// ============================================================================
// The Ping Entity
// ============================================================================

export interface Ping {
    id: string;

    // Who's talking
    agentId: string;
    agentName: string;
    sessionId: string;

    // What they're saying
    type: PingType;
    payload: PingPayload;

    // Lifecycle
    status: PingStatus;
    response: HumanResponse | null;

    // Metadata
    createdAt: Date;
    respondedAt: Date | null;
    expiresAt: Date | null;

    // For parsers to attach parsed UI hints
    parsedInteraction: ParsedInteraction | null;
}

// ============================================================================
// Request to Create a Ping
// ============================================================================

export const CreatePingRequestSchema = z.object({
    agentId: z.string(),
    agentName: z.string(),
    sessionId: z.string(),
    payload: PingPayloadSchema,
    expiresInMs: z.number().optional(),
});

export type CreatePingRequest = z.infer<typeof CreatePingRequestSchema>;

// ============================================================================
// Human Response
// ============================================================================

export const ResponseActionSchema = z.enum([
    'approved',
    'denied',
    'selected',
    'answered',
    'dismissed',
    'custom',
]);

export type ResponseAction = z.infer<typeof ResponseActionSchema>;

export interface HumanResponse {
    action: ResponseAction;
    data: ResponseData;
    enrichment?: ResponseEnrichment;
    respondedAt: Date;
    respondedVia: string;
}

export type ResponseData =
    | { type: 'approval'; approved: boolean }
    | { type: 'step_approval'; approvedSteps: string[]; deniedSteps: string[] }
    | { type: 'selection'; selectedIds: string[]; customValue?: string }
    | { type: 'answer'; value: string }
    | { type: 'task_workflow'; completedSteps: string[]; notes: Record<string, string> }
    | { type: 'dismissed' }
    | { type: 'custom'; data: Record<string, unknown> }
    | { type: 'canvas_interaction'; data: Record<string, unknown> }
    | { type: 'lease'; granted: boolean; token?: string; expiresAt?: string };

// ============================================================================
// Response Enrichment (The Magic - Beyond Yes/No)
// ============================================================================

export interface ResponseEnrichment {
    directives: Directive[];
    notes?: string;
    attachments?: Attachment[];
}

export interface Attachment {
    type: 'file' | 'url' | 'text';
    name: string;
    value: string;
}

// Import Directive from directives module
import { DirectiveSchema, type Directive } from './directives.js';
export type { Directive };

// ============================================================================
// Parsed Interaction (What Parsers Produce)
// ============================================================================

export const QuickActionTypeSchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('approve_all') }),
    z.object({ type: z.literal('deny_all') }),
    z.object({ type: z.literal('approve_selected'), ids: z.array(z.string()) }),
    z.object({ type: z.literal('select'), ids: z.array(z.string()) }),
    z.object({ type: z.literal('directive'), directive: DirectiveSchema }),
    z.object({ type: z.literal('open_detail') }),
    z.object({ type: z.literal('custom'), handler: z.string(), payload: z.unknown() }),
]);

export type QuickActionType = z.infer<typeof QuickActionTypeSchema>;

export const QuickActionSchema = z.object({
    id: z.string().min(1),
    label: z.string().min(1, "Action label is required"),
    icon: z.string().optional(),
    shortcut: z.string().optional(),
    style: z.enum(['primary', 'secondary', 'danger', 'ghost']),
    action: QuickActionTypeSchema,
});

export type QuickAction = z.infer<typeof QuickActionSchema>;

export const ParsedInteractionSchema = z.object({
    interactionType: z.string(),
    quickActions: z.array(QuickActionSchema),
    uiHints: z.record(z.string(), z.unknown()),
    fallbackText: z.string(),
    fallbackOptions: z.array(z.string()),
});

export type ParsedInteraction = z.infer<typeof ParsedInteractionSchema>;
