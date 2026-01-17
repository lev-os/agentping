
import React from 'react';
import { AdvancedDataGrid } from './AdvancedDataGrid';
import './SqlResultTable.css';

interface SqlResultProps {
    query: string;
    executionTimeMs: number;
    status: 'success' | 'error';
    columns: { key: string; label: string }[];
    data: any[];
    error?: string;
}

export const SqlResultTable: React.FC<SqlResultProps> = ({
    query,
    executionTimeMs,
    status,
    columns,
    data,
    error,
}) => {
    return (
        <div className="sql-result-table">
            <div className="sql-header">
                <div className="sql-query-section">
                    <div className="sql-label">QUERY</div>
                    <code className="sql-code">{query}</code>
                </div>
                <div className="sql-meta">
                    <div className={`sql-status ${status}`}>
                        {status.toUpperCase()}
                    </div>
                    <div className="sql-time">{executionTimeMs}ms</div>
                </div>
            </div>

            {status === 'error' ? (
                <div className="sql-error-message">
                    <span className="error-icon">⚠</span>
                    {error}
                </div>
            ) : (
                <div className="sql-grid-wrapper">
                    <AdvancedDataGrid
                        columns={columns}
                        data={data}
                        title="RESULT SET"
                    />
                </div>
            )}
        </div>
    );
};
