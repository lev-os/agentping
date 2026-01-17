import React from 'react';
import './Spinner.css';

interface SpinnerProps {
    size?: number; // size in px
    color?: string;
    variant?: 'ring' | 'dots' | 'pulse';
    className?: string;
}

export function Spinner({
    size = 40,
    color = 'var(--accent-primary)',
    variant = 'ring',
    className = ''
}: SpinnerProps) {
    return (
        <div
            className={`spinner-container spinner-${variant} ${className}`}
            style={{
                width: size,
                height: size,
                '--spinner-color': color,
                '--spinner-size': `${size}px`
            } as React.CSSProperties}
            aria-label="Loading"
        >
            {variant === 'ring' && (
                <>
                    <div className="spinner-ring-bg" />
                    <div className="spinner-ring-fg" />
                </>
            )}

            {variant === 'dots' && (
                <div className="spinner-dots">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            )}

            {variant === 'pulse' && (
                <div className="spinner-pulse" />
            )}
        </div>
    );
}
