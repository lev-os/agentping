
import React, { useState } from 'react';
import './BuildStatusLogs.css';

interface BuildStep {
    name: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    duration?: string;
    logs: string[];
}

interface BuildStatusProps {
    buildId: string;
    steps: BuildStep[];
    title?: string;
}

export const BuildStatusLogs: React.FC<BuildStatusProps> = ({ buildId, steps, title }) => {
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    const toggleStep = (index: number) => {
        setExpandedStep(expandedStep === index ? null : index);
    };

    return (
        <div className="build-status-logs">
            <div className="build-header">
                <h3 className="build-title">{title || `BUILD #${buildId}`}</h3>
                <div className="build-status-summary">
                    {steps.filter(s => s.status === 'success').length} / {steps.length} PASSED
                </div>
            </div>
            <div className="build-steps">
                {steps.map((step, index) => (
                    <div key={index} className={`build-step ${step.status} ${expandedStep === index ? 'expanded' : ''}`}>
                        <div className="step-header" onClick={() => toggleStep(index)}>
                            <span className="step-icon">
                                {step.status === 'success' && '✓'}
                                {step.status === 'failed' && '✕'}
                                {step.status === 'running' && '⟳'}
                                {step.status === 'pending' && '⋯'}
                            </span>
                            <span className="step-name">{step.name}</span>
                            <span className="step-duration">{step.duration}</span>
                            <span className="step-toggle">{expandedStep === index ? '▼' : '▶'}</span>
                        </div>
                        {expandedStep === index && (
                            <div className="step-logs">
                                {step.logs.map((log, logIndex) => (
                                    <div key={logIndex} className="log-line">{log}</div>
                                ))}
                                {step.logs.length === 0 && <div className="no-logs">No logs available</div>}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
