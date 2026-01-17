import React from 'react';
import './SystemHealthGauge.css';

interface SystemHealthGaugeProps {
    score: number; // 0-100
    label?: string;
    sublabel?: string;
    size?: number;
}

export function SystemHealthGauge({ score, label = "System Health", sublabel, size = 200 }: SystemHealthGaugeProps) {
    const radius = size * 0.4;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    // Determine color based on score
    let color = 'var(--accent-success)';
    if (score < 40) color = 'var(--accent-error)';
    else if (score < 70) color = 'var(--accent-warning)';

    return (
        <div className="system-health-gauge" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Ring */}
                <circle
                    className="gauge-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={size * 0.08}
                />

                {/* Progress Ring */}
                <circle
                    className="gauge-progress"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={size * 0.08}
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />

                {/* Center Text */}
                <text x="50%" y="45%" textAnchor="middle" className="gauge-score" fill={color} fontSize={size * 0.25} fontWeight="bold">
                    {score}%
                </text>
                <text x="50%" y="65%" textAnchor="middle" className="gauge-label" fill="var(--text-secondary)" fontSize={size * 0.08}>
                    {label}
                </text>
                {sublabel && (
                    <text x="50%" y="75%" textAnchor="middle" className="gauge-sublabel" fill="var(--text-muted)" fontSize={size * 0.06}>
                        {sublabel}
                    </text>
                )}
            </svg>
        </div>
    );
}
