
import React, { useState } from 'react';
import './AdvancedDataGrid.css';

interface Column {
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
}

interface DataGridProps {
    columns: Column[];
    data: any[];
    title?: string;
}

export const AdvancedDataGrid: React.FC<DataGridProps> = ({ columns, data, title }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filterText, setFilterText] = useState('');

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const filteredData = sortedData.filter((item) =>
        columns.some((col) =>
            String(item[col.key]).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    return (
        <div className="advanced-data-grid">
            <div className="grid-header">
                <h3 className="grid-title">{title || 'DATA GRID'}</h3>
                <div className="grid-controls">
                    <input
                        type="text"
                        placeholder="FILTER_DATA..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="filter-input"
                    />
                    <span className="row-count">{filteredData.length} ROWS</span>
                </div>
            </div>
            <div className="grid-container">
                <table>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    className={col.sortable ? 'sortable' : ''}
                                >
                                    {col.label}
                                    {sortConfig?.key === col.key && (
                                        <span className="sort-indicator">
                                            {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={`${index}-${col.key}`}>{row[col.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
