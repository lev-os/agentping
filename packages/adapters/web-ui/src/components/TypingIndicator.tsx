import React from 'react';
import './TypingIndicator.css';

interface TypingIndicatorProps {
    className?: string;
}

export function TypingIndicator({ className = '' }: TypingIndicatorProps) {
    return (
        <div className={`typing-indicator ${className}`}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
        </div>
    );
}
