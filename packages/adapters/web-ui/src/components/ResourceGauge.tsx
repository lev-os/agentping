import React from 'react';
import './ResourceGauge.css';

interface ResourceGaugeProps {
    value: number; // 0-100
    label: string;
    color?: string;
    size?: number;
}

export function ResourceGauge({
    value,
    label,
    color = 'var(--accent-primary)',
    size = 120
}: ResourceGaugeProps) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="resource-gauge">
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                className="gauge-svg"
            >
                <circle
                    className="gauge-circle-bg"
                    cx="50"
                    cy="50"
                    r={radius}
                />
                <circle
                    className="gauge-circle-fg"
                    cx="50"
                    cy="50"
                    r={radius}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        stroke: color
                    }}
                />
            </svg>
            <div className="gauge-value">
                <span
                    className="gauge-number"
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    {Math.round(value)}%
                </span>
                <span className="gauge-label">{label}</span>
            </div>
        </div>
    );
}
