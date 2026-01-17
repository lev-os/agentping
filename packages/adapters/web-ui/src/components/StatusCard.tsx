/**
 * StatusCard - Compact metrics dashboard
 * Shows progress, health, ETA, and custom metrics
 */

import './StatusCard.css';

export interface StatusMetric {
    label: string;
    value: string | number;
    icon?: string;
}

interface StatusCardProps {
    title: string;
    progress?: number; // 0-100
    status: 'idle' | 'running' | 'success' | 'error' | 'warning';
    eta?: string;
    metrics?: StatusMetric[];
    className?: string;
}

export function StatusCard({
    title,
    progress,
    status,
    eta,
    metrics,
    className = '',
}: StatusCardProps) {
    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'status-success';
            case 'error': return 'status-error';
            case 'warning': return 'status-warning';
            case 'running': return 'status-running';
            default: return 'status-idle';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'warning': return '⚠';
            case 'running': return '●';
            default: return '○';
        }
    };

    return (
        <div
            className={`status-card ${className}`}
            role="status"
            aria-live="polite"
            aria-label={`${title}: ${status}`}
        >
            <div className="status-card-header">
                <span className={`status-indicator ${getStatusColor()}`} aria-hidden="true">
                    {getStatusIcon()}
                </span>
                <h4 className="status-card-title">{title}</h4>
                {eta && <span className="status-eta">ETA: {eta}</span>}
            </div>

            {typeof progress === 'number' && (
                <div className="status-progress-container">
                    <div
                        className={`status-progress-bar ${getStatusColor()}`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Progress"
                    />
                    <span className="status-progress-label" aria-hidden="true">
                        {Math.round(progress)}%
                    </span>
                </div>
            )}

            {metrics && metrics.length > 0 && (
                <div className="status-metrics">
                    {metrics.map((m, i) => (
                        <div key={i} className="status-metric">
                            {m.icon && <span className="status-metric-icon" aria-hidden="true">{m.icon}</span>}
                            <span className="status-metric-value">{m.value}</span>
                            <span className="status-metric-label">{m.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
