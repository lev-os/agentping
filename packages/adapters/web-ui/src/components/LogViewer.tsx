/**
 * LogViewer - Web-UI adapter shell
 * data-migration-status="needs-review"
 *
 * Rendering delegated to LogViewerWebUiRaw from migration candidate.
 * Local search/filter logic retained as adapter layer.
 *
 * @see packages/ui/src/components/migrations/log-viewer-conflict.tsx
 */
import { useState, useMemo } from 'react';
import { LogViewerWebUiRaw, type LogEntry } from '@kingly/ui/components';
import './LogViewer.css';

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
            <LogViewerWebUiRaw entries={filteredLogs} />
            {filteredLogs.length === 0 && (
                <div className="log-empty">No logs found</div>
            )}
        </div>
    );
}
