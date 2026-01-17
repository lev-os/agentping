/**
 * TaskWorkflow - Floating panel for multi-step human task workflows
 * AI sends steps, human completes them
 */

import { useState, useCallback } from 'react';
import './TaskWorkflow.css';

interface TaskStep {
    id: string;
    instruction: string;
    details?: string;
    estimatedMinutes?: number;
}

interface TaskWorkflowProps {
    title: string;
    description?: string;
    steps: TaskStep[];
    allowNotes: boolean;
    onComplete: (completedSteps: string[], notes: Record<string, string>) => void;
    onDismiss?: () => void;
}

export function TaskWorkflow({
    title,
    description,
    steps,
    allowNotes,
    onComplete,
    onDismiss,
}: TaskWorkflowProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [currentNote, setCurrentNote] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;
    const allComplete = completedSteps.size === steps.length;

    const handleDone = useCallback(() => {
        // Mark current step as complete
        const newCompleted = new Set(completedSteps);
        newCompleted.add(currentStep.id);
        setCompletedSteps(newCompleted);

        // Save note if any
        if (currentNote.trim()) {
            setNotes(prev => ({ ...prev, [currentStep.id]: currentNote.trim() }));
        }
        setCurrentNote('');

        // Advance or finish
        if (isLastStep) {
            // All done!
            const finalNotes = currentNote.trim()
                ? { ...notes, [currentStep.id]: currentNote.trim() }
                : notes;
            onComplete(
                Array.from(newCompleted),
                finalNotes
            );
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [currentStep, currentNote, completedSteps, notes, isLastStep, onComplete]);

    const handlePrevious = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
            setCurrentNote(notes[steps[currentStepIndex - 1].id] || '');
        }
    }, [currentStepIndex, notes, steps]);

    const handleSkip = useCallback(() => {
        if (!isLastStep) {
            setCurrentStepIndex(prev => prev + 1);
            setCurrentNote('');
        }
    }, [isLastStep]);

    if (isMinimized) {
        return (
            <div className="task-workflow-minimized" onClick={() => setIsMinimized(false)}>
                <span className="task-workflow-minimized-title">{title}</span>
                <span className="task-workflow-minimized-progress">
                    {completedSteps.size}/{steps.length}
                </span>
            </div>
        );
    }

    return (
        <div className="task-workflow-overlay">
            <div className="task-workflow-panel">
                {/* Header */}
                <div className="task-workflow-header">
                    <div className="task-workflow-header-left">
                        <button className="task-workflow-icon-btn" title="Settings">⚙️</button>
                        <button
                            className="task-workflow-icon-btn"
                            onClick={handlePrevious}
                            disabled={currentStepIndex === 0}
                            title="Previous step"
                        >
                            ↺
                        </button>
                    </div>
                    <div className="task-workflow-title">{title}</div>
                    <div className="task-workflow-header-right">
                        <button
                            className="task-workflow-icon-btn"
                            onClick={() => setIsMinimized(true)}
                            title="Minimize"
                        >
                            ⊖
                        </button>
                    </div>
                </div>

                {/* Step Counter */}
                <div className="task-workflow-progress">
                    <span className="task-workflow-step-badge">
                        STEP {currentStepIndex + 1}
                    </span>
                    <span className="task-workflow-step-total">of {steps.length}</span>
                </div>

                {/* Instruction */}
                <div className="task-workflow-instruction">
                    {currentStep.instruction}
                </div>

                {/* Details (if any) */}
                {currentStep.details && (
                    <div className="task-workflow-details">
                        {currentStep.details}
                    </div>
                )}

                {/* Actions */}
                <div className="task-workflow-actions">
                    <button
                        className="task-workflow-done-btn"
                        onClick={handleDone}
                    >
                        {isLastStep ? '✓ Complete' : 'Done'}
                    </button>

                    {allowNotes && (
                        <div className="task-workflow-input-container">
                            <input
                                type="text"
                                className="task-workflow-input"
                                value={currentNote}
                                onChange={(e) => setCurrentNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleDone()}
                            />
                            <button
                                className="task-workflow-send-btn"
                                onClick={handleDone}
                                disabled={!currentNote.trim() && completedSteps.has(currentStep.id)}
                            >
                                ⬆
                            </button>
                        </div>
                    )}
                </div>

                {/* Skip link for non-last steps */}
                {!isLastStep && (
                    <button className="task-workflow-skip" onClick={handleSkip}>
                        Skip this step →
                    </button>
                )}
            </div>
        </div>
    );
}
