
import React, { useState } from 'react';
import './CsvPreview.css';

interface CsvPreviewProps {
    csvData: string;
    title?: string;
    delimiter?: string;
}

export const CsvPreview: React.FC<CsvPreviewProps> = ({ csvData, title, delimiter = ',' }) => {
    const [viewMode, setViewMode] = useState<'table' | 'raw'>('table');

    const parseCsv = (data: string) => {
        const lines = data.trim().split('\n');
        if (lines.length === 0) return { headers: [], rows: [] };

        const headers = lines[0].split(delimiter).map(h => h.trim());
        const rows = lines.slice(1).map(line => line.split(delimiter).map(cell => cell.trim()));
        return { headers, rows };
    };

    const { headers, rows } = parseCsv(csvData);

    return (
        <div className="csv-preview">
            <div className="csv-header">
                <h3 className="csv-title">{title || 'CSV PREVIEW'}</h3>
                <div className="csv-controls">
                    <div className="csv-info">
                        {rows.length} ROWS • {headers.length} COLS
                    </div>
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            TABLE
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'raw' ? 'active' : ''}`}
                            onClick={() => setViewMode('raw')}
                        >
                            RAW
                        </button>
                    </div>
                </div>
            </div>

            <div className="csv-content">
                {viewMode === 'raw' ? (
                    <pre className="csv-raw-view">{csvData}</pre>
                ) : (
                    <div className="csv-table-wrapper">
                        <table className="csv-table">
                            <thead>
                                <tr>
                                    {headers.map((header, i) => (
                                        <th key={i}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
