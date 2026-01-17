#!/usr/bin/env node
/**
 * AgentPing MCP Server
 * 
 * Exposes AgentPing as an MCP server for LLM integration.
 * Allows LLMs to submit pings and receive human responses inline.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// ============================================================================
// Configuration
// ============================================================================

const AGENTPING_URL = process.env.AGENTPING_URL || 'http://localhost:7890';
const AGENT_ID = process.env.AGENTPING_AGENT_ID || 'mcp-agent';
const AGENT_NAME = process.env.AGENTPING_AGENT_NAME || 'MCP Agent';
const SESSION_ID = process.env.AGENTPING_SESSION_ID || `mcp-${Date.now()}`;

// ============================================================================
// API Client
// ============================================================================

async function sendPing(payload: Record<string, unknown>): Promise<unknown> {
    const res = await fetch(`${AGENTPING_URL}/api/v1/pings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            agentId: AGENT_ID,
            agentName: AGENT_NAME,
            sessionId: SESSION_ID,
            payload,
        }),
    });

    if (!res.ok) {
        const error = await res.json() as { error?: string };
        throw new Error(error.error || 'Failed to send ping');
    }

    return (await res.json() as { ping: unknown }).ping;
}

async function waitForResponse(pingId: string, timeoutSeconds = 300): Promise<unknown> {
    const res = await fetch(
        `${AGENTPING_URL}/api/v1/pings/${pingId}/wait?timeout=${timeoutSeconds}`
    );

    if (res.status === 408) {
        return { timedOut: true };
    }

    if (!res.ok) {
        const error = await res.json() as { error?: string };
        throw new Error(error.error || 'Failed to wait for response');
    }

    return (await res.json() as { response: unknown }).response;
}

// ============================================================================
// MCP Server
// ============================================================================

const server = new Server(
    {
        name: 'agentping-mcp',
        version: '0.1.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// ============================================================================
// Tool Definitions
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'ask_human',
            description: 'Ask the human a question and wait for their response. Use this when you need clarification, input, or approval.',
            inputSchema: {
                type: 'object',
                properties: {
                    question: {
                        type: 'string',
                        description: 'The question to ask the human',
                    },
                    context: {
                        type: 'string',
                        description: 'Optional context to help the human understand the question',
                    },
                    options: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Optional predefined options for quick selection',
                    },
                },
                required: ['question'],
            },
        },
        {
            name: 'request_approval',
            description: 'Request approval for an action before proceeding. Returns approved or denied.',
            inputSchema: {
                type: 'object',
                properties: {
                    action: {
                        type: 'string',
                        description: 'Description of the action to approve',
                    },
                    details: {
                        type: 'string',
                        description: 'Additional details about what will happen',
                    },
                    risk: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                        description: 'Risk level of the action',
                    },
                },
                required: ['action'],
            },
        },
        {
            name: 'request_step_approval',
            description: 'Request approval for multiple steps. Allows human to approve or deny individual steps.',
            inputSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'Title for the step approval request',
                    },
                    context: {
                        type: 'string',
                        description: 'Context explaining why these steps are needed',
                    },
                    steps: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                description: { type: 'string' },
                                risk: { type: 'string', enum: ['low', 'medium', 'high'] },
                                reversible: { type: 'boolean' },
                                details: { type: 'string' },
                            },
                            required: ['id', 'description', 'risk', 'reversible'],
                        },
                        description: 'Steps that need approval',
                    },
                },
                required: ['title', 'steps'],
            },
        },
        {
            name: 'notify_human',
            description: 'Send a notification to the human. Does not wait for a response.',
            inputSchema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'The message to display',
                    },
                    level: {
                        type: 'string',
                        enum: ['info', 'success', 'warning', 'error'],
                        description: 'Notification level',
                    },
                },
                required: ['message'],
            },
        },
        {
            name: 'assign_task_workflow',
            description: 'Assign a multi-step task workflow to the human. Use this when you need the human to complete a series of steps (Reverse Claude Code). Returns which steps were completed and any notes the human added.',
            inputSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'Title for the task workflow',
                    },
                    description: {
                        type: 'string',
                        description: 'Optional description or context for the workflow',
                    },
                    steps: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                instruction: { type: 'string' },
                                details: { type: 'string' },
                                estimatedMinutes: { type: 'number' },
                            },
                            required: ['id', 'instruction'],
                        },
                        description: 'Steps for the human to complete',
                    },
                    allowNotes: {
                        type: 'boolean',
                        description: 'Whether to allow the human to add notes per step (default: true)',
                    },
                },
                required: ['title', 'steps'],
            },
        },
    ],
}));

// ============================================================================
// Tool Handlers
// ============================================================================

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'ask_human': {
                const { question, context, options } = args as {
                    question: string;
                    context?: string;
                    options?: string[];
                };

                const ping = await sendPing({
                    type: 'question',
                    question,
                    context,
                    options,
                    allowFreeform: true,
                }) as { id: string };

                const response = await waitForResponse(ping.id) as {
                    timedOut?: boolean;
                    data?: { value?: string };
                };

                if (response.timedOut) {
                    return {
                        content: [{ type: 'text', text: 'Human did not respond in time.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: response.data?.value || 'No answer provided',
                    }],
                };
            }

            case 'request_approval': {
                const { action, details, risk } = args as {
                    action: string;
                    details?: string;
                    risk?: 'low' | 'medium' | 'high';
                };

                const ping = await sendPing({
                    type: 'approval',
                    title: action,
                    action,
                    details,
                    risk: risk || 'medium',
                }) as { id: string };

                const response = await waitForResponse(ping.id) as {
                    timedOut?: boolean;
                    action?: string;
                };

                if (response.timedOut) {
                    return {
                        content: [{ type: 'text', text: 'Human did not respond in time. Action NOT approved.' }],
                    };
                }

                const approved = response.action === 'approved';
                return {
                    content: [{
                        type: 'text',
                        text: approved ? 'APPROVED: You may proceed.' : 'DENIED: Do not proceed.',
                    }],
                };
            }

            case 'request_step_approval': {
                const { title, context, steps } = args as {
                    title: string;
                    context?: string;
                    steps: Array<{
                        id: string;
                        description: string;
                        risk: 'low' | 'medium' | 'high';
                        reversible: boolean;
                        details?: string;
                    }>;
                };

                const ping = await sendPing({
                    type: 'step_approval',
                    title,
                    context: context || '',
                    steps,
                    allowPartial: true,
                    defaultApproved: [],
                }) as { id: string };

                const response = await waitForResponse(ping.id) as {
                    timedOut?: boolean;
                    data?: {
                        approvedSteps?: string[];
                        deniedSteps?: string[];
                    };
                };

                if (response.timedOut) {
                    return {
                        content: [{ type: 'text', text: 'Human did not respond in time. No steps approved.' }],
                    };
                }

                const approved = response.data?.approvedSteps || [];
                const denied = response.data?.deniedSteps || [];

                return {
                    content: [{
                        type: 'text',
                        text: `APPROVED STEPS: ${approved.join(', ') || 'none'}\nDENIED STEPS: ${denied.join(', ') || 'none'}`,
                    }],
                };
            }

            case 'notify_human': {
                const { message, level } = args as {
                    message: string;
                    level?: 'info' | 'success' | 'warning' | 'error';
                };

                await sendPing({
                    type: 'notification',
                    message,
                    level: level || 'info',
                });

                return {
                    content: [{ type: 'text', text: 'Notification sent.' }],
                };
            }

            case 'assign_task_workflow': {
                const { title, description, steps, allowNotes } = args as {
                    title: string;
                    description?: string;
                    steps: Array<{
                        id: string;
                        instruction: string;
                        details?: string;
                        estimatedMinutes?: number;
                    }>;
                    allowNotes?: boolean;
                };

                const ping = await sendPing({
                    type: 'task_workflow',
                    title,
                    description,
                    steps,
                    allowNotes: allowNotes ?? true,
                }) as { id: string };

                const response = await waitForResponse(ping.id) as {
                    timedOut?: boolean;
                    data?: {
                        completedSteps?: string[];
                        notes?: Record<string, string>;
                    };
                };

                if (response.timedOut) {
                    return {
                        content: [{ type: 'text', text: 'Human did not complete the workflow in time.' }],
                    };
                }

                const completed = response.data?.completedSteps || [];
                const notes = response.data?.notes || {};
                const notesSummary = Object.entries(notes)
                    .map(([stepId, note]) => `Step ${stepId}: ${note}`)
                    .join('\n');

                return {
                    content: [{
                        type: 'text',
                        text: `COMPLETED STEPS: ${completed.join(', ') || 'none'}\n${notesSummary ? `NOTES:\n${notesSummary}` : 'No notes provided.'}`,
                    }],
                };
            }

            default:
                return {
                    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    } catch (error) {
        return {
            content: [{
                type: 'text',
                text: `Error: ${(error as Error).message}`,
            }],
            isError: true,
        };
    }
});

// ============================================================================
// Run Server
// ============================================================================

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('AgentPing MCP server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
