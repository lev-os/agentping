import React from 'react';
import './Stepper.css';

interface Step {
    id: string;
    label: string;
    description?: string;
    status: 'pending' | 'current' | 'completed' | 'error';
}

interface StepperProps {
    steps: Step[];
    currentStepId?: string;
    orientation?: 'horizontal' | 'vertical';
    onStepClick?: (stepId: string) => void;
}

export function Stepper({ steps, currentStepId, orientation = 'horizontal', onStepClick }: StepperProps) {
    const currentIndex = steps.findIndex(s => s.id === currentStepId);

    return (
        <div className={`stepper-container ${orientation}`} role="progressbar" aria-label="Progress Steps">
            {steps.map((step, index) => {
                const isCompleted = step.status === 'completed' || index < currentIndex;
                const isCurrent = step.id === currentStepId || step.status === 'current';
                const isError = step.status === 'error';
                const isActive = isCurrent || isCompleted;

                return (
                    <div
                        key={step.id}
                        className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isError ? 'error' : ''} ${isActive ? 'active' : ''}`}
                        onClick={() => onStepClick?.(step.id)}
                    >
                        <div className="step-card">
                            <div className="step-marker">
                                {isCompleted ? '✓' : isError ? '!' : (index + 1)}
                            </div>
                            <div className="step-content">
                                <div className="step-label">{step.label}</div>
                                {step.description && <div className="step-description">{step.description}</div>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
