
import './WizardStep.css';
interface WizardStepProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onBack?: () => void;
    onNext?: () => void;
    currentStep: number;
    totalSteps: number;
    isNextDisabled?: boolean;
}

export function WizardStep({
    title,
    subtitle,
    children,
    onBack,
    onNext,
    currentStep,
    totalSteps,
    isNextDisabled = false
}: WizardStepProps) {
    return (
        <div className="wizard-step" role="region" aria-label={`Step ${currentStep} of ${totalSteps}: ${title}`}>
            <div className="wizard-header">
                <div className="wizard-title">
                    <h3>{title}</h3>
                    {subtitle && <p className="wizard-subtitle">{subtitle}</p>}
                </div>
                <div
                    className="wizard-progress"
                    role="progressbar"
                    aria-valuenow={currentStep}
                    aria-valuemin={1}
                    aria-valuemax={totalSteps}
                    aria-label="Wizard Progress"
                >
                    Step {currentStep} / {totalSteps}
                </div>
            </div>
            <div className="wizard-content">
                {children}
            </div>
            <div className="wizard-footer">
                <button
                    className="nav-btn"
                    onClick={onBack}
                    disabled={!onBack}
                    aria-label="Go to previous step"
                >
                    Back
                </button>
                <div className="wizard-actions">
                    <button
                        className="nav-btn primary"
                        onClick={onNext}
                        disabled={!onNext || isNextDisabled}
                        aria-label={currentStep === totalSteps ? 'Finish wizard' : 'Go to next step'}
                    >
                        {currentStep === totalSteps ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}
