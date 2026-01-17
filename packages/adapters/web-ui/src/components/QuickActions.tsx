import React from 'react';
import './QuickActions.css';

interface QuickAction {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

interface QuickActionsProps {
    actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div className="quick-actions-grid" role="group" aria-label="Quick Actions">
            {actions.map((action) => (
                <button
                    key={action.id}
                    className="quick-action-btn"
                    onClick={action.onClick}
                    aria-label={action.label}
                >
                    {action.icon && (
                        <span className="quick-action-icon" aria-hidden="true">
                            {action.icon}
                        </span>
                    )}
                    <span className="quick-action-label">{action.label}</span>
                </button>
            ))}
        </div>
    );
}
