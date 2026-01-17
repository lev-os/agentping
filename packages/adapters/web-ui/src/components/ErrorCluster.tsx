import React from 'react';
import './ErrorCluster.css';

interface ErrorGroup {
    id: string;
    message: string;
    count: number;
    severity: 'high' | 'medium' | 'low';
}

interface ErrorClusterProps {
    errors: ErrorGroup[];
}

export function ErrorCluster({ errors }: ErrorClusterProps) {
    // Sort by count desc
    const sorted = [...errors].sort((a, b) => b.count - a.count);
    const maxCount = sorted[0]?.count || 1;

    return (
        <div className="error-cluster">
            {sorted.map(err => {
                const size = 40 + (err.count / maxCount) * 80; // 40px to 120px
                const color = err.severity === 'high' ? 'var(--accent-error)' :
                    err.severity === 'medium' ? 'var(--accent-warning)' : 'var(--text-secondary)';

                return (
                    <div
                        key={err.id}
                        className="error-bubble"
                        style={{
                            width: size,
                            height: size,
                            borderColor: color,
                            color: color
                        }}
                    >
                        <span className="error-count">{err.count}</span>
                        <div className="error-tooltip">
                            <strong>{err.severity.toUpperCase()}</strong>
                            <p>{err.message}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
