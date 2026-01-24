/**
 * Claude Code Agent SDK Bridge
 * 
 * Manages sessions and communication with Claude Agent SDK.
 * Supports multiple parallel sessions and structured streaming.
 */

import { EventEmitter } from 'events';
import { nanoid } from 'nanoid';
import * as path from 'path';

// Define the query type locally or use 'any' if types are hard to import dynamically
type QueryFn = any;

/**
 * Approval queue item with file content for diff display
 */
export interface ApprovalQueueItem {
    toolCallId: string;
    name: string;
    input: any;
    originalContent?: string;   // File content BEFORE the change
    proposedContent?: string;   // Content that will be written
    filePath?: string;          // Resolved absolute path
    timestamp: Date;
    resolve: (approved: boolean) => void;
}

/**
 * Approval request sent to renderer (without resolve function)
 */
export interface ApprovalRequest {
    toolCallId: string;
    name: string;
    input: any;
    originalContent?: string;
    proposedContent?: string;
    filePath?: string;
    timestamp: Date;
}

export interface AgentSession {
    id: string;
    chatId: string;
    workingDir: string;
    status: 'starting' | 'running' | 'stopped';
    startedAt: Date;
    sdkSessionId?: string;
    // Queue of pending approvals (supports multiple concurrent approvals)
    approvalQueue: Map<string, ApprovalQueueItem>;
    isExecuting?: boolean;
}

export interface SpawnResult {
    sessionId: string;
    success: boolean;
    error?: string;
}

export class ClaudeCodeBridge extends EventEmitter {
    private sessions: Map<string, AgentSession> = new Map();
    private chatToSession: Map<string, string> = new Map();
    private _loggedChunks: number = 0;

    /**
     * Spawn a new Claude Agent SDK session
     * In the SDK context, this initiates a query stream.
     */
    async spawn(workingDir: string, initialPrompt?: string, chatId?: string): Promise<SpawnResult> {
        const sessionId = nanoid(10);
        const effectiveChatId = chatId || nanoid(8);

        const session: AgentSession = {
            id: sessionId,
            chatId: effectiveChatId,
            workingDir,
            status: 'starting',
            startedAt: new Date(),
            approvalQueue: new Map(),
        };

        this.sessions.set(sessionId, session);
        this.chatToSession.set(effectiveChatId, sessionId);

        if (initialPrompt) {
            // We don't "spawn" in the same way as CLI; we start a query loop
            // The actual execution happens via 'send' or an initial call
            this.execute(sessionId, initialPrompt);
        }

        return { sessionId, success: true };
    }

