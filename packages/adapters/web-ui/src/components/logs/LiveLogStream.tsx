
import React, { useEffect, useRef, useState } from 'react';
import './LiveLogStream.css';

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    source?: string;
}

interface LiveLogStreamProps {
    initialLogs?: LogEntry[];
    title?: string;
    isPaused?: boolean;
}

export const LiveLogStream: React.FC<LiveLogStreamProps> = ({ initialLogs = [], title, isPaused = false }) => {
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    // Simulate live logs if none provided or for demo
    useEffect(() => {
        if (isPaused) return;

        // Only simulate if using dummy data
        if (initialLogs.length > 0 && logs.length > 50) return;

        const interval = setInterval(() => {
            const levels: ('info' | 'warn' | 'error' | 'debug')[] = ['info', 'info', 'info', 'debug', 'warn', 'error'];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const sources = ['auth-service', 'db-shard-01', 'api-gateway', 'worker-queue'];
            const messages = [
                'Processing request payload...',
                'Cache miss for key user:123',
                'Connection established',
                'Heartbeat received',
                'Transaction committed',
                'Retrying operation (attempt 2/3)',
                'Failed to connect to upstream'
            ];

            const newLog: LogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
                level,
                source: sources[Math.floor(Math.random() * sources.length)],
                message: messages[Math.floor(Math.random() * messages.length)]
            };

            setLogs(prev => [...prev.slice(-200), newLog]);
        }, 2000);

        return () => clearInterval(interval);
    }, [isPaused, initialLogs]);

    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    return (
        <div className="live-log-stream">
            <div className="log-header">
                <h3 className="log-title">{title || 'LIVE LOGS'}</h3>
                <div className="log-controls">
                    <span className={`status-indicator ${isPaused ? 'paused' : 'live'}`}>
                        {isPaused ? 'PAUSED' : 'LIVE'}
                    </span>
                    <label className="autoscroll-label">
                        <input
                            type="checkbox"
                            checked={autoScroll}
                            onChange={(e) => setAutoScroll(e.target.checked)}
                        />
                        AUTO-SCROLL
                    </label>
                </div>
            </div>
            <div className="log-container" ref={scrollRef}>
                {logs.map((log) => (
                    <div key={log.id} className={`log-entry ${log.level}`}>
                        <span className="log-time">{log.timestamp}</span>
                        <span className={`log-level ${log.level}`}>{log.level.toUpperCase()}</span>
                        {log.source && <span className="log-source">[{log.source}]</span>}
                        <span className="log-message">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
