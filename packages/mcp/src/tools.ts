/**
 * AgentPing MCP Tools
 *
 * Defines the MCP tool interface for agent-human interaction.
 * These tools allow LLMs to request human input, approval, and feedback.
 */

import { z } from 'zod';
import type { Ping, HumanResponse, PingPayload } from '@agentping/core';

// ============================================================================
// Tool Schemas (Zod)
// ============================================================================

export const StepSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    risk: z.enum(['low', 'medium', 'high']).default('medium'),
    reversible: z.boolean().default(true),
});

export const RequestStepApprovalSchema = z.object({
    title: z.string().describe('Title of the approval request'),
    context: z.string().optional().describe('Additional context for the human'),
    steps: z.array(StepSchema).describe('Steps to approve'),
    defaultApproved: z.array(z.string()).optional().describe('Step IDs to pre-approve'),
});

export const AskHumanSchema = z.object({
    question: z.string().describe('The question to ask'),
    context: z.string().optional().describe('Additional context'),
    options: z.array(z.string()).optional().describe('Predefined answer options'),
    allowFreeform: z.boolean().default(true).describe('Allow free-form text response'),
});

export const RequestSelectionSchema = z.object({
    title: z.string().describe('Title of the selection request'),
    options: z.array(z.object({
        id: z.string(),
        label: z.string(),
        description: z.string().optional(),
        preview: z.string().optional(),
    })).describe('Options to select from'),
    allowMultiple: z.boolean().default(false),
    allowCustom: z.boolean().default(false),
    minSelections: z.number().optional(),
    maxSelections: z.number().optional(),
});

export const RequestApprovalSchema = z.object({
    title: z.string().describe('What needs approval'),
    description: z.string().optional().describe('Detailed description'),
    action: z.string().describe('The action that will be taken'),
    risk: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const NotifyHumanSchema = z.object({
    message: z.string().describe('Notification message'),
    level: z.enum(['info', 'warning', 'error', 'success']).default('info'),
    title: z.string().optional(),
});

export const ResearchDirectionSchema = z.object({
    currentFindings: z.string().describe('Summary of current research findings'),
    proposedDirections: z.array(z.object({
        id: z.string(),
        direction: z.string(),
        rationale: z.string(),
        estimatedEffort: z.enum(['low', 'medium', 'high']),
    })),
    allowCustomDirection: z.boolean().default(true),
});

export const RenderCustomUISchema = z.object({
    component: z.string().describe('Component name from the UI catalog'),
    props: z.record(z.any()).describe('Props to pass to the component'),
    waitForResponse: z.boolean().default(true),
});

export const GetPendingPingsSchema = z.object({
    agentId: z.string().optional(),
    sessionId: z.string().optional(),
    limit: z.number().default(10),
});

export const RespondToPingSchema = z.object({
    pingId: z.string().describe('ID of the ping to respond to'),
    response: z.object({
        action: z.string(),
        payload: z.record(z.any()).optional(),
        directives: z.array(z.any()).optional(),
        message: z.string().optional(),
    }),
});

export const GeneratePlaygroundSchema = z.object({
    template: z.enum(['design', 'data', 'concept', 'critique']),
    topic: z.string().describe('Subject of the playground'),
    mode: z.enum(['html', 'pencil', 'react']).default('html'),
    theme: z.enum(['terminal-swiss', 'skynet', 'system']).default('terminal-swiss'),
    initialValues: z.record(z.unknown()).optional(),
});

// ============================================================================
// Tool Definitions
// ============================================================================

export const AGENTPING_TOOLS = [
    {
        name: 'request_step_approval',
        description: 'Request human approval for a series of steps before execution. Use when agent needs explicit approval for actions.',
        inputSchema: RequestStepApprovalSchema,
    },
    {
        name: 'ask_human',
        description: 'Ask the human a question and wait for their response. Use for clarification, preferences, or decisions.',
        inputSchema: AskHumanSchema,
    },
    {
        name: 'request_selection',
        description: 'Present options to the human and let them select one or more. Use for choices, configurations, or multi-option decisions.',
        inputSchema: RequestSelectionSchema,
    },
    {
        name: 'request_approval',
        description: 'Request simple yes/no approval for a single action. Use for confirmations before irreversible actions.',
        inputSchema: RequestApprovalSchema,
    },
    {
        name: 'notify_human',
        description: 'Send a notification to the human without requiring a response. Use for status updates, warnings, or information.',
        inputSchema: NotifyHumanSchema,
    },
    {
        name: 'request_research_direction',
        description: 'Present research findings and ask human to choose next research direction. Use during research/exploration tasks.',
        inputSchema: ResearchDirectionSchema,
    },
    {
        name: 'render_custom_ui',
        description: 'Render a custom UI component and optionally wait for user interaction. Use for complex data visualization or input.',
        inputSchema: RenderCustomUISchema,
    },
    {
        name: 'get_pending_pings',
        description: 'Get list of pending pings awaiting human response. Use to check for outstanding requests.',
        inputSchema: GetPendingPingsSchema,
    },
    {
        name: 'respond_to_ping',
        description: 'Respond to a pending ping on behalf of automation. Use for programmatic responses.',
        inputSchema: RespondToPingSchema,
    },
    {
        name: 'generate_playground',
        description: 'Generate an interactive playground for exploring AgentPing components. Returns HTML, Pencil operations, or React catalog entries.',
        inputSchema: GeneratePlaygroundSchema,
    },
] as const;

// ============================================================================
// Type Exports
// ============================================================================

export type RequestStepApprovalInput = z.infer<typeof RequestStepApprovalSchema>;
export type AskHumanInput = z.infer<typeof AskHumanSchema>;
export type RequestSelectionInput = z.infer<typeof RequestSelectionSchema>;
export type RequestApprovalInput = z.infer<typeof RequestApprovalSchema>;
export type NotifyHumanInput = z.infer<typeof NotifyHumanSchema>;
export type ResearchDirectionInput = z.infer<typeof ResearchDirectionSchema>;
export type RenderCustomUIInput = z.infer<typeof RenderCustomUISchema>;
export type GetPendingPingsInput = z.infer<typeof GetPendingPingsSchema>;
export type RespondToPingInput = z.infer<typeof RespondToPingSchema>;
export type GeneratePlaygroundInput = z.infer<typeof GeneratePlaygroundSchema>;
