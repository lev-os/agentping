import React from 'react';
import './StepTracker.css';

interface StepTrackerProps {
    steps: number; // Total step count
    currentStep: number; // 1-indexed
    className?: string;
}

export function StepTracker({ steps, currentStep, className = '' }: StepTrackerProps) {
    return (
        <div className={`step-tracker ${className}`}>
            {Array.from({ length: steps }).map((_, i) => {
                const stepNum = i + 1;
                const isActive = stepNum <= currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                    <div
                        key={i}
                        className={`tracker-pip ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                    />
                );
            })}
        </div>
    );
}
