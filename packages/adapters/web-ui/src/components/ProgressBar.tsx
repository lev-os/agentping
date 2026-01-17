import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
    value: number; // 0-100
    max?: number;
    showLabel?: boolean;
    color?: string;
    height?: number;
    striped?: boolean;
    animated?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    showLabel = false,
    color,
    height = 8,
    striped = true,
    animated = true,
    className = ''
}: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`progress-container ${className}`}>
            <div
                className={`progress-bar-bg`}
                style={{ height }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                <div
                    className={`progress-fill ${striped ? 'striped' : ''} ${animated ? 'animated' : ''}`}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color ? color : undefined,
                        '--progress-color': color || 'var(--accent-primary)'
                    } as React.CSSProperties}
                />
            </div>
            {showLabel && (
                <div className="progress-label">
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
        </div>
    );
}
