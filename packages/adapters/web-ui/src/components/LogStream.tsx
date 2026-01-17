import React, { useEffect, useRef } from 'react';
import './LogStream.css';

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
}

interface LogStreamProps {
    logs: LogEntry[];
    title?: string;
    height?: number;
    autoScroll?: boolean;
    onClear?: () => void;
}

export function LogStream({
    logs,
    title = 'System Logs',
    height = 300,
    autoScroll = true,
    onClear
}: LogStreamProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoScroll && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, autoScroll]);

    return (
        <div className="log-stream" style={{ height }}>
            <div className="log-stream-header">
                <span className="log-stream-title">{title}</span>
                <div className="log-stream-actions">
                    {onClear && <button onClick={onClear}>Clear</button>}
                </div>
            </div>
            <div className="log-stream-content" role="log">
                {logs.length === 0 && (
                    <div className="log-entry log-dbg">
                        <span className="log-msg" style={{ opacity: 0.5 }}>Waiting for logs...</span>
                    </div>
                )}
                {logs.map((log) => (
                    <div key={log.id} className="log-entry">
                        <span className="log-time">[{log.timestamp}]</span>
                        <span className={`log-level log-${log.level}`}>{log.level.toUpperCase()}</span>
                        <span className="log-msg">{log.message}</span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
