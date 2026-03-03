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
import { createClient } from '@agentping/api-client';
import type { CreatePingRequest, HumanResponse } from '@agentping/api-client';

// ============================================================================
// API Client
// ============================================================================

// Create the client with MCP-specific defaults. The client reads AGENTPING_URL
// from the environment to determine the daemon endpoint automatically.
const mcpDefaults = {
    agentId: process.env.AGENTPING_AGENT_ID || 'mcp-agent',
    agentName: process.env.AGENTPING_AGENT_NAME || 'MCP Agent',
    sessionId: process.env.AGENTPING_SESSION_ID || `mcp-${Date.now()}`,
};

const client = createClient(mcpDefaults);

/**
 * Submit a typed payload to the daemon and long-poll for the human response.
 * Agent identity fields are filled in from mcpDefaults automatically.
 * Returns the HumanResponse, or null on timeout.
 */
async function submitAndWait(
    payload: Record<string, unknown>,
    timeoutMs?: number,
): Promise<HumanResponse | null> {
    const ping = await client.submit({
        agentId: mcpDefaults.agentId,
        agentName: mcpDefaults.agentName,
        sessionId: mcpDefaults.sessionId,
        payload,
    } as CreatePingRequest);
    return client.waitForResponse(ping.id, timeoutMs);
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
        {
            name: 'request_selection',
            description: 'Request a selection from a list of options. Useful for choosing between different paths, files, or strategies.',
            inputSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'Title of the selection request',
                    },
                    options: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'List of options to choose from',
                    },
                    allowMultiple: {
                        type: 'boolean',
                        description: 'Whether to allow selecting multiple options (default: false)',
                    },
                    context: {
                        type: 'string',
                        description: 'Optional context to help the human decide',
                    },
                },
                required: ['title', 'options'],
            },
        },
        {
            name: 'request_research_direction',
            description: 'Present multiple research directions to the human and ask for guidance on which to pursue. Allows setting context and pros/cons for each direction.',
            inputSchema: {
                type: 'object',
                properties: {
                    problem: {
                        type: 'string',
                        description: 'The core problem being researched',
                    },
                    directions: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                direction: { type: 'string', description: 'Name/Title of the direction' },
                                description: { type: 'string', description: 'Brief description' },
                                pros: { type: 'array', items: { type: 'string' } },
                                cons: { type: 'array', items: { type: 'string' } },
                            },
                        },
                        description: 'List of proposed directions',
                    },
                    allowCustom: {
                        type: 'boolean',
                        description: 'Allow human to propose a custom direction',
                    },
                },
                required: ['problem', 'directions'],
            },
        },
        {
            name: 'request_code_review',
            description: 'Request human review for a set of code changes. Useful for getting sign-off on critical edits.',
            inputSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'Title of the review request (e.g., "Refactor Auth")',
                    },
                    files: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                path: { type: 'string' },
                                diff: { type: 'string', description: 'The diff content or summary of changes' },
                                description: { type: 'string' },
                            },
                        },
                        description: 'List of files changed',
                    },
                    context: {
                        type: 'string',
                        description: 'Overall context for the review',
                    },
                },
                required: ['title', 'files'],
            },
        },
        {
            name: 'request_secret',
            description: 'Securely request a sensitive value (API key, password, 2FA code) from the human. The input will be masked in the UI.',
            inputSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'Title of the secret request (e.g., "AWS API Key")',
                    },
                    description: {
                        type: 'string',
                        description: 'Explanation of why this secret is needed',
                    },
                },
                required: ['title'],
            },
        },
        {
            name: 'render_custom_ui',
            description: 'Render a custom UI component from the extensive "Cyber-Premium" gallery. This allows you to show charts, logs, diffs, and AI visualizations.',
            inputSchema: {
                type: 'object',
                properties: {
                    title: {
                        type: 'string',
                        description: 'Title of the view',
                    },
                    component: {
                        type: 'string',
                        description: 'Name of the component to render (e.g., "LineChart", "LogViewer", "JsonDiffViewer", "ResourceGauge")',
                    },
                    props: {
                        type: 'object',
                        description: 'Data/props to pass to the component (see component docs)',
                        additionalProperties: true,
                    },
                },
                required: ['title', 'component', 'props'],
            },
        },
        {
            name: 'render_canvas_component',
            description: 'Render a Sofia widget directly onto the Studio canvas using the canonical canvas_interaction payload.',
            inputSchema: {
                type: 'object',
                properties: {
                    widgetId: {
                        type: 'string',
                        description: 'Sofia widget identifier (e.g., "bd-dashboard", "todo-list", "markdown-card")',
                    },
                    name: {
                        type: 'string',
                        description: 'Optional display name for the rendered widget',
                    },
                    variant: {
                        type: 'string',
                        description: 'Optional Sofia widget variant (e.g., "kanban", "todo", "markdown")',
                    },
                    data: {
                        type: 'object',
                        description: 'Widget data payload',
                        additionalProperties: true,
                    },
                },
                required: ['widgetId'],
            },
        },
        {
            name: 'request_canvas_selection',
            description: 'Ask the human to select a region or object on the canvas. Useful for context-aware editing.',
            inputSchema: {
                type: 'object',
                properties: {
                    instruction: {
                        type: 'string',
                        description: 'Instructions for what to select (e.g., "Select the header")',
                    },
                    type: {
                        type: 'string',
                        enum: ['object', 'region', 'point'],
                        description: 'Type of selection required',
                    },
                },
                required: ['instruction'],
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

                const response = await submitAndWait({
                    type: 'question',
                    question,
                    context,
                    options,
                    allowFreeform: true,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Human did not respond in time.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: (response.data as any)?.value || 'No answer provided',
                    }],
                };
            }

            case 'request_approval': {
                const { action, details, risk } = args as {
                    action: string;
                    details?: string;
                    risk?: 'low' | 'medium' | 'high';
                };

                const response = await submitAndWait({
                    type: 'approval',
                    title: action,
                    action,
                    details,
                    risk: risk || 'medium',
                });

                if (!response) {
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

                const response = await submitAndWait({
                    type: 'step_approval',
                    title,
                    context: context || '',
                    steps,
                    allowPartial: true,
                    defaultApproved: [],
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Human did not respond in time. No steps approved.' }],
                    };
                }

                const approved = (response.data as any)?.approvedSteps || [];
                const denied = (response.data as any)?.deniedSteps || [];

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

                await client.notify(message, { level: level || 'info' });

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

                const response = await submitAndWait({
                    type: 'task_workflow',
                    title,
                    description,
                    steps,
                    allowNotes: allowNotes ?? true,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Human did not complete the workflow in time.' }],
                    };
                }

                const completed = (response.data as any)?.completedSteps || [];
                const notes = (response.data as any)?.notes || {};
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

            case 'request_selection': {
                const { title, options, allowMultiple, context } = args as {
                    title: string;
                    options: string[];
                    allowMultiple?: boolean;
                    context?: string;
                };

                const response = await submitAndWait({
                    type: 'selection',
                    title,
                    context,
                    options,
                    allowMultiple: allowMultiple || false,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Human did not select an option in time.' }],
                    };
                }

                const selected = (response.data as any)?.selectedOptions || ((response.data as any)?.value ? [(response.data as any).value] : []);

                return {
                    content: [{
                        type: 'text',
                        text: `SELECTED: ${selected.join(', ') || 'None'}`,
                    }],
                };
            }

            case 'request_research_direction': {
                const { problem, directions, allowCustom } = args as {
                    problem: string;
                    directions: Array<{ direction: string; description?: string }>;
                    allowCustom?: boolean;
                };

                // Send 'research_request' type for Web UI, with 'options' fallback for TUI
                const response = await submitAndWait({
                    type: 'research_request',
                    title: 'Research Direction',
                    question: problem,
                    context: problem,
                    proposedDirections: directions.map(d => ({
                        id: d.direction,
                        title: d.direction,
                        description: d.description
                    })),
                    options: directions.map(d => d.direction),
                    allowCustomDirection: allowCustom,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Human did not select a direction in time.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: `SELECTED DIRECTION: ${(response.data as any)?.selectedOptions?.join(', ') || 'None'}`,
                    }],
                };
            }

            case 'request_code_review': {
                const { title, files, context } = args as {
                    title: string;
                    files: Array<{ path: string; diff?: string; description?: string }>;
                    context?: string;
                };

                // Map to 'step_approval' for granular file review
                const steps = files.map(f => ({
                    id: f.path,
                    instruction: `Review ${f.path}`,
                    description: f.description || 'Code changes',
                    details: f.diff,
                    risk: 'medium',
                    reversible: true
                }));

                const response = await submitAndWait({
                    type: 'step_approval',
                    title: title || 'Code Review Request',
                    context: context || 'Please review the following file changes.',
                    steps,
                    allowPartial: true,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Review timed out.' }],
                    };
                }

                const approved = (response.data as any)?.approvedSteps || [];
                const denied = (response.data as any)?.deniedSteps || [];

                return {
                    content: [{
                        type: 'text',
                        text: `REVIEW RESULT:\nAPPROVED: ${approved.join(', ') || 'None'}\nREJECTED: ${denied.join(', ') || 'None'}`,
                    }],
                };
            }

            case 'request_secret': {
                const { title, description } = args as {
                    title: string;
                    description?: string;
                };

                const response = await submitAndWait({
                    type: 'secret',
                    title: title || 'Secret Request',
                    question: description || title || 'Please enter the secret value:',
                    isSecret: true,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Human did not provide key in time.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: `SECRET RECEIVED: ${(response.data as any)?.value ? '********' : 'Empty'}`,
                    }],
                };
            }

            case 'render_custom_ui': {
                const { title, component, props } = args as {
                    title: string;
                    component: string;
                    props: Record<string, any>;
                };

                const response = await submitAndWait({
                    type: 'custom',
                    title: title || `View: ${component}`,
                    customType: component,
                    data: props,
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'View timed out.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: `INTERACTION COMPLETE: ${JSON.stringify((response.data as any) || {})}`,
                    }],
                };
            }

            case 'render_canvas_component': {
                const { widgetId, name, variant, data } = args as {
                    widgetId: string;
                    name?: string;
                    variant?: string;
                    data?: Record<string, any>;
                };

                const response = await submitAndWait({
                    type: 'canvas_interaction',
                    action: 'render',
                    componentType: 'sofia-widget',
                    componentName: name || widgetId,
                    props: {
                        provider: 'sofia',
                        widgetId,
                        variant,
                        data: data || {},
                    },
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Canvas render timed out.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: `Sofia widget rendered successfully. ID: ${(response.data as any)?.objectId || 'unknown'}`,
                    }],
                };
            }

            case 'request_canvas_selection': {
                const { instruction, type } = args as {
                    instruction: string;
                    type?: string;
                };

                const response = await submitAndWait({
                    type: 'canvas_interaction',
                    action: 'selection',
                    instruction,
                    selectionType: type || 'object',
                });

                if (!response) {
                    return {
                        content: [{ type: 'text', text: 'Selection request timed out.' }],
                    };
                }

                return {
                    content: [{
                        type: 'text',
                        text: `Selection received: ${JSON.stringify((response.data as any)?.selection)}`,
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
