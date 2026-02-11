/**
 * Studio Embedded Server
 * 
 * Runs the AgentPing backend (Daemon) inside the Electron main process.
 * Bridges pings to the UI via IPC.
 */

import { serve } from '@hono/node-server';
import { createServer, Server as HttpServer } from 'http';
import path from 'path';
import { app, BrowserWindow } from 'electron';
import {
    PingService,
    createEventBus,
    defaultParsers,
    Ping,
} from '@agentping/core';
import { SQLiteStore } from '@agentping/storage-sqlite';
import { createHttpApi } from '@agentping/http-api';
// @ts-ignore
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
// @ts-ignore
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
// @ts-ignore
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// @ts-ignore - Direct path for CJS resolution
const { createWebSocketManager } = require('@agentping/http-api/dist/websocket.js');

export class StudioServer {
    private server: HttpServer | null = null;
    private store: SQLiteStore | null = null;
    private pingService: PingService | null = null;
    private port: number;
    private mainWindow: BrowserWindow;
    private mcpServer: Server | null = null;
    private mcpTransports: Map<string, SSEServerTransport> = new Map();

    constructor(mainWindow: BrowserWindow, port: number = 7890) {
        this.mainWindow = mainWindow;
        this.port = port;
    }

    async start() {
        console.log('⚡ Starting Embedded AgentPing Server...');

        // 1. Storage
        const userDataPath = app.getPath('userData');
        const dbPath = path.join(userDataPath, 'agentping.db');

        this.store = new SQLiteStore(dbPath);
        await this.store.initialize();
        console.log(`✓ SQLite store initialized at ${dbPath}`);

        // 2. Event Bus
        const eventBus = createEventBus();

        // 3. Notification Channels
        const channels = [{
            name: 'studio-ipc',
            supportsInlineResponse: true,
            supportedInteractionTypes: ['*'],
            notify: async (ping: Ping) => {
                console.log(`📮 IPC Notify: ${ping.type}`);
                if (!this.mainWindow.isDestroyed() && !this.mainWindow.webContents.isDestroyed()) {
                    this.mainWindow.webContents.send('ping:received', ping);
                }
            },

        }];

        // 4. Ping Service
        this.pingService = new PingService({
            store: this.store,
            channels,
            parsers: defaultParsers,
            eventBus,
            enableAuditLog: true,
        });

        // 5. HTTP API
        const httpApp = createHttpApi({
            pingService: this.pingService,
            corsOrigins: ['*'],
            enableLogger: true,
        });

        // 5b. Full MCP Support
        this.setupMcpServer();

        httpApp.get('/mcp', async (c) => {
            const transport = new SSEServerTransport('/mcp/messages', c.res as any);
            const sessionId = Math.random().toString(36).substring(7);
            this.mcpTransports.set(sessionId, transport);

            // Handle connection close
            (c.req.raw as any).on('close', () => {
                this.mcpTransports.delete(sessionId);
            });

            await this.mcpServer?.connect(transport);
            return c.body(null);
        });

        httpApp.post('/mcp/messages', async (c) => {
            const body = await c.req.json();
            // Find transport based on some identifier? 
            // Simplified: SSE transport handles this if we can bridge the request.
            // In a better implementation, we'd use a more robust SSE-Hono bridge.
            // For now, let's proxy the post to all active transports (usually just 1).
            for (const transport of this.mcpTransports.values()) {
                await transport.handlePostMessage(c.req.raw as any, c.res as any, body);
            }
            return c.json({ success: true });
        });


        // 6. Node Server
        this.server = createServer(async (req, res) => {
            // Forward to Hono
            const url = new URL(req.url || '/', `http://${req.headers.host}`);
            const request = new Request(url.toString(), {
                method: req.method,
                headers: req.headers as any,
                body: req.method !== 'GET' && req.method !== 'HEAD'
                    ? await this.readBody(req)
                    : undefined,
            });

            const response = await httpApp.fetch(request);

            res.statusCode = response.status;
            response.headers.forEach((value, key) => {
                res.setHeader(key, value);
            });

            const body = await response.text();
            res.end(body);
        });

        // 7. WebSocket
        const wsManager = createWebSocketManager({ eventBus });
        wsManager.attach(this.server, '/api/v1/ws');

        // 8. Listen
        return new Promise<void>((resolve, reject) => {
            if (!this.server) return reject('Server init failed');

            this.server.listen(this.port, () => {
                console.log(`🚀 Embedded Daemon running on port ${this.port}`);
                resolve();
            });

            this.server.on('error', (err) => {
                console.error('Server error:', err);
                reject(err);
            });
        });
    }



