/**
 * AgentPing MCP Server
 *
 * Model Context Protocol server for agent-human interaction.
 * Provides tools for LLMs to request human input, approval, and feedback.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
    PingService,
    createEventBus,
    defaultParsers,
    type CreatePingRequest,
    type HumanResponse,
} from '@agentping/core';
import {
    AGENTPING_TOOLS,
    RequestStepApprovalSchema,
    AskHumanSchema,
    RequestSelectionSchema,
    RequestApprovalSchema,
    NotifyHumanSchema,
    ResearchDirectionSchema,
    RenderCustomUISchema,
    GetPendingPingsSchema,
    RespondToPingSchema,
    GeneratePlaygroundSchema,
} from './tools.js';

// ============================================================================
// Server Configuration
// ============================================================================

export interface AgentPingMCPConfig {
    /** Agent identifier for this MCP session */
    agentId: string;
    /** Human-readable agent name */
    agentName: string;
    /** Session identifier */
    sessionId?: string;
    /** PingService instance (or will create in-memory) */
    pingService?: PingService;
    /** Timeout for waiting on human responses (ms) */
    responseTimeoutMs?: number;
}

// ============================================================================
// MCP Server Factory
// ============================================================================

export function createAgentPingMCPServer(config: AgentPingMCPConfig) {
    const {
        agentId,
        agentName,
        sessionId = `session-${Date.now()}`,
        responseTimeoutMs = 300000, // 5 minutes default
    } = config;

    // Create or use provided PingService
    const eventBus = createEventBus();
    const pingService = config.pingService ?? new PingService({
        store: createInMemoryStore(),
        channels: [],
        parsers: defaultParsers,
        eventBus,
    });

    // Create MCP Server
    const server = new Server(
        {
            name: 'agentping',
            version: '0.1.0',
        },
        {
            capabilities: {
                tools: {},
                resources: {},
            },
        }
    );

    // ========================================================================
    // Tool Handlers
    // ========================================================================

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: AGENTPING_TOOLS.map(tool => ({
                name: tool.name,
                description: tool.description,
                inputSchema: zodToJsonSchema(tool.inputSchema),
            })),
        };
    });

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;

        try {
            switch (name) {
                case 'request_step_approval': {
                    const input = RequestStepApprovalSchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'step_approval',
                            ...input,
                        } as any,
                    });
                    const response = await pingService.waitForResponse(ping.id, responseTimeoutMs);
                    return formatResponse(response, ping);
                }

                case 'ask_human': {
                    const input = AskHumanSchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'question',
                            ...input,
                        } as any,
                    });
                    const response = await pingService.waitForResponse(ping.id, responseTimeoutMs);
                    return formatResponse(response, ping);
                }

                case 'request_selection': {
                    const input = RequestSelectionSchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'selection',
                            ...input,
                        } as any,
                    });
                    const response = await pingService.waitForResponse(ping.id, responseTimeoutMs);
                    return formatResponse(response, ping);
                }

                case 'request_approval': {
                    const input = RequestApprovalSchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'approval',
                            ...input,
                        } as any,
                    });
                    const response = await pingService.waitForResponse(ping.id, responseTimeoutMs);
                    return formatResponse(response, ping);
                }

                case 'notify_human': {
                    const input = NotifyHumanSchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'notification',
                            ...input,
                        } as any,
                    });
                    // Notifications don't wait for response
                    return {
                        content: [{ type: 'text', text: `Notification sent: ${input.message}` }],
                    };
                }

                case 'request_research_direction': {
                    const input = ResearchDirectionSchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'research_request',
                            ...input,
                        } as any,
                    });
                    const response = await pingService.waitForResponse(ping.id, responseTimeoutMs);
                    return formatResponse(response, ping);
                }

                case 'render_custom_ui': {
                    const input = RenderCustomUISchema.parse(args);
                    const ping = await pingService.submitPing({
                        agentId,
                        agentName,
                        sessionId,
                        payload: {
                            type: 'custom_ui',
                            ...input,
                        } as any,
                    });
                    if (input.waitForResponse) {
                        const response = await pingService.waitForResponse(ping.id, responseTimeoutMs);
                        return formatResponse(response, ping);
                    }
                    return {
                        content: [{ type: 'text', text: `UI rendered: ${input.component}` }],
                    };
                }

                case 'get_pending_pings': {
                    const input = GetPendingPingsSchema.parse(args);
                    const pings = await pingService.getPendingPings({
                        agentId: input.agentId,
                        sessionId: input.sessionId,
                        limit: input.limit,
                    });
                    return {
                        content: [{
                            type: 'text',
                            text: JSON.stringify(pings, null, 2),
                        }],
                    };
                }

                case 'respond_to_ping': {
                    const input = RespondToPingSchema.parse(args);
                    await pingService.respond(input.pingId, input.response as HumanResponse);
                    return {
                        content: [{ type: 'text', text: `Response recorded for ping ${input.pingId}` }],
                    };
                }

                case 'generate_playground': {
                    const input = GeneratePlaygroundSchema.parse(args);

                    // Dynamic import — variable path prevents tsc from resolving cross-package source
                    const polymorphPath = '../../canvas/src/polymorph/index.js';
                    const { templates, renderToHTML, renderToPencil, renderToReact } = await import(
                        polymorphPath
                    );

                    const template = templates[input.template];
                    if (!template) {
                        throw new Error(`Unknown template: ${input.template}`);
                    }

                    const primitives = template.previewRenderer(input.initialValues ?? {});
                    const renderOpts = {
                        template: input.template,
                        topic: input.topic,
                        mode: input.mode,
                        theme: input.theme,
                    };

                    if (input.mode === 'html') {
                        const html = renderToHTML(primitives, renderOpts);
                        // Write to temp file
                        const { writeFileSync, mkdirSync } = await import('fs');
                        const { join } = await import('path');
                        const { homedir } = await import('os');
                        const dir = join(homedir(), '.agentping', 'playgrounds');
                        mkdirSync(dir, { recursive: true });
                        const fileName = `playground-${input.template}-${Date.now()}.html`;
                        const filePath = join(dir, fileName);
                        writeFileSync(filePath, html, 'utf-8');
                        return {
                            content: [{
                                type: 'text',
                                text: JSON.stringify({ path: filePath, template: input.template, topic: input.topic, theme: input.theme }),
                            }],
                        };
                    } else if (input.mode === 'pencil') {
                        const ops = renderToPencil(primitives, '"document"', { theme: input.theme });
                        return {
                            content: [{ type: 'text', text: ops.join('\n') }],
                        };
                    } else {
                        const entries = renderToReact(primitives);
                        return {
                            content: [{ type: 'text', text: JSON.stringify(entries, null, 2) }],
                        };
                    }
                }

                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        } catch (error) {
            return {
                content: [{
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                }],
                isError: true,
            };
        }
    });

    // ========================================================================
    // Resource Handlers (UI resources for ext-apps)
    // ========================================================================

    server.setRequestHandler(ListResourcesRequestSchema, async () => {
        return {
            resources: [
                {
                    uri: 'ui://agentping/dashboard',
                    name: 'AgentPing Dashboard',
                    description: 'Main dashboard for viewing and responding to pings',
                    mimeType: 'text/html;profile=mcp-app',
                },
                {
                    uri: 'ui://agentping/ping-detail',
                    name: 'Ping Detail View',
                    description: 'Detailed view for a single ping',
                    mimeType: 'text/html;profile=mcp-app',
                },
            ],
        };
    });

    server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
        const { uri } = request.params;

        // TODO: Return actual HTML for ext-apps integration
        if (uri === 'ui://agentping/dashboard') {
            return {
                contents: [{
                    uri,
                    mimeType: 'text/html;profile=mcp-app',
                    text: '<!-- AgentPing Dashboard HTML -->',
                }],
            };
        }

        throw new Error(`Unknown resource: ${uri}`);
    });

    return { server, pingService, eventBus };
}

