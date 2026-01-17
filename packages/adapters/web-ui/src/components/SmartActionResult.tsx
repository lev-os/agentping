import React from 'react';
import './SmartActionResult.css';

interface SmartActionResultProps {
    title: string;
    description?: string;
    diff?: {
        oldValue: string;
        newValue: string;
        language?: string;
    };
    actions?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'danger';
    }[];
    onDismiss?: () => void;
}

export function SmartActionResult({
    title,
    description,
    diff,
    actions = [],
    onDismiss
}: SmartActionResultProps) {
    return (
        <div className="smart-action-result">
            <div className="smart-action-header">
                <div className="smart-action-title">
                    <span className="smart-icon">⚡</span>
                    <h3>{title}</h3>
                </div>
                {onDismiss && (
                    <button className="smart-dismiss" onClick={onDismiss}>×</button>
                )}
            </div>

            {description && (
                <div className="smart-action-description">
                    {description}
                </div>
            )}

            {diff && (
                <div className="smart-diff-viewer">
                    <div className="diff-header">
                        <span>Proposed Changes</span>
                        {diff.language && <span className="diff-lang">{diff.language}</span>}
                    </div>
                    <div className="diff-content">
                        <pre className="diff-old"><code>{diff.oldValue}</code></pre>
                        <pre className="diff-new"><code>{diff.newValue}</code></pre>
                    </div>
                </div>
            )}

            {actions.length > 0 && (
                <div className="smart-action-footer">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            className={`smart-btn smart-btn-${action.variant || 'secondary'}`}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