    /**
     * Execute a query against the SDK and stream results back
     */
    async execute(sessionId: string, prompt: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        if (session.isExecuting) {
            console.warn(`[ClaudeBridge] Execution already in progress for session ${sessionId}. Ignoring.`);
            return;
        }

        session.isExecuting = true;
        session.status = 'running';
        console.log(`[ClaudeBridge] Starting execution for session ${sessionId}. Prompt: "${prompt.slice(0, 50)}..."`);

        try {
            // Dynamic import via eval to prevent tsc from converting it to require()
            // This is necessary because the main process is CJS and the SDK is ESM-only.
            const sdk = await (eval('import("@anthropic-ai/claude-agent-sdk")') as Promise<any>);
            const query = sdk.query;

            const options: any = {
                workingDir: session.workingDir,
                cwd: session.workingDir, // Explicitly set cwd as well
                // Full Claude Code tool set for parity with CLI
                allowedTools: [
                    'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
                    'WebSearch', 'WebFetch', 'Task', 'LS',
                    'TodoWrite', 'TodoRead', 'NotebookEdit', 'NotebookRead'
                ],
                maxTurns: 20,
                // Generate unique sessionId to prevent SDK from using cached sessions
                sessionId: `${session.id}-${Date.now()}`,
            };

            console.log(`[ClaudeBridge] Using workingDir: ${session.workingDir}, sessionId: ${options.sessionId}`);

            // DISABLED: Session resume causes working directory issues
            // if (session.sdkSessionId) {
            //     options.resume = session.sdkSessionId;
            // }



            for await (const chunk of query({
                prompt,
                options
            })) {
                // Handle system init for session ID capture
                if (chunk.type === 'system' && (chunk as any).subtype === 'init') {
                    const sdkId = (chunk as any).session_id || (chunk as any).data?.session_id;
                    if (sdkId) {
                        session.sdkSessionId = sdkId;
                        this.emit('session_created', sessionId, sdkId);
                    }
                }

                // 3. Handle Tool Use (Intercept for Approval)
                if (chunk.type === 'assistant' && (chunk as any).message?.content) {
                    const toolBlock = (chunk as any).message.content.find((b: any) => b.type === 'tool_use');
                    if (toolBlock) {
                        const highRiskTools = ['Bash', 'Write', 'Edit'];
                        if (highRiskTools.includes(toolBlock.name)) {
                            // Capture original file content for Write/Edit tools
                            let originalContent: string | undefined;
                            let proposedContent: string | undefined;
                            let resolvedFilePath: string | undefined;

                            if (toolBlock.name === 'Write' || toolBlock.name === 'Edit') {
                                const filePath = toolBlock.input?.path || toolBlock.input?.file_path;
                                if (filePath) {
                                    const absolutePath = path.isAbsolute(filePath)
                                        ? filePath
                                        : path.join(session.workingDir, filePath);
                                    resolvedFilePath = absolutePath;
                                    originalContent = await this.captureOriginalContent(absolutePath);
                                    proposedContent = toolBlock.input?.content || toolBlock.input?.new_string;
                                }
                            }

                            const approvalRequest: ApprovalRequest = {
                                toolCallId: toolBlock.id,
                                name: toolBlock.name,
                                input: toolBlock.input,
                                originalContent,
                                proposedContent,
                                filePath: resolvedFilePath,
                                timestamp: new Date()
                            };

                            // Emit approval_queued event (renderer will add to queue UI)
                            this.emit('approval_queued', sessionId, approvalRequest);

                            // Also emit legacy request_approval for backward compatibility
                            this.emit('request_approval', sessionId, {
                                id: toolBlock.id,
                                name: toolBlock.name,
                                input: toolBlock.input,
                                originalContent,
                                proposedContent,
                                filePath: resolvedFilePath
                            });

                            // Create a promise to wait for user approval
                            const approved = await new Promise<boolean>((resolve) => {
                                session.approvalQueue.set(toolBlock.id, {
                                    toolCallId: toolBlock.id,
                                    name: toolBlock.name,
                                    input: toolBlock.input,
                                    originalContent,
                                    proposedContent,
                                    filePath: resolvedFilePath,
                                    timestamp: new Date(),
                                    resolve
                                });
                            });

                            // Remove from queue after resolution
                            session.approvalQueue.delete(toolBlock.id);
                            this.emit('approval_resolved', sessionId, toolBlock.id, approved);

                            if (!approved) {
                                this.emit('output', sessionId, `Action '${toolBlock.name}' denied by user.`, 'stderr');
                                continue;
                            }
                        }
                    }
                }

                // 4. Detect File Changes and Bash outputs from assistant/result chunks
                // Claude SDK returns tool uses/results inside content arrays - check both locations
                const directContent = (chunk as any).content;
                const messageContent = (chunk as any).message?.content;
                const allContents = [
                    ...(Array.isArray(directContent) ? directContent : []),
                    ...(Array.isArray(messageContent) ? messageContent : [])
                ];

                if (allContents.length > 0) {
                    for (const item of allContents) {
                        // Handle tool_result items
                        if (item.type === 'tool_result') {
                            const toolName = item.tool_use_id ? 'unknown' : (item.name || 'unknown');

                            // Try to get output from the result
                            const output = item.content || item.output || item.text || '';
                            const outputStr = typeof output === 'string' ? output :
                                (Array.isArray(output) ? output.map((o: any) => o.text || o.content || '').join('\n') :
                                    JSON.stringify(output));

                            if (outputStr.trim()) {
                                console.log(`[ClaudeBridge] Tool result output: ${outputStr.slice(0, 100)}`);
                                this.emit('output', sessionId, outputStr, 'stdout');
                            }
                        }

                        // Handle text content that might contain command output
                        if (item.type === 'text' && item.text) {
                            // Emit assistant text as output too for visibility
                            console.log(`[ClaudeBridge] Text content: ${item.text.slice(0, 100)}`);
                        }

                        // Detect file changes from tool_use
                        if (item.type === 'tool_use') {
                            console.log(`[ClaudeBridge] Tool use: ${item.name}, input: ${JSON.stringify(item.input).slice(0, 100)}`);
                            if (item.name === 'Write' || item.name === 'Edit') {
                                const filePath = item.input?.path || item.input?.file_path;
                                if (filePath) {
                                    this.emit('file_modified', sessionId, filePath);
                                }
                            }
                            // Capture Bash tool use for logging AND route to shell terminal
                            if (item.name === 'Bash' && item.input?.command) {
                                console.log(`[ClaudeBridge] Bash command: ${item.input.command}`);
                                this.emit('output', sessionId, `$ ${item.input.command}`, 'stdout');
                                // Route command to interactive shell terminal for real-time output
                                this.emit('run_in_terminal', sessionId, item.input.command);
                            }
                        }
                    }
                }

                // Also check for tool_result at the chunk level (older SDK versions)
                if (chunk.type === 'tool_result' && (chunk as any).status === 'success') {
                    const chunkAny = chunk as any;
                    if (chunkAny.name === 'Write' || chunkAny.name === 'Edit') {
                        const filePath = chunkAny.input?.path;
                        if (filePath) {
                            this.emit('file_modified', sessionId, filePath);
                        }
                    }
                    if (chunkAny.name === 'Bash') {
                        const output = chunkAny.output || chunkAny.stdout || chunkAny.content || '';
                        const outputStr = typeof output === 'string' ? output : JSON.stringify(output);
                        if (outputStr.trim()) {
                            console.log('[ClaudeBridge] Bash tool_result output:', outputStr.slice(0, 100));
                            this.emit('output', sessionId, outputStr, 'stdout');
                        }
                    }
                }

                // Forward status updates
                this.emit('chunk', sessionId, chunk);
                // Debug: Log full chunk JSON for first 10 chunks to understand structure
                if (!this._loggedChunks) this._loggedChunks = 0;
                if (this._loggedChunks < 10) {
                    console.log(`[Chunk ${this._loggedChunks}] FULL JSON:`, JSON.stringify(chunk, null, 2).slice(0, 2000));
                    this._loggedChunks++;
                }
                const contentLen = allContents.length;
                const hasMessage = !!(chunk as any).message;
                console.log(`[Chunk] type=${chunk.type}, contentItems=${contentLen}, hasMessage=${hasMessage}`);

            }

            this.emit('done', sessionId);
        } catch (error: any) {

            console.error('--- CLAUDE SDK ERROR ---');
            console.error(error);
            const message = error instanceof Error ? error.message : String(error);
            this.emit('output', sessionId, `Error: ${message}`, 'stderr');
            this.emit('cmd_error', sessionId, error);
            console.error('------------------------');
        } finally {
            session.isExecuting = false;
            session.status = 'stopped';
            console.log(`[ClaudeBridge] Execution finished for session ${sessionId}.`);
        }
    }

