import React from 'react';
import './ConfidenceMeter.css';

interface ConfidenceMeterProps {
    score: number; // 0-1
    label?: string;
    threshold?: number; // point where it becomes "good"
    className?: string;
}

export function ConfidenceMeter({
    score,
    label = 'Confidence',
    threshold = 0.7,
    className = ''
}: ConfidenceMeterProps) {
    const percentage = Math.round(score * 100);
    const isHigh = score >= threshold;
    const isLow = score < 0.4;

    let statusClass = 'medium';
    if (isHigh) statusClass = 'high';
    if (isLow) statusClass = 'low';

    return (
        <div className={`confidence-meter ${statusClass} ${className}`}>
            <div className="confidence-header">
                <span className="confidence-label">{label}</span>
                <span className="confidence-value">{percentage}%</span>
            </div>
            <div className="confidence-track">
                <div
                    className="confidence-bar"
                    style={{ width: `${percentage}%` }}
                />
                <div
                    className="confidence-marker"
                    style={{ left: `${threshold * 100}%` }}
                    title={`Threshold: ${threshold * 100}%`}
                />
            </div>
        </div>
    );
}
