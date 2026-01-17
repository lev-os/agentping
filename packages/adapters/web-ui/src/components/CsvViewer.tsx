import React, { useState } from 'react';
import './CsvViewer.css';

interface CsvViewerProps {
    data: string; // Raw CSV string
    hasHeader?: boolean;
    className?: string;
}

export function CsvViewer({ data, hasHeader = true, className }: CsvViewerProps) {
    const rows = data.trim().split('\n').map(r => r.split(','));
    const header = hasHeader ? rows[0] : null;
    const body = hasHeader ? rows.slice(1) : rows;

    const [sortCol, setSortCol] = useState<number | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const sortedBody = [...body].sort((a, b) => {
        if (sortCol === null) return 0;
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    const handleSort = (index: number) => {
        if (sortCol === index) {
            setSortAsc(!sortAsc);
        } else {
            setSortCol(index);
            setSortAsc(true);
        }
    };

    return (
        <div className={`csv-viewer ${className || ''}`}>
            <div className="csv-table-container">
                <table className="csv-table">
                    {header && (
                        <thead>
                            <tr>
                                {header.map((col, i) => (
                                    <th key={i} onClick={() => handleSort(i)}>
                                        {col} {sortCol === i ? (sortAsc ? '↑' : '↓') : ''}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {sortedBody.map((row, i) => (
                            <tr key={i}>
                                {row.map((cell, j) => (
                                    <td key={j} title={cell}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="csv-footer">
                {body.length} rows, {header?.length || body[0]?.length} columns
            </div>
        </div>
    );
}
