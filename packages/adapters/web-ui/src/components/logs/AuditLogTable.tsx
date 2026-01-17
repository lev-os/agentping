
import React from 'react';
import { AdvancedDataGrid } from '../data/AdvancedDataGrid';
import './AuditLogTable.css';

interface AuditLogEntry {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    resource: string;
    result: 'success' | 'failure' | 'denied';
    ip: string;
}

interface AuditLogTableProps {
    logs: AuditLogEntry[];
    title?: string;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, title }) => {
    const columns = [
        { key: 'timestamp', label: 'TIMESTAMP', width: '150px', sortable: true },
        { key: 'actor', label: 'ACTOR', width: '100px', sortable: true },
        { key: 'action', label: 'ACTION', width: '120px' },
        { key: 'resource', label: 'RESOURCE', width: '150px' },
        { key: 'result', label: 'RESULT', width: '80px', sortable: true },
        { key: 'ip', label: 'IP ADDRESS', width: '120px' }
    ];

    // Wrap the AdvancedDataGrid but customized for logs (maybe different row styling via CSS)
    return (
        <div className="audit-log-table">
            <AdvancedDataGrid
                columns={columns}
                data={logs}
                title={title || 'AUDIT TRAIL'}
            />
        </div>
    );
};
