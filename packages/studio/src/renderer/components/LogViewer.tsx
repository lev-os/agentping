import { useState, useEffect, useRef } from 'react';
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

export function LogViewer({ dashboardId, maxLines = 500 }: LogViewerProps) {
    const [logs, setLogs] = useState<LogLine[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<LogLine[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
    const [isStreaming, setIsStreaming] = useState(false);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll effect
    useEffect(() => {
        if (autoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filteredLogs, autoScroll]);

    // Filter logs based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredLogs(logs);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredLogs(logs.filter(log =>
                log.message.toLowerCase().includes(query) ||
                log.level.toLowerCase().includes(query) ||
                log.timestamp.includes(query)
            ));
        }
    }, [searchQuery, logs]);

    // Start log streaming
    useEffect(() => {
        if (!dashboardId || !window.electron) return;

        let isMounted = true;

        const startStream = async () => {
            setIsStreaming(true);
            console.log('[LogViewer] Starting stream for:', dashboardId);

            // Start streaming
            await window.electron.invoke('dashboard:stream-logs', {
                dashboardId,
                lines: 100,
                follow: true
            });
        };

        // Listen for log lines
        const handleLogLine = (data: { dashboardId: string } & LogLine) => {
            if (data.dashboardId === dashboardId && isMounted) {
                setLogs(prev => {
                    const updated = [...prev, data];
                    // Keep only last maxLines
                    return updated.slice(-maxLines);
                });
            }
        };

        const handleStreamEnd = (data: { dashboardId: string; totalLines: number }) => {
            if (data.dashboardId === dashboardId) {
                console.log('[LogViewer] Stream ended:', data.totalLines, 'lines');
                setIsStreaming(false);
            }
        };

        const handleStreamError = (data: { dashboardId: string; error: string }) => {
            if (data.dashboardId === dashboardId) {
                console.error('[LogViewer] Stream error:', data.error);
                setIsStreaming(false);
                // Show error in logs
                setLogs(prev => [...prev, {
                    timestamp: new Date().toISOString(),
                    level: 'error',
                    message: `Log stream error: ${data.error}`,
                    line: prev.length
                }]);
            }
        };

        window.electron.on('dashboard:log-line', handleLogLine);
        window.electron.on('dashboard:log-stream-end', handleStreamEnd);
        window.electron.on('dashboard:log-stream-error', handleStreamError);

        startStream();

        return () => {
            isMounted = false;
            window.electron.removeListener('dashboard:log-line', handleLogLine);
            window.electron.removeListener('dashboard:log-stream-end', handleStreamEnd);
            window.electron.removeListener('dashboard:log-stream-error', handleStreamError);

            // Stop streaming
            if (window.electron) {
                window.electron.invoke('dashboard:stop-stream-logs', { dashboardId });
            }
        };
    }, [dashboardId, maxLines]);

    // Handle manual scroll - disable auto-scroll if user scrolls up
    const handleScroll = () => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;

        if (!isAtBottom && autoScroll) {
            setAutoScroll(false);
        }
    };

    // Copy logs to clipboard
    const handleCopy = () => {
        const logText = filteredLogs.map(log =>
            `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
        ).join('\n');

        navigator.clipboard.writeText(logText).then(() => {
            console.log('[LogViewer] Copied', filteredLogs.length, 'lines to clipboard');
        });
    };

    // Download logs as file
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

    // Toggle auto-scroll and scroll to bottom
    const handleToggleAutoScroll = () => {
        const newAutoScroll = !autoScroll;
        setAutoScroll(newAutoScroll);

        if (newAutoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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

            <div
                ref={containerRef}
                className="log-viewer-content"
                onScroll={handleScroll}
            >
                {filteredLogs.length === 0 ? (
                    <div className="log-empty">
                        {searchQuery ? 'No logs match your search' : 'No logs available'}
                    </div>
                ) : (
                    filteredLogs.map((log, index) => (
                        <div key={`${log.line}-${index}`} className={`log-line log-${log.level}`}>
                            <span className="log-timestamp">[{log.timestamp}]</span>
                            <span className={`log-level level-${log.level}`}>{log.level.toUpperCase()}</span>
                            <span className="log-message" dangerouslySetInnerHTML={{ __html: log.message }} />
                        </div>
                    ))
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
