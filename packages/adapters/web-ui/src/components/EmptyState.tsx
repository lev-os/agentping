import React from 'react';
import './EmptyState.css';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon = '∅',
    title,
    description,
    action,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`empty-state ${className}`}>
            <div className="empty-icon">{icon}</div>
            <h4 className="empty-title">{title}</h4>
            {description && <p className="empty-description">{description}</p>}
            {action && <div className="empty-action">{action}</div>}
        </div>
    );
}
