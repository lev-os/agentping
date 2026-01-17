import React from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorBoundary({
    title = 'System Malfunction',
    message = 'An unexpected error has occurred.',
    onRetry,
    className = ''
}: ErrorBoundaryProps) {
    return (
        <div className={`error-boundary ${className}`}>
            <div className="error-glitch-layer" aria-hidden="true">{title}</div>
            <div className="error-content">
                <div className="error-icon">⚠</div>
                <h3 className="error-title">{title}</h3>
                <p className="error-message">{message}</p>
                {onRetry && (
                    <button className="error-retry-btn" onClick={onRetry}>
                        Init Retry Sequence
                    </button>
                )}
            </div>
        </div>
    );
}
