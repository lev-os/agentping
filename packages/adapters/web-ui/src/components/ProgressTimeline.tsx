/**
 * ProgressTimeline - Vertical timeline of completed, current, and upcoming steps
 */

import './ProgressTimeline.css';

export interface TimelineStep {
    id: string;
    label: string;
    description?: string;
    timestamp?: string;
    status?: 'complete' | 'current' | 'pending' | 'error';
}

interface ProgressTimelineProps {
    steps: TimelineStep[];
    currentIndex?: number;
    className?: string;
}

export function ProgressTimeline({ steps, currentIndex, className = '' }: ProgressTimelineProps) {
    const getStepStatus = (index: number, step: TimelineStep) => {
        if (step.status) return step.status;
        if (currentIndex === undefined) return 'pending';
        if (index < currentIndex) return 'complete';
        if (index === currentIndex) return 'current';
        return 'pending';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'complete': return '✓';
            case 'current': return '●';
            case 'error': return '✗';
            default: return '○';
        }
    };

    return (
        <div className={`progress-timeline ${className}`} role="list" aria-label="Progress timeline">
            {steps.map((step, index) => {
                const status = getStepStatus(index, step);
                const isLast = index === steps.length - 1;

                return (
                    <div
                        key={step.id}
                        className={`timeline-item timeline-${status}`}
                        role="listitem"
                        aria-current={status === 'current' ? 'step' : undefined}
                    >
                        <div className="timeline-marker" aria-hidden="true">
                            <span className="timeline-icon">{getStatusIcon(status)}</span>
                            {!isLast && <div className="timeline-line" />}
                        </div>
                        <div className="timeline-content">
                            <div className="timeline-label">{step.label}</div>
                            {step.description && (
                                <div className="timeline-description">{step.description}</div>
                            )}
                            {step.timestamp && (
                                <div className="timeline-timestamp">{step.timestamp}</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
