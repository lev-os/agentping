/**
 * LogViewer - Studio adapter shell
 * data-migration-status="needs-review"
 *
 * This component retains local Electron IPC streaming and data management.
 * Rendering is delegated to LogViewerStudioRaw from the migration candidate.
 * Full migration requires evaluating virtualization and ANSI rendering parity.
 *
 * @see packages/ui/src/components/migrations/log-viewer-conflict.tsx
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { LogViewerStudioRaw, type LogEntry } from '@kingly/ui/components';
import { Download, Copy, Search, Scroll, Play, Pause } from 'lucide-react';
import './LogViewer.css';

interface LogLine {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    line: number;
}

interface LogViewerProps {
    dashboardId: string;
    maxLines?: number;
}

function toLogEntry(log: LogLine, index: number): LogEntry {
    return {
        id: `${log.line}-${index}`,
        timestamp: log.timestamp,
        level: log.level,
        message: log.message,
    };
}

export function LogViewer({ dashboardId, maxLines = 500 }: LogViewerProps) {
    const [logs, setLogs] = useState<LogLine[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
    const [isStreaming, setIsStreaming] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredLogs = useMemo(() => {
        if (searchQuery.trim() === '') return logs;
        const query = searchQuery.toLowerCase();
        return logs.filter(log =>
            log.message.toLowerCase().includes(query) ||
            log.level.toLowerCase().includes(query) ||
            log.timestamp.includes(query)
        );
    }, [searchQuery, logs]);

    // Auto-scroll effect
    useEffect(() => {
        if (autoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filteredLogs, autoScroll]);

    // Start log streaming (Electron IPC - local runtime coupling)
    useEffect(() => {
        if (!dashboardId || !window.dashboardManager) return;

        let isMounted = true;
        const dashboardManager = window.dashboardManager;

        const startStream = async () => {
            setIsStreaming(true);
            await dashboardManager.streamLogs({
                dashboardId,
                lines: 100,
                follow: true
            });
        };

        const handleLogLine = (data: { dashboardId: string } & LogLine) => {
            if (data.dashboardId === dashboardId && isMounted) {
                setLogs(prev => {
                    const updated = [...prev, data];
                    return updated.slice(-maxLines);
                });
            }
        };

        const handleStreamEnd = (data: { dashboardId: string; totalLines: number }) => {
            if (data.dashboardId === dashboardId) {
                setIsStreaming(false);
            }
        };

        const handleStreamError = (data: { dashboardId: string; error: string }) => {
            if (data.dashboardId === dashboardId) {
                setIsStreaming(false);
                setLogs(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    level: 'error' as const,
                    message: `Log stream error: ${data.error}`,
                    line: prev.length
                }]);
            }
        };

        const removeLogLineListener = dashboardManager.onLogLine(handleLogLine);
        const removeStreamEndListener = dashboardManager.onLogStreamEnd(handleStreamEnd);
        const removeStreamErrorListener = dashboardManager.onLogStreamError(handleStreamError);

        startStream();

        return () => {
            isMounted = false;
            removeLogLineListener();
            removeStreamEndListener();
            removeStreamErrorListener();

            void dashboardManager.stopStreamLogs({ dashboardId });
        };
    }, [dashboardId, maxLines]);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
        if (!isAtBottom && autoScroll) {
            setAutoScroll(false);
        }
    };

    const handleCopy = () => {
        const logText = filteredLogs.map(log =>
            `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
        ).join('\n');
        navigator.clipboard.writeText(logText);
    };

    const handleDownload = () => {
        const logText = filteredLogs.map(log =>
            `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
        ).join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dashboardId}-logs-${new Date().toISOString().split('T')[0]}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleToggleAutoScroll = () => {
        const next = !autoScroll;
        setAutoScroll(next);
        if (next && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const entries: LogEntry[] = filteredLogs.map(toLogEntry);

    return (
        <div className="log-viewer">
            <div className="log-viewer-header">
                <div className="log-viewer-title">
                    <Scroll size={16} />
                    <span>Logs</span>
                    {isStreaming && <div className="streaming-indicator">LIVE</div>}
                </div>

                <div className="log-viewer-controls">
                    <div className="search-box">
                        <Search size={14} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button
                        className={`control-btn ${autoScroll ? 'active' : ''}`}
                        onClick={handleToggleAutoScroll}
                        title={autoScroll ? 'Pause auto-scroll' : 'Resume auto-scroll'}
                    >
                        {autoScroll ? <Pause size={14} /> : <Play size={14} />}
                        Auto-scroll
                    </button>

                    <button className="control-btn" onClick={handleCopy} title="Copy to clipboard">
                        <Copy size={14} />
                        Copy
                    </button>

                    <button className="control-btn" onClick={handleDownload} title="Download logs">
                        <Download size={14} />
                        Download
                    </button>
                </div>
            </div>

            {/* Delegate rendering to migration candidate */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="log-viewer-content"
            >
                {entries.length === 0 ? (
                    <div className="log-empty">
                        {searchQuery ? 'No logs match your search' : 'No logs available'}
                    </div>
                ) : (
                    <LogViewerStudioRaw entries={entries} maxHeight={undefined} />
                )}
                <div ref={logsEndRef} />
            </div>

            <div className="log-viewer-footer">
                <span className="log-count">
                    {filteredLogs.length} {searchQuery ? `/ ${logs.length}` : ''} lines
                </span>
                {searchQuery && (
                    <button className="clear-search" onClick={() => setSearchQuery('')}>
                        Clear search
                    </button>
                )}
            </div>
        </div>
    );
}
