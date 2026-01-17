/**
 * StepChecklist Component
 * 
 * Accessible, keyboard-navigable step checklist with risk badges.
 * - aria-labels for screen readers
 * - role=group for semantics
 * - focus-visible for keyboard users
 * - 44px touch targets on mobile
 */

import type { Step } from '@agentping/core';
import './StepChecklist.css';

interface StepChecklistProps {
    steps: Step[];
    selectedSteps: Set<string>;
    onToggle: (stepId: string) => void;
    groupByRisk?: boolean;
}

export function StepChecklist({ steps, selectedSteps, onToggle, groupByRisk }: StepChecklistProps) {
    const getRiskOrder = (risk: string) => {
        switch (risk) {
            case 'low': return 0;
            case 'medium': return 1;
            case 'high': return 2;
            default: return 3;
        }
    };

    const sortedSteps = groupByRisk
        ? [...steps].sort((a, b) => getRiskOrder(a.risk) - getRiskOrder(b.risk))
        : steps;

    return (
        <div
            className="step-checklist"
            role="group"
            aria-label="Step approval checklist"
        >
            {sortedSteps.map((step) => (
                <div
                    key={step.id}
                    className={`step-item ${selectedSteps.has(step.id) ? 'checked' : ''}`}
                    onClick={() => onToggle(step.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onToggle(step.id);
                        }
                    }}
                    tabIndex={0}
                    role="checkbox"
                    aria-checked={selectedSteps.has(step.id)}
                    aria-label={`${step.description}, ${step.risk} risk${step.reversible ? ', reversible' : ''}`}
                >
                    <input
                        type="checkbox"
                        checked={selectedSteps.has(step.id)}
                        onChange={() => onToggle(step.id)}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                        aria-hidden="true"
                    />
                    <div className="step-content">
                        <div className="step-header">
                            <span className="step-description">{step.description}</span>
                            <span
                                className={`badge badge-${step.risk}`}
                                aria-label={`${step.risk} risk`}
                            >
                                {step.risk}
                            </span>
                            {step.reversible && (
                                <span
                                    className="step-reversible"
                                    title="Reversible"
                                    aria-label="This action is reversible"
                                >
                                    ↩️
                                </span>
                            )}
                        </div>
                        {step.details && (
                            <div className="step-details">{step.details}</div>
                        )}
                        {step.estimatedImpact && (
                            <div className="step-impact">Impact: {step.estimatedImpact}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