// ============================================================================
// Helpers
// ============================================================================

function formatResponse(response: HumanResponse | null, ping: any) {
    if (!response) {
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({
                    status: 'timeout',
                    pingId: ping.id,
                    message: 'No response received within timeout',
                }),
            }],
        };
    }

    return {
        content: [{
            type: 'text',
            text: JSON.stringify({
                status: 'responded',
                pingId: ping.id,
                action: response.action,
                data: response.data,
                directives: response.enrichment?.directives,
                notes: response.enrichment?.notes,
            }),
        }],
    };
}

function zodToJsonSchema(schema: any): object {
    // Extract JSON Schema from Zod schema
    // Handles common Zod types for MCP tool definitions
    if (!schema?._def) return { type: 'object' };

    const def = schema._def;
    const typeName = def.typeName;

    if (typeName === 'ZodObject') {
        const shape = def.shape?.();
        const properties: Record<string, any> = {};
        const required: string[] = [];

        if (shape) {
            for (const [key, fieldSchema] of Object.entries(shape)) {
                properties[key] = zodToJsonSchema(fieldSchema);
                // Check if field is optional
                const fieldDef = (fieldSchema as any)?._def;
                if (fieldDef?.typeName !== 'ZodOptional' && fieldDef?.typeName !== 'ZodDefault') {
                    required.push(key);
                }
            }
        }

        return {
            type: 'object',
            properties,
            ...(required.length > 0 ? { required } : {}),
        };
    }

    if (typeName === 'ZodString') return { type: 'string', description: def.description };
    if (typeName === 'ZodNumber') return { type: 'number', description: def.description };
    if (typeName === 'ZodBoolean') return { type: 'boolean', description: def.description };
    if (typeName === 'ZodArray') return { type: 'array', items: zodToJsonSchema(def.type) };
    if (typeName === 'ZodOptional') return zodToJsonSchema(def.innerType);
    if (typeName === 'ZodDefault') return zodToJsonSchema(def.innerType);
    if (typeName === 'ZodEnum') return { type: 'string', enum: def.values };

    return { type: 'object' };
}

function createInMemoryStore() {
    // Minimal in-memory store for MCP server
    const pings = new Map();
    return {
        async save(ping: any) { pings.set(ping.id, ping); },
        async findById(id: string) { return pings.get(id) || null; },
        async findPending() { return [...pings.values()].filter(p => p.status === 'pending'); },
        async findBySession(sessionId: string) {
            return [...pings.values()].filter(p => p.sessionId === sessionId);
        },
        async update(id: string, updates: any) {
            const ping = pings.get(id);
            if (ping) pings.set(id, { ...ping, ...updates });
        },
        async delete(id: string) { pings.delete(id); },
        async appendAuditLog() {},
        async getAuditLog() { return []; },
        async saveDirectiveTemplate() {},
        async getDirectiveTemplates() { return []; },
        async incrementTemplateUseCount() {},
        async initialize() {},
        async close() {},
    };
}

// ============================================================================
// Exports
// ============================================================================

export { AGENTPING_TOOLS } from './tools.js';
export * from './tools.js';
