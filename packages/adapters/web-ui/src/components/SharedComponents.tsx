/**
 * ApprovalButtons, QuestionInput, DirectionPicker, NotificationBanner
 */

import './SharedComponents.css';

// ============================================================================
// ApprovalButtons
// ============================================================================

interface ApprovalButtonsProps {
    title: string;
    details?: string;
    risk?: 'low' | 'medium' | 'high';
    onApprove: () => void;
    onDeny: () => void;
}

export function ApprovalButtons({ title, details, risk, onApprove, onDeny }: ApprovalButtonsProps) {
    return (
        <div className="approval-container">
            <div className="approval-content">
                <h3>{title}</h3>
                {details && <p className="approval-details">{details}</p>}
                {risk && <span className={`badge badge-${risk}`}>{risk} risk</span>}
            </div>
            <div className="approval-buttons">
                <button className="btn-primary btn-lg" onClick={onApprove}>
                    ✓ Approve <span className="kbd">Y</span>
                </button>
                <button className="btn-danger btn-lg" onClick={onDeny}>
                    ✗ Deny <span className="kbd">N</span>
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// QuestionInput
// ============================================================================

interface QuestionInputProps {
    question: string;
    context?: string;
    options?: string[];
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function QuestionInput({ question, context, options, value, onChange, onSubmit }: QuestionInputProps) {
    return (
        <div className="question-container">
            <div className="question-text">{question}</div>
            {context && <div className="question-context">{context}</div>}

            {options && options.length > 0 && (
                <div className="question-options">
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            className={`btn-secondary ${value === opt ? 'selected' : ''}`}
                            onClick={() => onChange(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}

            <div className="question-input-row">
                <input
                    type="text"
                    placeholder="Type your answer..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                />
                <button className="btn-primary" onClick={onSubmit} disabled={!value}>
                    Submit
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// DirectionPicker
// ============================================================================

interface Direction {
    id: string;
    direction: string;
    rationale: string;
    estimatedEffort: 'quick' | 'medium' | 'deep';
}

interface DirectionPickerProps {
    directions: Direction[];
    selectedDirections: Set<string>;
    onToggle: (id: string) => void;
    allowCustom?: boolean;
}

export function DirectionPicker({ directions, selectedDirections, onToggle }: DirectionPickerProps) {
    const getEffortColor = (effort: string) => {
        switch (effort) {
            case 'quick': return 'badge-quick';
            case 'deep': return 'badge-deep';
            default: return 'badge-medium';
        }
    };

    return (
        <div className="direction-picker">
            {directions.map((dir) => (
                <div
                    key={dir.id}
                    className={`direction-card ${selectedDirections.has(dir.id) ? 'selected' : ''}`}
                    onClick={() => onToggle(dir.id)}
                >
                    <div className="direction-header">
                        <span className="direction-title">{dir.direction}</span>
                        <span className={`badge ${getEffortColor(dir.estimatedEffort)}`}>
                            {dir.estimatedEffort}
                        </span>
                    </div>
                    <div className="direction-rationale">{dir.rationale}</div>
                </div>
            ))}
        </div>
    );
}

// ============================================================================
// NotificationBanner
// ============================================================================

interface NotificationBannerProps {
    message: string;
    level: 'info' | 'success' | 'warning' | 'error';
    onDismiss: () => void;
}

export function NotificationBanner({ message, level, onDismiss }: NotificationBannerProps) {
    const getIcon = () => {
        switch (level) {
            case 'success': return '✓';
            case 'warning': return '⚠';
            case 'error': return '✗';
            default: return 'ℹ';
        }
    };

    return (
        <div className={`notification-banner notification-${level}`}>
            <span className="notification-icon">{getIcon()}</span>
            <span className="notification-message">{message}</span>
            <button className="btn-ghost" onClick={onDismiss}>Dismiss</button>
        </div>
    );
}
