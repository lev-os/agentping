import { useState, useMemo, ReactNode } from 'react';
import './DataTable.css';

export interface DataTableColumn<T> {
    id: keyof T;
    label: string;
    sortable?: boolean;
    format?: (value: any) => ReactNode;
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    pageSize?: number;
    onRowClick?: (row: T) => void;
    className?: string;
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    pageSize = 10,
    onRowClick,
    className = ''
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    // Safe pagination math
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

    const handleSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className={`data-table-container ${className}`} role="grid" aria-label="Data Table">
            <table className="data-table">
                <thead>
                    <tr role="row">
                        {columns.map(col => (
                            <th
                                key={String(col.id)}
                                onClick={() => col.sortable && handleSort(col.id)}
                                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                                role="columnheader"
                                aria-sort={sortConfig?.key === col.id ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                            >
                                {col.label}
                                {sortConfig?.key === col.id && (
                                    <span aria-hidden="true">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, i) => (
                        <tr
                            key={i}
                            onClick={() => onRowClick?.(row)}
                            role="row"
                            tabIndex={onRowClick ? 0 : -1}
                            className={onRowClick ? 'clickable-row' : ''}
                        >
                            {columns.map(col => (
                                <td key={String(col.id)} role="gridcell">
                                    {col.format ? col.format(row[col.id]) : row[col.id]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {paginatedData.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="empty-state">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="data-table-pagination">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous Page"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next Page"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
