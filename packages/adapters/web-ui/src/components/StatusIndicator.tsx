import React from 'react';
import './StatusIndicator.css';

export type StatusType = 'online' | 'offline' | 'busy' | 'away' | 'connecting';

interface StatusIndicatorProps {
    status: StatusType;
    label?: string;
    showLabel?: boolean;
    pulsing?: boolean;
    className?: string;
}

export function StatusIndicator({
    status,
    label,
    showLabel = true,
    pulsing = true,
    className = ''
}: StatusIndicatorProps) {

    const getStatusLabel = () => {
        if (label) return label;
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <div className={`status-indicator status-${status} ${className}`}>
            <div className={`status-led ${pulsing ? 'pulsing' : ''}`} />
            {showLabel && <span className="status-label">{getStatusLabel()}</span>}
        </div>
    );
}
