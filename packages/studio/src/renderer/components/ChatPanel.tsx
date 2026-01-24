/**
 * Chat Panel Component
 *
 * Left sidebar showing agent conversation with Claude Code CLI.
 * Refactored into modular sub-components for maintainability.
 */

import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
    ChatHeader,
    ChatMessage,
    ChatInput,
    ChatSearch,
    SessionTabs,
    TypingIndicator,
    WelcomeScreen,
    Message,
    Agent,
    ToolInfo
} from './chat';
import { ApprovalQueue } from './ApprovalQueue';
import './ChatPanel.css';

interface ChatPanelProps {
    onGetCanvasState?: () => any;
    onWorkspaceChange?: (path: string) => void;
    onToggleSidebar?: (view: 'chat' | 'files') => void;
    activeSidebar?: 'chat' | 'files' | 'components' | 'layers';
    isBridgeReady: boolean;
    workspacePath?: string | null;
}

/**
 * Imperative methods exposed via ref
 */
export interface ChatPanelRef {
    handleEditElement: (element: any, instruction: string) => void;
}

export const ChatPanel = forwardRef<ChatPanelRef, ChatPanelProps>(function ChatPanel({
    onGetCanvasState,
    onWorkspaceChange,
    onToggleSidebar,
    activeSidebar = 'chat',
    isBridgeReady,
    workspacePath
}, ref) {
    // Input state
    const [input, setInput] = useState('');

    // Session state
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [sessionNames, setSessionNames] = useState<Record<string, string>>({});
    const [sessionMessages, setSessionMessages] = useState<Record<string, Message[]>>({});

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [turnCount, setTurnCount] = useState({ current: 0, max: 20 });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [showTimestamps, setShowTimestamps] = useState(true);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const deletedSessionsRef = useRef<Set<string>>(new Set());
    const pendingChunksRef = useRef<Array<{ sessionId: string; chunk: any }>>([]);
    const isTransitioningRef = useRef(false);
    const lastWorkspaceRef = useRef<string | null>(null);

    // Derived state
    const messages = activeSession ? (sessionMessages[activeSession] || []) : [];

    // Helper to update messages for active session
    const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
        if (!activeSession) return;
        setSessionMessages(prev => {
            const currentMessages = prev[activeSession] || [];
            const newMessages = typeof updater === 'function' ? updater(currentMessages) : updater;
            return { ...prev, [activeSession]: newMessages };
        });
    }, [activeSession]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMod = e.metaKey || e.ctrlKey;

            // Mod+K: New session
            if (isMod && e.key === 'k') {
                e.preventDefault();
                startSession();
            }

            // Mod+F: Search
            if (isMod && e.key === 'f') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
            }

            // Escape: Close search
            if (e.key === 'Escape' && isSearchOpen) {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    // Sync with Coordinator
    useEffect(() => {
        if (!isBridgeReady) return;

        const unsub = window.coordinator.onUpdate((state) => {
            const filteredAgents = state.agents.filter(
                (a: any) => !deletedSessionsRef.current.has(a.id)
            );
            setAgents(filteredAgents);
            const activeAgent = filteredAgents.find((a: any) => a.status !== 'stopped');
            if (activeAgent && !activeSession) {
                setActiveSession(activeAgent.id);
            }
        });

        // Initial sync
        window.coordinator.getState().then((state) => {
            const filteredAgents = state.agents.filter(
                (a: any) => !deletedSessionsRef.current.has(a.id)
            );
            setAgents(filteredAgents);
            const activeAgent = filteredAgents.find((a: any) => a.status !== 'stopped');
            if (activeAgent && !activeSession) setActiveSession(activeAgent.id);
        });

        return unsub;
    }, [activeSession, isBridgeReady]);

    // Auto-restart agent when workspace changes
    useEffect(() => {
        if (!workspacePath || !isBridgeReady || !window.coordinator || !window.claudeCode) return;

        if (isTransitioningRef.current || lastWorkspaceRef.current === workspacePath) {
            return;
        }

        isTransitioningRef.current = true;
        lastWorkspaceRef.current = workspacePath;

        const restartInNewWorkspace = async () => {
            const folderName = workspacePath.split('/').pop() || workspacePath;

            await window.claudeCode.terminateAll();

            setAgents([]);
            setActiveSession(null);
            setSessionMessages({});
            deletedSessionsRef.current.clear();

            const result = await window.coordinator.startAgent(workspacePath, 'Creative AI Specialist');

            if (result.success && result.sessionId) {
                setActiveSession(result.sessionId);
                setTurnCount({ current: 0, max: 20 });
                setSessionMessages({});
                // No startup message - ready to type immediately
            }

            isTransitioningRef.current = false;
        };

        restartInNewWorkspace();
    }, [workspacePath, isBridgeReady]);

    // Process chunk helper
    const processChunk = useCallback((sessionId: string, chunk: any) => {
        setSessionMessages(prev => {
            const currentMessages = prev[sessionId] || [];
            const lastMsg = currentMessages[currentMessages.length - 1];

            // Handle Thoughts
            if (chunk.type === 'assistant' && chunk.message?.content) {
                const thoughtBlock = chunk.message.content.find((b: any) => b.type === 'thought');
                if (thoughtBlock) {
                    if (lastMsg && lastMsg.role === 'assistant') {
                        return {
                            ...prev,
                            [sessionId]: [
                                ...currentMessages.slice(0, -1),
                                { ...lastMsg, thought: (lastMsg.thought || '') + thoughtBlock.thought }
                            ]
                        };
                    }
                    return {
                        ...prev,
                        [sessionId]: [...currentMessages, {
                            id: `${Date.now()}-thought`,
                            role: 'assistant',
                            content: '',
                            thought: thoughtBlock.thought,
                            timestamp: new Date(),
                        }]
                    };
                }
            }

            // Handle Text Content
            if (chunk.type === 'assistant' && chunk.message?.content) {
                const textBlock = chunk.message.content.find((b: any) => b.type === 'text');
                if (textBlock && textBlock.text) {
                    if (!lastMsg || lastMsg.role !== 'assistant') {
                        setTurnCount(prev => ({ ...prev, current: prev.current + 1 }));
                    }

                    if (lastMsg && lastMsg.role === 'assistant') {
                        return {
                            ...prev,
                            [sessionId]: [
                                ...currentMessages.slice(0, -1),
                                { ...lastMsg, content: lastMsg.content + textBlock.text }
                            ]
                        };
                    }
                    return {
                        ...prev,
                        [sessionId]: [...currentMessages, {
                            id: `${Date.now()}-text`,
                            role: 'assistant',
                            content: textBlock.text,
                            timestamp: new Date(),
                        }]
                    };
                }
            }

            // Handle Tool Use
            if (chunk.type === 'assistant' && chunk.message?.content) {
                const toolBlock = chunk.message.content.find((b: any) => b.type === 'tool_use');
                if (toolBlock) {
                    if (lastMsg && lastMsg.role === 'assistant') {
                        return {
                            ...prev,
                            [sessionId]: [
                                ...currentMessages.slice(0, -1),
                                { ...lastMsg, toolCalls: [...(lastMsg.toolCalls || []), toolBlock] }
                            ]
                        };
                    }
                    return {
                        ...prev,
                        [sessionId]: [...currentMessages, {
                            id: `${Date.now()}-tool`,
                            role: 'assistant',
                            content: '',
                            toolCalls: [toolBlock],
                            timestamp: new Date(),
                        }]
                    };
                }
            }

            // Handle Tool Results
            if (chunk.type === 'tool_result') {
                return {
                    ...prev,
                    [sessionId]: [...currentMessages, {
                        id: `${Date.now()}-result`,
                        role: 'system',
                        content: '',
                        toolCalls: [{ type: 'tool_result', ...chunk }],
                        timestamp: new Date(),
                    }]
                };
            }

            return prev;
        });
    }, []);

    // Listen for Claude Code SDK events
    useEffect(() => {
        if (!window.claudeCode) return;

        const unsubChunk = window.claudeCode.onChunk(({ sessionId, chunk }) => {
            if (!activeSession) {
                pendingChunksRef.current.push({ sessionId, chunk });
                return;
            }
            if (sessionId !== activeSession) return;
            processChunk(sessionId, chunk);
        });

        const unsubDone = window.claudeCode.onDone(({ sessionId }) => {
            if (sessionId !== activeSession) return;
            setIsLoading(false);
        });

        const unsubExit = window.claudeCode.onExit(({ sessionId, code }) => {
            if (sessionId !== activeSession) return;
            setMessages(prev => [...prev, {
                id: `${Date.now()}-exit`,
                role: 'system',
                content: `Session ended (code: ${code})`,
                timestamp: new Date(),
            }]);
            setActiveSession(null);
            setIsLoading(false);
        });

        const unsubApproval = window.claudeCode.onRequestApproval(({ sessionId, request }) => {
            if (sessionId !== activeSession) return;

            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                // Transform ApprovalRequest into ToolInfo format
                const toolWithPending: ToolInfo = {
                    type: 'tool_use',
                    name: request.name,
                    input: request.input,
                    id: request.toolCallId,
                    status: 'pending_approval',
                    originalContent: request.originalContent,
                    proposedContent: request.proposedContent,
                    filePath: request.filePath,
                };

                if (lastMsg && lastMsg.role === 'assistant') {
                    return [
                        ...prev.slice(0, -1),
                        { ...lastMsg, toolCalls: [...(lastMsg.toolCalls || []), toolWithPending] }
                    ];
                }

                return [...prev, {
                    id: `${Date.now()}-approval`,
                    role: 'assistant',
                    content: '',
                    toolCalls: [toolWithPending],
                    timestamp: new Date(),
                }];
            });
        });

        return () => {
            unsubChunk();
            unsubDone();
            unsubExit();
            unsubApproval();
        };
    }, [activeSession, processChunk, setMessages]);

    // Process pending chunks when activeSession changes
    useEffect(() => {
        if (!activeSession) return;

        const chunksToProcess = pendingChunksRef.current.filter(c => c.sessionId === activeSession);
        if (chunksToProcess.length > 0) {
            chunksToProcess.forEach(({ sessionId, chunk }) => {
                processChunk(sessionId, chunk);
            });
            pendingChunksRef.current = pendingChunksRef.current.filter(c => c.sessionId !== activeSession);
        }
    }, [activeSession, processChunk]);

    // Handlers
    const handleResolveTool = async (sessionId: string, toolId: string, approved: boolean) => {
        setMessages(prev => prev.map(msg => {
            if (msg.toolCalls) {
                return {
                    ...msg,
                    toolCalls: msg.toolCalls.map(tc =>
                        tc.id === toolId ? { ...tc, status: approved ? 'approved' : 'denied' } : tc
                    )
                };
            }
            return msg;
        }));

        await window.claudeCode.resolveApproval(sessionId, toolId, approved);
    };

    const startSession = async () => {
        if (!window.coordinator || !window.fileSystem) {
            setMessages([{
                id: 'no-bridge',
                role: 'system',
                content: 'Agent Coordinator not available. Are you running in Electron?',
                timestamp: new Date(),
            }]);
            return;
        }

        setIsLoading(true);

        let workingDir = workspacePath;

        if (!workingDir) {
            const folderResult = await window.fileSystem.selectFolder();
            if (!folderResult.success || !folderResult.path) {
                setIsLoading(false);
                setMessages([{
                    id: 'no-folder',
                    role: 'system',
                    content: 'No folder selected. Please select a project folder to start.',
                    timestamp: new Date(),
                }]);
                return;
            }
            workingDir = folderResult.path;
            onWorkspaceChange?.(workingDir);
            setIsLoading(false);
            return;
        }

        if (window.claudeCode) {
            await window.claudeCode.terminateAll();
            setAgents([]);
            deletedSessionsRef.current.clear();
        }

        const folderName = workingDir.split('/').pop() || workingDir;
        const result = await window.coordinator.startAgent(workingDir, 'Creative AI Specialist');
        setIsLoading(false);

        if (result.success) {
            setActiveSession(result.sessionId || null);
            setSessionMessages({});
            // No startup message - user can start typing immediately
        } else {
            setMessages([{
                id: 'session-error',
                role: 'system',
                content: `Failed to start agent: ${result.error}`,
                timestamp: new Date(),
            }]);
        }
    };

    // Handle slash commands
    const handleSlashCommand = useCallback(async (command: string, args: string) => {
        const addSystemMessage = (content: string) => {
            setMessages(prev => [...prev, {
                id: `system-${Date.now()}`,
                role: 'system',
                content,
                timestamp: new Date(),
            }]);
        };

        switch (command.toLowerCase()) {
            case 'help':
                addSystemMessage(
                    `**Available Commands:**\n\n` +
                    `**/help** - Show available commands\n` +
                    `**/clear** - Clear chat history\n` +
                    `**/commit** - Create a git commit\n` +
                    `**/review** - Review code changes\n` +
                    `**/plan** - Create implementation plan\n` +
                    `**/test** - Run tests\n` +
                    `**/settings** - Open settings\n\n` +
                    `Tip: Type "/" to see autocomplete suggestions.`
                );
                break;

            case 'clear':
                setMessages([]);
                addSystemMessage('Chat history cleared.');
                break;

            case 'commit':
                if (!activeSession || !window.claudeCode) return;
                setIsLoading(true);
                await window.claudeCode.send(activeSession, `Create a git commit for the changes. ${args ? `Message: ${args}` : 'Analyze the changes and suggest an appropriate commit message.'}`);
                setIsLoading(false);
                break;

            case 'review':
                if (!activeSession || !window.claudeCode) return;
                setIsLoading(true);
                await window.claudeCode.send(activeSession, `Review the code changes${args ? ` in ${args}` : ' in the current branch'}. Look for bugs, security issues, and improvements.`);
                setIsLoading(false);
                break;

            case 'plan':
                if (!activeSession || !window.claudeCode) return;
                setIsLoading(true);
                await window.claudeCode.send(activeSession, `Create a detailed implementation plan for: ${args || 'the current task'}. Break it down into clear steps.`);
                setIsLoading(false);
                break;

            case 'test':
                if (!activeSession || !window.claudeCode) return;
                setIsLoading(true);
                await window.claudeCode.send(activeSession, `Run the tests${args ? ` for ${args}` : ''} and report the results.`);
                setIsLoading(false);
                break;

            case 'settings':
                // TODO: Open settings modal when implemented
                addSystemMessage('Settings modal coming soon. For now, modify settings in ~/.claude/studio-settings.json');
                break;

            default:
                // Pass unknown commands directly to Claude
                if (activeSession && window.claudeCode) {
                    setIsLoading(true);
                    await window.claudeCode.send(activeSession, `/${command} ${args}`);
                    setIsLoading(false);
                } else {
                    addSystemMessage(`Unknown command: /${command}. Type /help for available commands.`);
                }
        }
    }, [activeSession, setMessages]);

    /**
     * Handle element edit requests from Inspector (PropertiesPanel)
     * Builds context-aware prompt with element info and prefills input
     */
    const handleEditElement = useCallback((element: any, instruction: string) => {
        if (!element) return;

        // Build context-aware prompt
        const contextPrompt = instruction
            ? `${instruction}\n\nElement: <${element.tagName.toLowerCase()}> ${element.className ? `.${element.className.split(' ')[0]}` : ''}\nPath: ${element.path || 'N/A'}`
            : `I want to edit this ${element.tagName.toLowerCase()} element:\n` +
              `- Classes: ${element.className || 'none'}\n` +
              `- Path: ${element.path || 'N/A'}\n` +
              `- Dimensions: ${Math.round(element.rect?.width || 0)}×${Math.round(element.rect?.height || 0)}px\n` +
              `- Position: (${Math.round(element.rect?.left || 0)}, ${Math.round(element.rect?.top || 0)})\n\n` +
              `What would you like to change?`;

        setInput(contextPrompt);
    }, []);

    // Expose handleEditElement via ref for parent components
    useImperativeHandle(ref, () => ({
        handleEditElement
    }), [handleEditElement]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // Handle slash commands
        if (input.startsWith('/')) {
            const parts = input.slice(1).trim().split(' ');
            const command = parts[0];
            const args = parts.slice(1).join(' ');
            setInput('');
            await handleSlashCommand(command, args);
            return;
        }

        if (!activeSession || !window.claudeCode) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        // Auto-name session
        if (!sessionNames[activeSession]) {
            const shortName = input.trim().slice(0, 20).split(' ').slice(0, 3).join(' ');
            setSessionNames(prev => ({
                ...prev,
                [activeSession]: shortName + (input.length > 20 ? '...' : '')
            }));
        }

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        await window.claudeCode.send(activeSession, input.trim());
        setIsLoading(false);
    };

    const sendCanvasState = async () => {
        if (!onGetCanvasState || !activeSession || !window.claudeCode) return;
        const state = onGetCanvasState();
        const json = JSON.stringify(state, null, 2);

        setIsLoading(true);
        await window.claudeCode.send(activeSession, `[CONTEXT] Current Canvas State (ApenDocument):\n\`\`\`json\n${json}\n\`\`\``);
        setIsLoading(false);

        setMessages(prev => [...prev, {
            id: `system-${Date.now()}`,
            role: 'system',
            content: 'Sent canvas state to AI Agent.',
            timestamp: new Date(),
        }]);
    };

    const handleCloseSession = (agentId: string) => {
        deletedSessionsRef.current.add(agentId);
        setAgents(prev => prev.filter(a => a.id !== agentId));
        setSessionMessages(prev => {
            const updated = { ...prev };
            delete updated[agentId];
            return updated;
        });
        setSessionNames(prev => {
            const updated = { ...prev };
            delete updated[agentId];
            return updated;
        });

        if (activeSession === agentId) {
            const remaining = agents.filter(a => a.id !== agentId);
            setActiveSession(remaining.length > 0 ? remaining[0].id : null);
        }

        if (window.claudeCode) {
            window.claudeCode.terminate(agentId);
        }
    };

    const handleClearAll = async () => {
        if (!window.claudeCode) return;
        await window.claudeCode.terminateAll();
        setAgents([]);
        setActiveSession(null);
        setSessionMessages({});
        deletedSessionsRef.current.clear();
    };

    const handleExport = () => {
        if (messages.length === 0) return;

        const markdown = messages.map(msg => {
            const role = msg.role === 'user' ? '**You**' : msg.role === 'assistant' ? '**Claude**' : '**System**';
            const timestamp = msg.timestamp.toISOString();
            return `### ${role} (${timestamp})\n\n${msg.content || ''}\n`;
        }).join('\n---\n\n');

        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRenameSession = (name: string) => {
        if (!activeSession) return;
        setSessionNames(prev => ({ ...prev, [activeSession]: name }));
    };

    const handleNavigateToMessage = useCallback((messageId: string) => {
        const element = messagesContainerRef.current?.querySelector(`[data-message-id="${messageId}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    return (
        <div className="chat-panel">
            <ChatHeader
                title={sessionNames[activeSession || ''] || 'Creative AI Specialist'}
                turnCount={turnCount}
                workspacePath={workspacePath}
                onWorkspaceChange={onWorkspaceChange}
                onNewSession={startSession}
                onClearAll={handleClearAll}
                onExport={handleExport}
                onSearch={() => setIsSearchOpen(true)}
                onToggleSidebar={onToggleSidebar}
                activeSidebar={activeSidebar}
                hasAgents={agents.length > 0}
                isLoading={isLoading}
                isBridgeReady={isBridgeReady}
                sessionName={sessionNames[activeSession || '']}
                onRenameSession={handleRenameSession}
            />

            <SessionTabs
                agents={agents}
                activeSession={activeSession}
                sessionNames={sessionNames}
                onSelectSession={setActiveSession}
                onCloseSession={handleCloseSession}
                onNewSession={startSession}
                isLoading={isLoading}
                isBridgeReady={isBridgeReady}
            />

            {isSearchOpen && (
                <ChatSearch
                    messages={messages}
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    onNavigateToMessage={handleNavigateToMessage}
                />
            )}

            <div className="chat-messages" ref={messagesContainerRef}>
                {messages.length === 0 ? (
                    <WelcomeScreen
                        onStartSession={startSession}
                        isLoading={isLoading}
                    />
                ) : (
                    <>
                        {messages.map(msg => (
                            <div key={msg.id} data-message-id={msg.id}>
                                <ChatMessage
                                    message={msg}
                                    activeSession={activeSession}
                                    onResolveTool={handleResolveTool}
                                    showTimestamps={showTimestamps}
                                />
                            </div>
                        ))}
                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Floating Approval Queue for batch accept/reject */}
            <ApprovalQueue sessionId={activeSession} />

            <ChatInput
                value={input}
                onChange={setInput}
                onSend={sendMessage}
                onSendContext={sendCanvasState}
                disabled={!activeSession}
                isLoading={isLoading}
                turnCount={turnCount}
            />
        </div>
    );
});
