/**
 * Chat Panel Component
 * 
 * Left sidebar showing agent conversation with Claude Code CLI.
 * Features: Markdown support, code highlighting, and 'thinking' states.
 */

import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Loader2, Terminal, Sparkles, User, Bot, Layout, FolderOpen, MessageSquare, CheckCircle, AlertTriangle, ChevronDown, ChevronRight, X, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatPanel.css';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    thought?: string;
    toolCalls?: any[];
    isThinking?: boolean;
}

interface Session {
    id: string;
    name: string;
    status: 'starting' | 'running' | 'stopped';
}



interface ChatPanelProps {
    onGetCanvasState?: () => any;
    onWorkspaceChange?: (path: string) => void;
    onToggleSidebar?: (view: 'chat' | 'files') => void;
    activeSidebar?: 'chat' | 'files' | 'components' | 'layers';
    isBridgeReady: boolean;
    workspacePath?: string | null;
}

function ToolCard({ tool, onResolve }: { tool: any, onResolve?: (approved: boolean) => void }) {
    const isResult = tool.type === 'tool_result';
    const isPending = tool.status === 'pending_approval';
    const name = tool.name;
    const input = tool.input;

    const getToolInfo = (name: string) => {
        switch (name) {
            case 'Read': return { icon: <FolderOpen size={14} />, label: 'Reading file', color: 'var(--accent-primary)' };
            case 'Write': return { icon: <Plus size={14} />, label: 'Creating file', color: 'var(--status-success)' };
            case 'Edit': return { icon: <Sparkles size={14} />, label: 'Applying changes', color: 'var(--accent-secondary)' };
            case 'Bash': return { icon: <Terminal size={14} />, label: 'Running command', color: 'var(--text-primary)' };
            case 'Glob':
            case 'Grep': return { icon: <Sparkles size={14} />, label: 'Searching project', color: 'var(--accent-primary)' };
            default: return { icon: <Terminal size={14} />, label: 'Executing tool', color: 'var(--text-tertiary)' };
        }
    };

    const info = getToolInfo(name);

    if (isResult) {
        return (
            <div className="tool-card tool-result animate-in">
                <div className="tool-card-header">
                    <span className="tool-icon" style={{ color: tool.status === 'error' ? 'var(--status-error)' : 'var(--status-success)' }}>
                        {tool.status === 'error' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                    </span>
                    <span className="tool-label">{tool.status === 'error' ? 'Tool Failed' : 'Action Complete'}</span>
                </div>
                {tool.content && typeof tool.content === 'string' && (
                    <div className="tool-result-content">
                        {tool.content.length > 200 ? `${tool.content.slice(0, 200)}...` : tool.content}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`tool-card tool-call animate-in ${isPending ? 'pending' : ''}`}>
            <div className="tool-card-header">
                <span className="tool-icon" style={{ color: info.color }}>{info.icon}</span>
                <span className="tool-label">{isPending ? `Confirm ${name}` : info.label}</span>
                <div className="tool-card-meta">
                    <span className="tool-name">{name}</span>
                    <span className={`risk-tag risk-${['Bash', 'Write', 'Edit'].includes(name) ? 'high' : 'low'}`}>
                        {['Bash', 'Write', 'Edit'].includes(name) ? 'High Risk' : 'Standard'}
                    </span>
                </div>
            </div>
            {input && (
                <div className="tool-input-details">
                    {input.path && <div className="detail-row"><strong>Path:</strong> <code>{input.path}</code></div>}
                    {input.command && <div className="detail-row"><strong>Run:</strong> <code>{input.command}</code></div>}
                </div>
            )}
            {isPending && onResolve && (
                <div className="tool-approval-actions">
                    <button className="approve-btn" onClick={() => onResolve(true)}>
                        <CheckCircle size={14} />
                        <span>Approve</span>
                    </button>
                    <button className="deny-btn" onClick={() => onResolve(false)}>
                        <X size={14} />
                        <span>Deny</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export function ChatPanel({ onGetCanvasState, onWorkspaceChange, onToggleSidebar, activeSidebar = 'chat', isBridgeReady, workspacePath }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [activeSession, setActiveSession] = useState<string | null>(null);
    const [agents, setAgents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [turnCount, setTurnCount] = useState({ current: 0, max: 20 });
    const [sessionNames, setSessionNames] = useState<Record<string, string>>({});
    // Per-session message storage so chat history persists when switching tabs
    const [sessionMessages, setSessionMessages] = useState<Record<string, Message[]>>({});
    // Track deleted sessions to prevent them from reappearing via coordinator sync
    const deletedSessionsRef = useRef<Set<string>>(new Set());
    // Queue chunks that arrive before activeSession is set (race condition fix)
    const pendingChunksRef = useRef<Array<{ sessionId: string; chunk: any }>>([]);

    // Derived: get messages for the active session
    const messages = activeSession ? (sessionMessages[activeSession] || []) : [];

    // Helper to update messages for the active session
    const setMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
        if (!activeSession) return;
        setSessionMessages(prev => {
            const currentMessages = prev[activeSession] || [];
            const newMessages = typeof updater === 'function' ? updater(currentMessages) : updater;
            return { ...prev, [activeSession]: newMessages };
        });
    };
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    // Sync with Coordinator
    useEffect(() => {
        if (!isBridgeReady) return;

        const unsub = window.coordinator.onUpdate((state) => {
            // Filter out sessions that were manually deleted
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

    // Track workspace transition to prevent double execution
    const isTransitioningRef = useRef(false);
    const lastWorkspaceRef = useRef<string | null>(null);

    // Auto-restart agent when workspace changes
    useEffect(() => {
        if (!workspacePath || !isBridgeReady || !window.coordinator || !window.claudeCode) return;

        // Prevent double execution for the same workspace
        if (isTransitioningRef.current || lastWorkspaceRef.current === workspacePath) {
            console.log('[ChatPanel] Skipping duplicate workspace change for:', workspacePath);
            return;
        }

        isTransitioningRef.current = true;
        lastWorkspaceRef.current = workspacePath;

        const restartInNewWorkspace = async () => {
            const folderName = workspacePath.split('/').pop() || workspacePath;

            // Terminate ALL sessions at the bridge level - this ensures complete cleanup
            console.log('[ChatPanel] Terminating all sessions for workspace change to:', workspacePath);
            await window.claudeCode.terminateAll();

            // Clear UI state
            setAgents([]);
            setActiveSession(null);
            setSessionMessages({});
            deletedSessionsRef.current.clear();

            // Start new session in the new folder
            const result = await window.coordinator.startAgent(workspacePath, 'Creative AI Specialist');
            console.log('[ChatPanel] startAgent result:', result);

            if (result.success && result.sessionId) {
                console.log('[ChatPanel] Setting activeSession to:', result.sessionId);
                setActiveSession(result.sessionId);
                setTurnCount({ current: 0, max: 20 });
                setMessages([{
                    id: 'workspace-change',
                    role: 'system',
                    content: `🔄 Switched to **${folderName}**\n\n📂 \`${workspacePath}\`\n\nClaude agent restarted in new folder.`,
                    timestamp: new Date(),
                }]);
            } else {
                console.error('[ChatPanel] startAgent failed:', result);
            }

            isTransitioningRef.current = false;
        };

        restartInNewWorkspace();
    }, [workspacePath, isBridgeReady]);




    // Helper function to process a chunk - extracted so we can use it for both live and queued chunks
    const processChunk = (sessionId: string, chunk: any) => {
        setSessionMessages(prev => {
            const currentMessages = prev[sessionId] || [];
            const lastMsg = currentMessages[currentMessages.length - 1];

            // 1. Handle Thoughts (Reasoning)
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

            // 2. Handle Text Content
            if (chunk.type === 'assistant' && chunk.message?.content) {
                const textBlock = chunk.message.content.find((b: any) => b.type === 'text');
                if (textBlock && textBlock.text) {
                    // Increment turn count on new assistant text
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

            // 3. Handle Tool Use (Stored for visual rendering)
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

            // 4. Handle Tool Results
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
    };

    // Listen for Claude Code SDK events
    useEffect(() => {
        if (!window.claudeCode) return;

        const unsubChunk = window.claudeCode.onChunk(({ sessionId, chunk }) => {
            // If no active session yet, queue the chunk for later processing
            // This handles the race condition where chunks stream before activeSession is set
            if (!activeSession) {
                console.log('[ChatPanel] Queueing chunk for session:', sessionId);
                pendingChunksRef.current.push({ sessionId, chunk });
                return;
            }

            // Only process chunks for the active session
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
                const toolWithPending = { ...request, status: 'pending_approval' };

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
    }, [activeSession]);

    // Process pending chunks when activeSession changes
    useEffect(() => {
        if (!activeSession) return;

        // Process any queued chunks for this session
        const chunksToProcess = pendingChunksRef.current.filter(c => c.sessionId === activeSession);
        if (chunksToProcess.length > 0) {
            console.log(`[ChatPanel] Processing ${chunksToProcess.length} queued chunks for session:`, activeSession);
            chunksToProcess.forEach(({ sessionId, chunk }) => {
                processChunk(sessionId, chunk);
            });
            // Clear processed chunks
            pendingChunksRef.current = pendingChunksRef.current.filter(c => c.sessionId !== activeSession);
        }
    }, [activeSession]);

    const handleResolveTool = async (sessionId: string, toolId: string, approved: boolean) => {
        // Update UI state
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

        // Send to Bridge
        await window.claudeCode.resolveApproval(sessionId, approved);
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

        // Use already-selected workspace if available, otherwise prompt for folder
        let workingDir = workspacePath;
        let isNewWorkspace = false;

        if (!workingDir) {
            const folderResult = await window.fileSystem.selectFolder();
            if (!folderResult.success || !folderResult.path) {
                setIsLoading(false);
                setMessages([{
                    id: 'no-folder',
                    role: 'system',
                    content: '📁 No folder selected. Please select a project folder to start.',
                    timestamp: new Date(),
                }]);
                return;
            }
            workingDir = folderResult.path;
            isNewWorkspace = true;
            // This will trigger the workspace change useEffect which handles session creation
            onWorkspaceChange?.(workingDir);
            setIsLoading(false);
            return; // Let the effect handle session creation
        }

        // If we already have a workspace, terminate and restart in the same folder
        if (window.claudeCode) {
            console.log('[ChatPanel] Terminating all sessions before starting new one...');
            await window.claudeCode.terminateAll();
            setAgents([]);
            deletedSessionsRef.current.clear();
        }

        const folderName = workingDir.split('/').pop() || workingDir;

        // Now start agent in the selected folder
        const result = await window.coordinator.startAgent(workingDir, 'Creative AI Specialist');
        setIsLoading(false);

        if (result.success) {
            setActiveSession(result.sessionId || null);
            setSessionMessages({}); // Clear old messages
            setMessages([{
                id: 'session-start',
                role: 'system',
                content: `🚀 Claude Code agent started in **${folderName}**\n\n📂 \`${workingDir}\`\n\nReady to design and edit files.`,
                timestamp: new Date(),
            }]);
        } else {
            setMessages([{
                id: 'session-error',
                role: 'system',
                content: `Failed to start agent: ${result.error}`,
                timestamp: new Date(),
            }]);
        }

    };

    const sendMessage = async () => {
        console.log('[ChatPanel] sendMessage called', { input: input.trim(), activeSession, hasClaudeCode: !!window.claudeCode });
        if (!input.trim() || !activeSession || !window.claudeCode) {
            console.warn('[ChatPanel] sendMessage aborted:', { hasInput: !!input.trim(), activeSession, hasClaudeCode: !!window.claudeCode });
            return;
        }


        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        // Auto-name session based on first user message
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
            content: '📤 Sent canvas state to AI Agent.',
            timestamp: new Date(),
        }]);
    };

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div className="header-title">
                    <Sparkles size={16} className="text-accent-primary" />
                    <div className="title-wrapper">
                        <h2>Creative AI Specialist</h2>
                        <div className="session-progress">
                            <div className="progress-labels">
                                <span>Turn {turnCount.current}/{turnCount.max}</span>
                            </div>
                            <div className="progress-track">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(turnCount.current / turnCount.max) * 100}%` }}
                                />
                            </div>
                        </div>
                        {workspacePath && (
                            <button
                                className="workspace-context"
                                title={`${workspacePath} (Click to change)`}
                                onClick={async () => {
                                    const folderResult = await window.fileSystem.selectFolder();
                                    if (folderResult.success && folderResult.path) {
                                        onWorkspaceChange?.(folderResult.path);
                                    }
                                }}
                            >
                                <FolderOpen size={12} />
                                <span>{workspacePath.split('/').pop()}</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button
                        className="chat-diag-btn"
                        onClick={() => {
                            // Focus diagnostic tab in footer (imaginary or managed by prop)
                            alert("Select 'Diagnostics' tab in the bottom panel to run connection tests.");
                        }}
                        title="Connection Diagnostics"
                    >
                        <Shield size={14} />
                    </button>
                    {agents.length > 0 && (
                        <button
                            className="chat-diag-btn danger"
                            onClick={async () => {
                                if (!window.claudeCode) return;
                                console.log('[ChatPanel] Clearing all agents...');
                                await window.claudeCode.terminateAll();
                                setAgents([]);
                                setActiveSession(null);
                                setSessionMessages({});
                                deletedSessionsRef.current.clear();
                            }}
                            title="Clear All Agents"
                        >
                            <X size={14} />
                        </button>
                    )}

                    <button
                        className="chat-new-btn"
                        onClick={startSession}
                        disabled={isLoading || !isBridgeReady}
                    >
                        <Plus size={14} />
                        <span>New Specialist</span>
                    </button>
                </div>

            </div>

            {/* View Toggle Tabs */}
            <div className="view-toggle">
                <button
                    className={`toggle-btn ${activeSidebar === 'chat' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar?.('chat')}
                >
                    <MessageSquare size={14} />
                    <span>Chat</span>
                </button>
                <button
                    className={`toggle-btn ${activeSidebar === 'files' ? 'active' : ''}`}
                    onClick={() => onToggleSidebar?.('files')}
                >
                    <FolderOpen size={14} />
                    <span>Files</span>
                </button>
            </div>

            {/* Session Tabs */}
            <div className="session-tabs">
                <div className="tabs-scroll">
                    {agents.map(agent => (
                        <div
                            key={agent.id}
                            className={`session-tab ${activeSession === agent.id ? 'active' : ''}`}
                            onClick={() => setActiveSession(agent.id)}
                        >
                            <div className={`status-dot status-${agent.status}`} />
                            <span title={sessionNames[agent.id] || agent.id}>
                                {sessionNames[agent.id] || agent.id.slice(0, 4)}
                            </span>
                            <button
                                className="tab-close-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const agentId = agent.id;

                                    // Mark as deleted to prevent re-sync from coordinator
                                    deletedSessionsRef.current.add(agentId);

                                    // Immediately remove from local state (don't wait for coordinator)
                                    setAgents(prev => prev.filter(a => a.id !== agentId));

                                    // Clean up session data
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

                                    // Switch to another session if this was active
                                    if (activeSession === agentId) {
                                        const remaining = agents.filter(a => a.id !== agentId);
                                        setActiveSession(remaining.length > 0 ? remaining[0].id : null);
                                    }

                                    // Terminate in the background
                                    if (window.claudeCode) {
                                        window.claudeCode.terminate(agentId);
                                    }
                                }}
                                title="Close session"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    <button
                        className="tab-add-btn"
                        onClick={startSession}
                        disabled={isLoading || !isBridgeReady}
                        title="New chat"
                    >
                        <Plus size={12} />
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        <div className="welcome-content animate-in">
                            <div className="empty-icon-container">
                                <Bot size={64} strokeWidth={1} />
                            </div>
                            <h3>Welcome to Studio</h3>
                            <p>Start a session to design components, generate UI, or refactor existing plans with Claude Code.</p>
                            <button className="start-btn-large" onClick={startSession} disabled={isLoading}>
                                {isLoading ? <Loader2 size={16} className="spinning" /> : 'Start Designing'}
                            </button>
                        </div>
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className={`chat-message chat-message-${msg.role} animate-in`}>
                        <div className="message-avatar">
                            {msg.role === 'user' ? <User size={14} /> : msg.role === 'system' ? <Terminal size={14} /> : <Bot size={14} />}
                        </div>
                        <div className="chat-message-content">
                            {/* 1. Thoughts (Collapsible) */}
                            {msg.thought && (
                                <details className="message-thought">
                                    <summary>
                                        <Sparkles size={12} />
                                        <span>Thinking Process</span>
                                    </summary>
                                    <div className="thought-content">
                                        <ReactMarkdown>{msg.thought}</ReactMarkdown>
                                    </div>
                                </details>
                            )}

                            {/* 2. Primary Content */}
                            {msg.content && (
                                <div className="message-text">
                                    {msg.role === 'system' ? (
                                        <div className="system-text">{msg.content}</div>
                                    ) : (
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }: any) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            {...props}
                                                            style={vscDarkPlus}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            customStyle={{ margin: '0.5em 0', borderRadius: '6px', fontSize: '12px' }}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            )}

                            {/* 3. Tool Cards */}
                            {msg.toolCalls && msg.toolCalls.map((tool, idx) => (
                                <ToolCard
                                    key={idx}
                                    tool={tool}
                                    onResolve={tool.status === 'pending_approval' ? (approved) => handleResolveTool(activeSession!, tool.id, approved) : undefined}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="chat-message chat-message-assistant chat-message-loading">
                        <div className="message-avatar"><Bot size={14} /></div>
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                {turnCount.current >= 15 && (
                    <div className="turn-warning animate-in">
                        <AlertTriangle size={12} />
                        <span>High turn count ({turnCount.current}/20). Consider starting a new session soon.</span>
                    </div>
                )}
                <div className="input-wrapper">
                    <button
                        className="chat-context-btn"
                        onClick={sendCanvasState}
                        disabled={!activeSession || isLoading}
                        title="Send Canvas State as context"
                    >
                        <Layout size={18} />
                    </button>
                    <textarea
                        className="chat-input"
                        placeholder={activeSession ? "Ask Claude to design or edit..." : "Start a session to chat"}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        disabled={!activeSession || isLoading}
                        rows={1}
                        style={{ height: 'auto', minHeight: '40px', maxHeight: '120px' }}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={sendMessage}
                        disabled={!activeSession || !input.trim() || isLoading}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
