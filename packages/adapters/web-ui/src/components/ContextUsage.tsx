import React from 'react';
import './ContextUsage.css';

interface ContextUsageProps {
    used: number;
    total: number;
    label?: string;
    className?: string;
}

export function ContextUsage({
    used,
    total,
    label = 'Context Window',
    className = ''
}: ContextUsageProps) {
    const percentage = Math.min(100, Math.max(0, (used / total) * 100));
    const isCritical = percentage > 90;
    const isWarning = percentage > 75;

    return (
        <div className={`context-usage ${className}`}>
            <div className="context-header">
                <span className="context-label">{label}</span>
                <span className="context-stats">
                    <span className={`usage-val ${isCritical ? 'critical' : ''}`}>{used.toLocaleString()}</span>
                    <span className="separator">/</span>
                    <span className="total-val">{total.toLocaleString()}</span>
                    <span className="unit">tk</span>
                </span>
            </div>
            <div className="context-bar-bg">
                <div
                    className={`context-bar-fill ${isCritical ? 'critical' : isWarning ? 'warning' : ''}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
