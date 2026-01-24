import { ReactNode } from 'react';

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`ui-empty-state ${className}`}>
            {icon && <div className="ui-empty-state-icon">{icon}</div>}
            <h3 className="ui-empty-state-title">{title}</h3>
            {description && <p className="ui-empty-state-description">{description}</p>}
            {action}
        </div>
    );
}
