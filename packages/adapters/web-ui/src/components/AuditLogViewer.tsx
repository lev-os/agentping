import React from 'react';
import './AuditLogViewer.css';

interface AuditEntry {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    resource: string;
    outcome: 'success' | 'failure';
}

interface AuditLogViewerProps {
    logs: AuditEntry[];
}

export function AuditLogViewer({ logs }: AuditLogViewerProps) {
    return (
        <div className="audit-log-viewer">
            <div className="audit-header">
                <span>Time</span>
                <span>Actor</span>
                <span>Action</span>
                <span>Resource</span>
            </div>
            <div className="audit-body">
                {logs.map(log => (
                    <div key={log.id} className={`audit-row ${log.outcome}`}>
                        <span className="audit-cell mono time">{log.timestamp}</span>
                        <span className="audit-cell user">{log.actor}</span>
                        <span className="audit-cell action">{log.action}</span>
                        <span className="audit-cell resource">{log.resource}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