    async stop() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
        if (this.store) {
            await this.store.close();
        }
        console.log('💤 Embedded Server stopped');
    }

    private async readBody(req: any): Promise<string> {
        return new Promise((resolve, reject) => {
            let data = '';
            req.on('data', (chunk: any) => { data += chunk; });
            req.on('end', () => resolve(data));
            req.on('error', reject);
        });
    }

    async respond(pingId: string, response: any): Promise<void> {
        if (!this.pingService) throw new Error('Ping service not initialized');
        await this.pingService.respond(pingId, response);
    }

    private setupMcpServer() {
        this.mcpServer = new Server(
            { name: 'agentping-studio', version: '0.1.0' },
            { capabilities: { tools: {} } }
        );

        // Tool Definitions
        this.mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'ask_human',
                    description: 'Ask the human a question and wait for their response.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            question: { type: 'string' },
                            context: { type: 'string' },
                            options: { type: 'array', items: { type: 'string' } }
                        },
                        required: ['question']
                    }
                },
                {
                    name: 'request_approval',
                    description: 'Request approval for an action before proceeding.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: { type: 'string' },
                            details: { type: 'string' },
                            risk: { type: 'string', enum: ['low', 'medium', 'high'] }
                        },
                        required: ['action']
                    }
                },
                {
                    name: 'request_step_approval',
                    description: 'Request approval for multiple steps in a sequence.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            steps: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string' },
                                        description: { type: 'string' },
                                        risk: { type: 'string', enum: ['low', 'medium', 'high'] },
                                        reversible: { type: 'boolean' }
                                    },
                                    required: ['id', 'description', 'risk', 'reversible']
                                }
                            }
                        },
                        required: ['title', 'steps']
                    }
                },
                {
                    name: 'render_canvas_component',
                    description: 'Render a Sofia widget directly onto the Studio canvas.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            widgetId: { type: 'string' },
                            name: { type: 'string' },
                            variant: { type: 'string' },
                            data: { type: 'object', additionalProperties: true }
                        },
                        required: ['widgetId']
                    }
                },
                {
                    name: 'request_code_review',
                    description: 'Request human review for a set of code changes.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            files: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        path: { type: 'string' },
                                        diff: { type: 'string' },
                                        description: { type: 'string' }
                                    },
                                    required: ['path']
                                }
                            }
                        },
                        required: ['title', 'files']
                    }
                },
                {
                    name: 'request_canvas_selection',
                    description: 'Ask the human to select an object on the canvas and return its metadata.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            instruction: { type: 'string', description: 'What the user should select' }
                        },
                        required: ['instruction']
                    }
                },
                {
                    name: 'request_research_direction',
                    description: 'Present multiple research directions and ask for a choice.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            problem: { type: 'string' },
                            directions: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        direction: { type: 'string' },
                                        description: { type: 'string' }
                                    }
                                }
                            }
                        },
                        required: ['problem', 'directions']
                    }
                },
                {
                    name: 'notify_human',
                    description: 'Send a fire-and-forget notification to the human.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            level: { type: 'string', enum: ['info', 'success', 'warning', 'error'] }
                        },
                        required: ['message']
                    }
                }
            ]
        }));

        this.mcpServer.setRequestHandler(CallToolRequestSchema, async (request: any) => {
            const { name, arguments: args } = request.params;
            if (!this.pingService) throw new Error('Ping service not initialized');

            const AGENT_INFO = { agentId: 'mcp-tool', agentName: 'MCP Tool', sessionId: 'mcp-session' };

            switch (name) {
                case 'ask_human': {
                    const ping = await this.pingService.submitPing({
                        ...AGENT_INFO,
                        payload: { type: 'question', question: args.question, context: args.context, options: args.options, allowFreeform: true }
                    });
                    const response = await this.pingService.waitForResponse(ping.id, 300);
                    return { content: [{ type: 'text', text: (response as any)?.data?.value || 'No response' }] };
                }
                case 'request_approval': {
                    const ping = await this.pingService.submitPing({
                        ...AGENT_INFO,
                        payload: { type: 'approval', title: args.action, action: args.action, details: args.details, risk: args.risk || 'medium' }
                    });
                    const response = await this.pingService.waitForResponse(ping.id, 300);
                    const approved = (response as any)?.action === 'approved';
                    return { content: [{ type: 'text', text: approved ? 'APPROVED. You may proceed.' : 'DENIED. Do not proceed.' }] };
                }
                case 'request_step_approval': {
                    const ping = await this.pingService.submitPing({
                        ...AGENT_INFO,
                        payload: {
                            type: 'step_approval',
                            title: args.title,
                            context: args.context || '',
                            steps: args.steps,
                            allowPartial: true,
                            defaultApproved: []
                        }
                    });
                    const response = await this.pingService.waitForResponse(ping.id, 300);
                    const approved = (response as any)?.data?.approvedSteps || [];
                    const denied = (response as any)?.data?.deniedSteps || [];
                    return { content: [{ type: 'text', text: `APPROVED: ${approved.join(', ') || 'none'}\nDENIED: ${denied.join(', ') || 'none'}` }] };
                }
                case 'render_canvas_component': {
                    if (!this.mainWindow.isDestroyed() && !this.mainWindow.webContents.isDestroyed()) {
                        this.mainWindow.webContents.send('canvas:add_automated', {
                            provider: 'sofia',
                            widgetId: args.widgetId,
                            name: args.name || args.widgetId,
                            variant: args.variant,
                            data: args.data
                        });
                        return { content: [{ type: 'text', text: `Rendered Sofia widget ${args.widgetId} on canvas.` }] };
                    }
                    return { content: [{ type: 'text', text: 'Failed to render: Window destroyed.' }] };
                }
                case 'request_code_review': {
                    const steps = (args.files as any[]).map(f => ({
                        id: f.path,
                        description: `Review ${f.path}: ${f.description || 'Code changes'}`,
                        details: f.diff,
                        risk: 'medium' as const,
                        reversible: true
                    }));
                    const ping = await this.pingService.submitPing({
                        ...AGENT_INFO,
                        payload: {
                            type: 'step_approval',
                            title: args.title,
                            context: 'Please review the following changes.',
                            steps,
                            allowPartial: true,
                            defaultApproved: []
                        }
                    });
                    const response = await this.pingService.waitForResponse(ping.id, 600);
                    const approved = (response as any)?.data?.approvedSteps || [];
                    const denied = (response as any)?.data?.deniedSteps || [];
                    return { content: [{ type: 'text', text: `REVIEW COMPLETE.\nAPPROVED: ${approved.join(', ') || 'None'}\nREJECTED: ${denied.join(', ') || 'None'}` }] };
                }
                case 'notify_human': {
                    await this.pingService.submitPing({
                        ...AGENT_INFO,
                        payload: { type: 'notification', message: args.message, level: args.level || 'info' }
                    });
                    return { content: [{ type: 'text', text: 'Notification sent.' }] };
                }
                case 'request_canvas_selection': {
                    const requestId = Math.random().toString(36).substring(7);
                    if (this.mainWindow.isDestroyed()) throw new Error('Window destroyed');

                    this.mainWindow.webContents.send('canvas:request_selection', { requestId, instruction: args.instruction });

                    // Wait for the response via internal IPC event
                    const { ipcMain } = require('electron');
                    const response = await new Promise<any>((resolve) => {
                        const timer = setTimeout(() => resolve({ timedOut: true }), 30000);
                        ipcMain.once(`canvas:selection_result:${requestId}`, (_: any, data: any) => {
                            clearTimeout(timer);
                            resolve(data);
                        });
                    });

                    if (response.timedOut) return { content: [{ type: 'text', text: 'Selection timed out.' }] };
                    return { content: [{ type: 'text', text: `SELECTED: ${JSON.stringify(response)}` }] };
                }
                case 'request_research_direction': {
                    const ping = await this.pingService.submitPing({
                        ...AGENT_INFO,
                        payload: {
                            type: 'research_request',
                            title: 'Research Direction',
                            currentFindings: args.problem,
                            proposedDirections: (args.directions as any[]).map(d => ({
                                id: d.direction,
                                direction: d.direction,
                                rationale: d.description || 'No rationale provided',
                                estimatedEffort: 'medium' as const
                            })),
                            allowCustomDirection: true
                        }
                    });
                    const response = await this.pingService.waitForResponse(ping.id, 300);
                    return { content: [{ type: 'text', text: `SELECTED: ${(response as any)?.data?.selectedIds?.[0] || 'none'}` }] };
                }
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });
    }
}

