import React from 'react';
import './DiffStatSummary.css';

interface DiffStatSummaryProps {
    added: number;
    removed: number;
    modified: number;
    files: number;
}

export function DiffStatSummary({ added, removed, modified, files }: DiffStatSummaryProps) {
    const totalLines = added + removed + modified;

    return (
        <div className="diff-stat-summary">
            <div className="diff-stat-item">
                <span className="stat-val">{files}</span>
                <span className="stat-label">Files Changed</span>
            </div>
            <div className="diff-stat-divider" />
            <div className="diff-stat-chart">
                <div className="stat-bar-group">
                    <div
                        className="stat-bar added"
                        style={{ flex: added }}
                        title={`Added: ${added}`}
                    />
                    <div
                        className="stat-bar modified"
                        style={{ flex: modified }}
                        title={`Modified: ${modified}`}
                    />
                    <div
                        className="stat-bar removed"
                        style={{ flex: removed }}
                        title={`Removed: ${removed}`}
                    />
                </div>
                <div className="stat-legend">
                    <span className="legend-item added">+{added}</span>
                    <span className="legend-item modified">~{modified}</span>
                    <span className="legend-item removed">-{removed}</span>
                </div>
            </div>
            <div className="diff-stat-total">
                <strong>{totalLines}</strong> lines
            </div>
        </div>
    );
}
