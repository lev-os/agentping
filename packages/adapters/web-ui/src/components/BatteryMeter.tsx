import React from 'react';
import './BatteryMeter.css';

interface BatteryMeterProps {
    level: number; // 0-100
    charging?: boolean;
    showLabel?: boolean;
    className?: string;
}

export function BatteryMeter({
    level,
    charging = false,
    showLabel = false,
    className = ''
}: BatteryMeterProps) {
    const getStatusColor = () => {
        if (charging) return 'var(--accent-success)';
        if (level < 20) return 'var(--accent-error)';
        if (level < 50) return 'var(--accent-warning)';
        return 'var(--accent-primary)';
    };

    return (
        <div className={`battery-meter ${className} ${charging ? 'charging' : ''}`}>
            <div className="battery-body">
                <div
                    className="battery-fill"
                    style={{
                        width: `${Math.min(100, Math.max(0, level))}%`,
                        backgroundColor: getStatusColor()
                    }}
                />
                {charging && <div className="battery-bolt">⚡</div>}
            </div>
            <div className="battery-cap" />
            {showLabel && <span className="battery-label">{level}%</span>}
        </div>
    );
}
