import React from 'react';
import './LiveBadge.css';

interface LiveBadgeProps {
    label?: string;
    pulsing?: boolean;
    className?: string;
}

export function LiveBadge({ label = 'LIVE', pulsing = true, className = '' }: LiveBadgeProps) {
    return (
        <div className={`live-badge ${pulsing ? 'pulsing' : ''} ${className}`}>
            <div className="live-dot" />
            <span className="live-text">{label}</span>
        </div>
    );
}
