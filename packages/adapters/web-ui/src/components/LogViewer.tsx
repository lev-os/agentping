import { useState, useMemo } from 'react';
import './LogViewer.css';

interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
}

interface LogViewerProps {
    logs: LogEntry[];
    allowSearch?: boolean;
}

export function LogViewer({ logs, allowSearch = true }: LogViewerProps) {
    const [search, setSearch] = useState('');

    const filteredLogs = useMemo(() => {
        if (!search) return logs;
        const lowerSearch = search.toLowerCase();
        return logs.filter(log =>
            log.message.toLowerCase().includes(lowerSearch) ||
            log.level.toLowerCase().includes(lowerSearch)
        );
    }, [logs, search]);

    return (
        <div className="log-viewer" role="log" aria-label="System Logs">
            {allowSearch && (
                <div className="log-toolbar">
                    <input
                        type="text"
                        className="log-search"
                        placeholder="Search logs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Filter logs"
                    />
                </div>
            )}
            <div className="log-content">
                {filteredLogs.map(log => (
                    <div key={log.id} className="log-line">
                        <span className="log-timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`log-level-${log.level}`} style={{ marginRight: '8px', fontWeight: 'bold' }}>
                            [{log.level.toUpperCase()}]
                        </span>
                        <span>{log.message}</span>
                    </div>
                ))}
                {filteredLogs.length === 0 && (
                    <div className="log-empty">No logs found</div>
                )}
            </div>
        </div>
    );
}