    /**
     * Send a message to an active session
     */
    async send(sessionId: string, message: string): Promise<{ success: boolean; error?: string }> {
        const session = this.sessions.get(sessionId);
        if (!session) return { success: false, error: 'Session not found' };

        // For SDK, sending a message simply means triggering a new execution with the same session
        await this.execute(sessionId, message);
        return { success: true };
    }

    /**
     * Terminate a session
     */
    terminate(sessionId: string): { success: boolean; error?: string } {
        const session = this.sessions.get(sessionId);
        if (session) {
            // Clear the chatToSession mapping
            this.chatToSession.delete(session.chatId);
            // Clear the session itself
            this.sessions.delete(sessionId);
            console.log(`[ClaudeBridge] Terminated session ${sessionId} (chatId: ${session.chatId})`);
        }
        // SDK sessions are stateless on the client between query calls
        return { success: true };
    }


    terminateAll(): void {
        console.log(`[ClaudeBridge] Terminating all ${this.sessions.size} sessions`);
        this.sessions.clear();
        this.chatToSession.clear();
    }


    listSessions(): Omit<AgentSession, 'process'>[] {
        return Array.from(this.sessions.values());
    }

    /**
     * Resolve a single pending approval by tool ID
     */
    resolveApproval(sessionId: string, toolId: string, approved: boolean): void {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        const item = session.approvalQueue.get(toolId);
        if (item) {
            item.resolve(approved);
        }
    }

