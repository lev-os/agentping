/**
 * LoadingProgress - Multi-stage loading indicator
 * Shows 150ms delay before appearing per UI-Skills standard
 */

import { useState, useEffect } from 'react';
import './LoadingProgress.css';

export interface LoadingStage {
    id: string;
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
}

interface LoadingProgressProps {
    stages?: LoadingStage[];
    currentStage?: string;
    progress?: number; // 0-100, for single-bar mode
    message?: string;
    delayMs?: number; // Delay before showing (default 150ms)
    className?: string;
}

export function LoadingProgress({
    stages,
    currentStage,
    progress,
    message,
    delayMs = 150,
    className,
}: LoadingProgressProps) {
    const [visible, setVisible] = useState(false);

    // Delay before showing to prevent flash on fast loads
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delayMs);
        return () => clearTimeout(timer);
    }, [delayMs]);

    if (!visible) return null;

    // Single progress bar mode
    if (typeof progress === 'number' && !stages) {
        return (
            <div className={`loading-progress loading-simple ${className || ''}`} role="status">
                <div className="loading-bar-container">
                    <div
                        className="loading-bar"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </div>
                {message && <p className="loading-message">{message}</p>}
            </div>
        );
    }

    // Multi-stage mode
    if (stages && stages.length > 0) {
        // Determine active index logic
        let activeIdx = -1;
        if (currentStage) {
            const found = stages.findIndex(s => s.id === currentStage);
            if (found !== -1) activeIdx = found;
        }
        if (activeIdx === -1) {
            // Fallback to searching by status 'active'
            activeIdx = stages.findIndex(s => s.status === 'active');
        }

        return (
            <div className={`loading-progress loading-stages ${className || ''}`} role="status">
                <div className="loading-stages-list">
                    {stages.map((stage, idx) => {
                        let status = stage.status;

                        // Derived status logic for better visuals
                        if (activeIdx !== -1) {
                            if (idx < activeIdx) status = 'complete';
                            else if (idx === activeIdx) status = status === 'error' ? 'error' : 'active';
                            else status = 'pending';
                        }

                        // Override specific id match
                        if (currentStage && stage.id === currentStage) {
                            status = status === 'error' ? 'error' : 'active';
                        }

                        return (
                            <div key={stage.id} className={`loading-stage loading-stage-${status}`}>
                                <div className="loading-stage-indicator">
                                    <div className="stage-dot">
                                        {status === 'complete' ? '✓' :
                                            status === 'active' ? <span className="loading-spinner" style={{ width: 8, height: 8 }} /> :
                                                status === 'error' ? '!' : ''}
                                    </div>
                                    <div className="stage-connector" />
                                </div>
                                <div className="loading-stage-content">
                                    <span className={`loading-stage-label ${status === 'active' ? 'font-bold' : ''}`}>{stage.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {message && <p className="loading-message" style={{ marginTop: 16 }}>{message}</p>}
            </div>
        );
    }

    // Indeterminate spinner
    return (
        <div className={`loading-progress loading-indeterminate ${className || ''}`} role="status">
            <div className="loading-spinner-large" aria-label="Loading" />
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}
