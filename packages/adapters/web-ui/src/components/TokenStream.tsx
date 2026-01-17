import React, { useState, useEffect } from 'react';
import './TokenStream.css';

interface TokenStreamProps {
    text: string;
    speed?: number; // ms per token
    onComplete?: () => void;
    className?: string;
    autoStart?: boolean;
}

export function TokenStream({
    text,
    speed = 30,
    onComplete,
    className = '',
    autoStart = true
}: TokenStreamProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const [hasStarted, setHasStarted] = useState(autoStart);

    useEffect(() => {
        if (!hasStarted) return;

        let currentIndex = 0;
        setDisplayedText('');
        setIsComplete(false);

        const interval = setInterval(() => {
            if (currentIndex >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
                onComplete?.();
                return;
            }

            // Simulate variable token length (1-4 chars) for realism
            const jump = Math.floor(Math.random() * 3) + 1;
            const nextIndex = Math.min(currentIndex + jump, text.length);

            setDisplayedText(text.substring(0, nextIndex));
            currentIndex = nextIndex;
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, hasStarted, onComplete]);

    return (
        <div
            className={`token-stream ${className} ${isComplete ? 'complete' : 'streaming'}`}
            onClick={() => !hasStarted && setHasStarted(true)}
        >
            {displayedText}
            {!isComplete && hasStarted && <span className="token-cursor" />}
            {!hasStarted && <span className="token-placeholder">Click to generate...</span>}
        </div>
    );
}
