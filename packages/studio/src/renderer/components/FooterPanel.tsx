/**
 * Footer Panel Component
 *
 * Bottom panel with tabs for Terminal, Logs, Tasks, and Diagnostics.
 * Enhanced with search, filtering, keyboard shortcuts, and task management.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Terminal as TerminalIcon, ScrollText, ListTodo, ChevronUp, ChevronDown, Shield, Command, FileText, AlertCircle,
    CheckCircle2, Clock, Loader2, Search, X, Filter, Trash2, Download, Copy, ChevronRight,
    Pause, Play, RotateCcw, Timer, Info, AlertTriangle
} from 'lucide-react';
import { DiagnosticPanel } from './DiagnosticPanel';
import { Terminal } from './Terminal';
import { IconButton, SearchInput, Badge, CopyButton, Tooltip } from './ui';
import './FooterPanel.css';

interface LogEntry {
    id: string;
    content: string;
    type: 'command' | 'stdout' | 'stderr' | 'system' | 'info' | 'warning';
    timestamp: Date;
    tool?: string;
    sessionId?: string;
}

interface TaskEntry {
    id: string;
    tool: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'error' | 'cancelled';
    timestamp: Date;
    completedAt?: Date;
    input?: any;
    error?: string;
}

interface FooterPanelProps {
    isExpanded: boolean;
    onToggleExpand: (expanded: boolean) => void;
    activeSessionId: string | null;
    workspacePath?: string | null;
    onOpenPreviewUrl?: (url: string) => void;
}

type LogFilter = 'all' | 'command' | 'stdout' | 'stderr' | 'system' | 'info' | 'warning';
type TabType = 'shell' | 'logs' | 'tasks' | 'diagnostics';

const LOG_FILTERS: { id: LogFilter; label: string; icon: typeof Command }[] = [
    { id: 'all', label: 'All', icon: ScrollText },
    { id: 'command', label: 'Commands', icon: Command },
    { id: 'stdout', label: 'Output', icon: FileText },
    { id: 'stderr', label: 'Errors', icon: AlertCircle },
    { id: 'system', label: 'System', icon: Info },
];

export function FooterPanel({ isExpanded, onToggleExpand, activeSessionId, workspacePath, onOpenPreviewUrl }: FooterPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('shell');
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [tasks, setTasks] = useState<TaskEntry[]>([]);

    // Log search and filter
    const [logSearch, setLogSearch] = useState('');
    const [logFilter, setLogFilter] = useState<LogFilter>('all');
    const [showLogFilters, setShowLogFilters] = useState(false);
    const [showTimestamps, setShowTimestamps] = useState(true);
    const [autoScroll, setAutoScroll] = useState(true);

    // Task management
    const [taskSearch, setTaskSearch] = useState('');
    const [showOnlyActive, setShowOnlyActive] = useState(false);

    const logsEndRef = useRef<HTMLDivElement>(null);
    const logsContainerRef = useRef<HTMLDivElement>(null);

    // Filtered logs
    const filteredLogs = useMemo(() => {
        let filtered = logEntries;

        if (logFilter !== 'all') {
            filtered = filtered.filter(log => log.type === logFilter);
        }

        if (logSearch.trim()) {
            const search = logSearch.toLowerCase();
            filtered = filtered.filter(log =>
                log.content.toLowerCase().includes(search) ||
                log.tool?.toLowerCase().includes(search)
            );
        }

        return filtered;
    }, [logEntries, logFilter, logSearch]);

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        let filtered = tasks;

        if (showOnlyActive) {
            filtered = filtered.filter(t => t.status === 'pending' || t.status === 'running');
        }

        if (taskSearch.trim()) {
            const search = taskSearch.toLowerCase();
            filtered = filtered.filter(t =>
                t.tool.toLowerCase().includes(search) ||
                t.description.toLowerCase().includes(search)
            );
        }

        return filtered;
    }, [tasks, showOnlyActive, taskSearch]);

    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'running');
    const errorCount = logEntries.filter(l => l.type === 'stderr').length;

    // Listen for Claude CLI output and track tasks
    useEffect(() => {
        if (!window.claudeCode) return;

        const unsubOutput = window.claudeCode.onOutput(({ sessionId, data, stream }) => {
            const lines = data.split('\n').filter(line => line.trim());
            const newEntries: LogEntry[] = lines.map((line, i) => {
                const isCommand = line.trim().startsWith('$');
                return {
                    id: `${Date.now()}-${i}`,
                    content: isCommand ? line.trim().slice(2) : line,
                    type: isCommand ? 'command' : stream,
                    timestamp: new Date(),
                    tool: isCommand ? 'Bash' : undefined,
                    sessionId,
                };
            });

            if (newEntries.length > 0) {
                setLogEntries(prev => [...prev.slice(-500), ...newEntries]);
            }
        });

        const unsubChunk = window.claudeCode.onChunk(({ sessionId, chunk }) => {
            if (chunk.type === 'assistant' && chunk.message?.content) {
                const toolBlocks = chunk.message.content.filter((b: any) => b.type === 'tool_use');
                for (const tool of toolBlocks) {
                    const taskId = tool.id;
                    setTasks(prev => {
                        const existing = prev.find(t => t.id === taskId);
                        if (!existing) {
                            const description = getToolDescription(tool.name, tool.input);
                            return [...prev.slice(-100), {
                                id: taskId,
                                tool: tool.name,
                                description,
                                status: 'pending',
                                timestamp: new Date(),
                                input: tool.input,
                            }];
                        }
                        return prev;
                    });
                }
            }

            if (chunk.type === 'tool_result' || (chunk.content && Array.isArray(chunk.content))) {
                const contents = chunk.content || [];
                for (const item of contents) {
                    if (item.type === 'tool_result' && item.tool_use_id) {
                        setTasks(prev => prev.map(t =>
                            t.id === item.tool_use_id
                                ? {
                                    ...t,
                                    status: item.is_error ? 'error' : 'completed',
                                    completedAt: new Date(),
                                    error: item.is_error ? item.content : undefined
                                }
                                : t
                        ));
                    }
                }
            }
        });

        const unsubApproval = window.claudeCode.onRequestApproval(({ sessionId, request }) => {
            setTasks(prev => prev.map(t =>
                t.id === request.toolCallId ? { ...t, status: 'running' } : t
            ));
        });

        const unsubExit = window.claudeCode.onExit(({ sessionId, code }) => {
            setLogEntries(prev => [...prev, {
                id: `exit-${Date.now()}`,
                content: `Session ended with code ${code}`,
                type: 'system',
                timestamp: new Date(),
                sessionId,
            }]);
        });

        return () => {
            unsubOutput();
            unsubChunk();
            unsubApproval();
            unsubExit();
        };
    }, []);

    // Auto-switch to Shell tab when Claude routes a command to terminal
    useEffect(() => {
        if (!window.terminal?.onCommandRouted) return;

        const unsub = window.terminal.onCommandRouted(({ command }) => {
            setActiveTab('shell');
            setLogEntries(prev => [...prev, {
                id: `routed-${Date.now()}`,
                content: command,
                type: 'command',
                timestamp: new Date(),
                tool: 'Bash',
            }]);
        });

        return unsub;
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (activeTab === 'logs' && autoScroll) {
            logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filteredLogs, activeTab, autoScroll]);

    // Detect manual scroll to disable auto-scroll
    const handleLogsScroll = useCallback(() => {
        if (!logsContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        setAutoScroll(isAtBottom);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' ||
                (e.target as HTMLElement).tagName === 'TEXTAREA') {
                return;
            }

            const isMod = e.metaKey || e.ctrlKey;

            // Tab switching: Mod+1-4
            if (isMod && !e.shiftKey) {
                const tabs: TabType[] = ['shell', 'logs', 'tasks', 'diagnostics'];
                const num = parseInt(e.key);
                if (num >= 1 && num <= 4) {
                    e.preventDefault();
                    setActiveTab(tabs[num - 1]);
                    if (!isExpanded) onToggleExpand(true);
                }
            }

            // Toggle panel: Mod+`
            if (e.key === '`' && isMod) {
                e.preventDefault();
                onToggleExpand(!isExpanded);
            }

            // Clear logs: Mod+K in logs tab
            if (e.key === 'k' && isMod && activeTab === 'logs') {
                e.preventDefault();
                clearLogs();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isExpanded, onToggleExpand, activeTab]);

    const getToolDescription = (name: string, input: any): string => {
        switch (name) {
            case 'Bash':
                return input?.command?.slice(0, 80) + (input?.command?.length > 80 ? '...' : '') || 'Running command';
            case 'Read':
                return `Reading ${input?.file_path?.split('/').pop() || 'file'}`;
            case 'Write':
                return `Writing ${input?.file_path?.split('/').pop() || 'file'}`;
            case 'Edit':
                return `Editing ${input?.file_path?.split('/').pop() || 'file'}`;
            case 'Glob':
                return `Searching: ${input?.pattern || 'files'}`;
            case 'Grep':
                return `Finding: ${input?.pattern?.slice(0, 40) || 'pattern'}`;
            case 'Task':
                return `Running agent: ${input?.description?.slice(0, 40) || 'subagent'}`;
            default:
                return `${name} operation`;
        }
    };

    const getLogIcon = (type: LogEntry['type']) => {
        switch (type) {
            case 'command': return <Command size={12} className="log-icon command" />;
            case 'stderr': return <AlertCircle size={12} className="log-icon error" />;
            case 'warning': return <AlertTriangle size={12} className="log-icon warning" />;
            case 'system': return <Info size={12} className="log-icon system" />;
            case 'info': return <Info size={12} className="log-icon info" />;
            default: return null;
        }
    };

    const getTaskIcon = (status: TaskEntry['status']) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={14} className="task-icon completed" />;
            case 'error': return <AlertCircle size={14} className="task-icon error" />;
            case 'running': return <Loader2 size={14} className="task-icon running" />;
            case 'cancelled': return <X size={14} className="task-icon cancelled" />;
            default: return <Clock size={14} className="task-icon pending" />;
        }
    };

    const getTaskDuration = (task: TaskEntry): string => {
        const endTime = task.completedAt || new Date();
        const durationMs = endTime.getTime() - task.timestamp.getTime();

        if (durationMs < 1000) return `${durationMs}ms`;
        if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)}s`;
        return `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;
    };

    const clearLogs = () => {
        setLogEntries([]);
    };

    const clearTasks = () => {
        setTasks(prev => prev.filter(t => t.status === 'pending' || t.status === 'running'));
    };

    const exportLogs = () => {
        const content = filteredLogs.map(log => {
            const time = log.timestamp.toISOString();
            const tool = log.tool ? `[${log.tool}]` : '';
            return `[${time}] ${log.type.toUpperCase()} ${tool} ${log.content}`;
        }).join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyLogEntry = (log: LogEntry) => {
        navigator.clipboard.writeText(log.content);
    };

    return (
        <div className={`footer-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="footer-header">
                <div className="footer-tabs">
                    <button
                        className={`footer-tab ${activeTab === 'shell' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shell')}
                        title="Shell (Mod+1)"
                    >
                        <TerminalIcon size={14} />
                        <span>Shell</span>
                    </button>
                    <button
                        className={`footer-tab ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                        title="Logs (Mod+2)"
                    >
                        <ScrollText size={14} />
                        <span>Logs</span>
                        {logEntries.length > 0 && (
                            <Badge count={logEntries.length} max={99} />
                        )}
                        {errorCount > 0 && (
                            <Badge count={errorCount} variant="error" />
                        )}
                    </button>
                    <button
                        className={`footer-tab ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                        title="Tasks (Mod+3)"
                    >
                        <ListTodo size={14} />
                        <span>Tasks</span>
                        {pendingTasks.length > 0 && (
                            <Badge count={pendingTasks.length} variant="warning" />
                        )}
                    </button>
                    <button
                        className={`footer-tab ${activeTab === 'diagnostics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diagnostics')}
                        title="Diagnostics (Mod+4)"
                    >
                        <Shield size={14} />
                        <span>Diagnostics</span>
                    </button>
                </div>

                <button
                    className="expand-toggle"
                    onClick={() => onToggleExpand(!isExpanded)}
                    title={isExpanded ? 'Collapse (Mod+`)' : 'Expand (Mod+`)'}
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
            </div>

            {isExpanded && (
                <div className="footer-content">
                    {activeTab === 'shell' ? (
                        <Terminal
                            isVisible={isExpanded && activeTab === 'shell'}
                            workingDir={workspacePath || undefined}
                            onOpenPreviewUrl={onOpenPreviewUrl}
                        />
                    ) : activeTab === 'logs' ? (
                        <div className="logs-panel">
                            {/* Logs Toolbar */}
                            <div className="logs-toolbar">
                                <div className="logs-toolbar-left">
                                    <SearchInput
                                        value={logSearch}
                                        onChange={setLogSearch}
                                        placeholder="Search logs..."
                                        size="sm"
                                    />
                                    <div className="filter-dropdown">
                                        <button
                                            className={`filter-btn ${logFilter !== 'all' ? 'active' : ''}`}
                                            onClick={() => setShowLogFilters(!showLogFilters)}
                                        >
                                            <Filter size={14} />
                                            {logFilter !== 'all' && <span>{logFilter}</span>}
                                        </button>
                                        {showLogFilters && (
                                            <div className="filter-menu">
                                                {LOG_FILTERS.map(f => (
                                                    <button
                                                        key={f.id}
                                                        className={`filter-item ${logFilter === f.id ? 'active' : ''}`}
                                                        onClick={() => {
                                                            setLogFilter(f.id);
                                                            setShowLogFilters(false);
                                                        }}
                                                    >
                                                        <f.icon size={12} />
                                                        <span>{f.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="logs-toolbar-right">
                                    <span className="log-count">{filteredLogs.length} entries</span>
                                    <IconButton
                                        icon={<Clock size={14} />}
                                        label={showTimestamps ? 'Hide timestamps' : 'Show timestamps'}
                                        onClick={() => setShowTimestamps(!showTimestamps)}
                                        className={showTimestamps ? 'active' : ''}
                                    />
                                    <IconButton
                                        icon={<Download size={14} />}
                                        label="Export logs"
                                        onClick={exportLogs}
                                        disabled={filteredLogs.length === 0}
                                    />
                                    <IconButton
                                        icon={<Trash2 size={14} />}
                                        label="Clear logs (Mod+K)"
                                        onClick={clearLogs}
                                        disabled={logEntries.length === 0}
                                    />
                                </div>
                            </div>

                            {/* Logs Content */}
                            <div
                                className="logs-container"
                                ref={logsContainerRef}
                                onScroll={handleLogsScroll}
                            >
                                {filteredLogs.length === 0 ? (
                                    <div className="logs-empty">
                                        <ScrollText size={24} />
                                        <p>{logEntries.length === 0 ? 'No logs yet' : 'No matching logs'}</p>
                                        <span>
                                            {logEntries.length === 0
                                                ? "Claude's command outputs will appear here"
                                                : 'Try adjusting your search or filter'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="logs-list">
                                        {filteredLogs.map(entry => (
                                            <div
                                                key={entry.id}
                                                className={`log-entry log-${entry.type}`}
                                            >
                                                <div className="log-meta">
                                                    {getLogIcon(entry.type)}
                                                    {showTimestamps && (
                                                        <span className="log-time">
                                                            {entry.timestamp.toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit'
                                                            })}
                                                        </span>
                                                    )}
                                                    {entry.tool && <span className="log-tool">{entry.tool}</span>}
                                                    <button
                                                        className="log-copy-btn"
                                                        onClick={() => copyLogEntry(entry)}
                                                        title="Copy"
                                                    >
                                                        <Copy size={10} />
                                                    </button>
                                                </div>
                                                <pre className="log-content">{entry.content}</pre>
                                            </div>
                                        ))}
                                        <div ref={logsEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Auto-scroll indicator */}
                            {!autoScroll && filteredLogs.length > 0 && (
                                <button
                                    className="scroll-to-bottom"
                                    onClick={() => {
                                        setAutoScroll(true);
                                        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <ChevronDown size={14} />
                                    New logs
                                </button>
                            )}
                        </div>
                    ) : activeTab === 'tasks' ? (
                        <div className="tasks-panel">
                            {/* Tasks Toolbar */}
                            <div className="tasks-toolbar">
                                <div className="tasks-toolbar-left">
                                    <SearchInput
                                        value={taskSearch}
                                        onChange={setTaskSearch}
                                        placeholder="Search tasks..."
                                        size="sm"
                                    />
                                    <button
                                        className={`filter-btn ${showOnlyActive ? 'active' : ''}`}
                                        onClick={() => setShowOnlyActive(!showOnlyActive)}
                                    >
                                        <Play size={14} />
                                        <span>Active only</span>
                                    </button>
                                </div>
                                <div className="tasks-toolbar-right">
                                    <span className="task-count">
                                        {pendingTasks.length} active / {tasks.length} total
                                    </span>
                                    <IconButton
                                        icon={<Trash2 size={14} />}
                                        label="Clear completed"
                                        onClick={clearTasks}
                                        disabled={tasks.filter(t => t.status === 'completed' || t.status === 'error').length === 0}
                                    />
                                </div>
                            </div>

                            {/* Tasks Content */}
                            <div className="tasks-container">
                                {filteredTasks.length === 0 ? (
                                    <div className="tasks-empty">
                                        <ListTodo size={24} />
                                        <p>{tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}</p>
                                        <span>
                                            {tasks.length === 0
                                                ? "Claude's tool operations will appear here"
                                                : 'Try adjusting your search or filter'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="tasks-list">
                                        {filteredTasks.map(task => (
                                            <div
                                                key={task.id}
                                                className={`task-item task-${task.status}`}
                                            >
                                                {getTaskIcon(task.status)}
                                                <div className="task-info">
                                                    <div className="task-header">
                                                        <span className="task-tool">{task.tool}</span>
                                                        {(task.status === 'completed' || task.status === 'error') && (
                                                            <span className="task-duration">
                                                                <Timer size={10} />
                                                                {getTaskDuration(task)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="task-desc">{task.description}</span>
                                                    {task.error && (
                                                        <span className="task-error">{task.error.slice(0, 100)}</span>
                                                    )}
                                                </div>
                                                <span className="task-time">
                                                    {task.timestamp.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <DiagnosticPanel sessionId={activeSessionId} />
                    )}
                </div>
            )}

            {/* Status Bar */}
            {isExpanded && (
                <div className="footer-status-bar">
                    <div className="status-left">
                        {activeSessionId && (
                            <span className="status-session">
                                Session: {activeSessionId.slice(0, 8)}
                            </span>
                        )}
                    </div>
                    <div className="status-right">
                        {pendingTasks.length > 0 && (
                            <span className="status-pending">
                                <Loader2 size={10} className="spinning" />
                                {pendingTasks.length} running
                            </span>
                        )}
                        {errorCount > 0 && (
                            <span className="status-errors">
                                <AlertCircle size={10} />
                                {errorCount} errors
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
