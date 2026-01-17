import React from 'react';
import './ConnectionSignal.css';

interface ConnectionSignalProps {
    strength: number; // 0-4
    maxBars?: number;
    className?: string;
    showLabel?: boolean;
}

export function ConnectionSignal({
    strength,
    maxBars = 4,
    className = '',
    showLabel = false
}: ConnectionSignalProps) {
    return (
        <div className={`connection-signal ${className}`} title={`Signal Strength: ${strength}/${maxBars}`}>
            <div className="signal-bars">
                {Array.from({ length: maxBars }).map((_, i) => (
                    <div
                        key={i}
                        className={`signal-bar ${i < strength ? 'active' : ''}`}
                        style={{ height: `${(i + 1) * 20 + 20}%` }}
                    />
                ))}
            </div>
            {showLabel && <span className="signal-label">{strength === 0 ? 'No Signal' : strength === maxBars ? 'Excellent' : 'Weak'}</span>}
        </div>
    );
}