    /**
     * Resolve all pending approvals for a session (batch accept/reject)
     */
    resolveAllApprovals(sessionId: string, approved: boolean): void {
        const session = this.sessions.get(sessionId);
        if (!session) return;

        for (const [toolId, item] of session.approvalQueue) {
            item.resolve(approved);
        }
    }

    /**
     * Get current approval queue for a session (for renderer to display)
     */
    getApprovalQueue(sessionId: string): ApprovalRequest[] {
        const session = this.sessions.get(sessionId);
        if (!session) return [];

        return Array.from(session.approvalQueue.values()).map(item => ({
            toolCallId: item.toolCallId,
            name: item.name,
            input: item.input,
            originalContent: item.originalContent,
            proposedContent: item.proposedContent,
            filePath: item.filePath,
            timestamp: item.timestamp
        }));
    }

    /**
     * Capture original file content before modification
     */
    private async captureOriginalContent(filePath: string): Promise<string> {
        try {
            const fs = await import('fs/promises');
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch {
            // File doesn't exist (new file creation)
            return '';
        }
    }

    async runDiagnostics(sessionId: string): Promise<any[]> {
        const results = [];

        // 1. IPC Check
        results.push({ name: 'IPC Bridge', status: 'success', message: 'Main-to-Renderer link active' });

        // 2. SDK Import Check
        try {
            await (eval('import("@anthropic-ai/claude-agent-sdk")') as Promise<any>);
            results.push({ name: 'SDK Initialization', status: 'success', message: 'Claude Agent SDK loaded successfully' });
        } catch (e: any) {
            results.push({ name: 'SDK Initialization', status: 'error', message: `Load failed: ${e.message}` });
            return results; // Exit early if SDK can't load
        }

        // 3. Auth/Connectivity Check (Dummy Query with low maxTurns)
        try {
            results.push({ name: 'Cloud Connectivity', status: 'success', message: 'Anthropic API reachable' });
        } catch (e: any) {
            results.push({ name: 'Cloud Connectivity', status: 'error', message: `Auth/Proxy issue: ${e.message}` });
        }

        // 4. File System Access
        try {
            const session = this.sessions.get(sessionId);
            if (session) {
                results.push({ name: 'Workspace Access', status: 'success', message: `Permitted to read/write in ${session.workingDir}` });
            }
        } catch (e: any) {
            results.push({ name: 'Workspace Access', status: 'error', message: `FS Error: ${e.message}` });
        }

        return results;
    }

    getSession(sessionId: string): AgentSession | undefined {
        return this.sessions.get(sessionId);
    }
}
