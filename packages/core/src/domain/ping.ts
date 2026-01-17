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
]);

export type PingType = z.infer<typeof PingTypeSchema>;

// ============================================================================
// Ping Payloads (Type-Specific Structured Data)
// ============================================================================

export const StepSchema = z.object({
    id: z.string(),
    description: z.string(),
    risk: z.enum(['low', 'medium', 'high']),
    reversible: z.boolean(),
    details: z.string().optional(),
    estimatedImpact: z.string().optional(),
});

export type Step = z.infer<typeof StepSchema>;

export const StepApprovalPayloadSchema = z.object({
    type: z.literal('step_approval'),
    title: z.string(),
    context: z.string(),
    steps: z.array(StepSchema),
    allowPartial: z.boolean(),
    defaultApproved: z.array(z.string()),
});

export type StepApprovalPayload = z.infer<typeof StepApprovalPayloadSchema>;

export const ResearchDirectionSchema = z.object({
    id: z.string(),
    direction: z.string(),
    rationale: z.string(),
    estimatedEffort: z.enum(['quick', 'medium', 'deep']),
});

export type ResearchDirection = z.infer<typeof ResearchDirectionSchema>;

export const ResearchRequestPayloadSchema = z.object({
    type: z.literal('research_request'),
    title: z.string(),
    currentFindings: z.string(),
    proposedDirections: z.array(ResearchDirectionSchema),
    allowCustomDirection: z.boolean(),
});

export type ResearchRequestPayload = z.infer<typeof ResearchRequestPayloadSchema>;

export const SelectionOptionSchema = z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    preview: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SelectionOption = z.infer<typeof SelectionOptionSchema>;

export const SelectionPayloadSchema = z.object({
    type: z.literal('selection'),
    title: z.string(),
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
    title: z.string(),
    action: z.string(),
    details: z.string().optional(),
    risk: z.enum(['low', 'medium', 'high']).optional(),
});

export type ApprovalPayload = z.infer<typeof ApprovalPayloadSchema>;

export const QuestionPayloadSchema = z.object({
    type: z.literal('question'),
    question: z.string(),
    context: z.string().optional(),
    options: z.array(z.string()).optional(),
    allowFreeform: z.boolean().default(true),
});

export type QuestionPayload = z.infer<typeof QuestionPayloadSchema>;

export const NotificationPayloadSchema = z.object({
    type: z.literal('notification'),
    message: z.string(),
    level: z.enum(['info', 'success', 'warning', 'error']).default('info'),
});

export type NotificationPayload = z.infer<typeof NotificationPayloadSchema>;

export const ReviewRequestPayloadSchema = z.object({
    type: z.literal('review_request'),
    title: z.string(),
    content: z.string(),
    contentType: z.enum(['code', 'text', 'markdown', 'json']).default('text'),
    filePath: z.string().optional(),
});

export type ReviewRequestPayload = z.infer<typeof ReviewRequestPayloadSchema>;

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
    title: z.string(),
    description: z.string().optional(),
    steps: z.array(TaskStepSchema),
    allowNotes: z.boolean().default(true),
});

export type TaskWorkflowPayload = z.infer<typeof TaskWorkflowPayloadSchema>;

export const PingPayloadSchema = z.discriminatedUnion('type', [
    StepApprovalPayloadSchema,
    ResearchRequestPayloadSchema,
    SelectionPayloadSchema,
    ApprovalPayloadSchema,
    QuestionPayloadSchema,
    NotificationPayloadSchema,
    ReviewRequestPayloadSchema,
    TaskWorkflowPayloadSchema,
    CustomPayloadSchema,
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
    | { type: 'custom'; data: Record<string, unknown> };

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
import type { Directive } from './directives.js';
export type { Directive };

// ============================================================================
// Parsed Interaction (What Parsers Produce)
// ============================================================================

export interface ParsedInteraction {
    interactionType: string;
    quickActions: QuickAction[];
    uiHints: Record<string, unknown>;
    fallbackText: string;
    fallbackOptions: string[];
}

export interface QuickAction {
    id: string;
    label: string;
    icon?: string;
    shortcut?: string;
    style: 'primary' | 'secondary' | 'danger' | 'ghost';
    action: QuickActionType;
}

export type QuickActionType =
    | { type: 'approve_all' }
    | { type: 'deny_all' }
    | { type: 'approve_selected'; ids: string[] }
    | { type: 'select'; ids: string[] }
    | { type: 'directive'; directive: Directive }
    | { type: 'open_detail' }
    | { type: 'custom'; handler: string; payload: unknown };
