import { isValidElement, type ComponentType, type ReactNode } from 'react';
import * as KinglyComponents from '@kingly/ui/components';

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

interface MigrationEmptyStateProps {
    title: string;
    description?: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
    icon?: ReactNode;
    className?: string;
}

const migrationComponents = KinglyComponents as Record<string, unknown>;
const EmptyStateCandidate = migrationComponents.EmptyStateCandidate as ComponentType<MigrationEmptyStateProps> | undefined;

function extractAction(action: ReactNode): { label: string; onClick?: () => void } | null {
    if (!isValidElement(action)) {
        return null;
    }

    const element = action as { props?: { children?: ReactNode; onClick?: unknown } };
    const label = element.props?.children;
    if (typeof label !== 'string' && typeof label !== 'number') {
        return null;
    }

    const onClick = element.props?.onClick;
    return {
        label: String(label),
        onClick: typeof onClick === 'function' ? (onClick as () => void) : undefined,
    };
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
    const parsedAction = action ? extractAction(action) : null;

    if (EmptyStateCandidate && (!action || parsedAction)) {
        return (
            <EmptyStateCandidate
                icon={icon}
                title={title}
                description={description}
                ctaLabel={parsedAction?.label}
                onCtaClick={parsedAction?.onClick}
                className={className}
            />
        );
    }

    return (
        <div className={`ui-empty-state ${className}`}>
            {icon && <div className="ui-empty-state-icon">{icon}</div>}
            <h3 className="ui-empty-state-title">{title}</h3>
            {description && <p className="ui-empty-state-description">{description}</p>}
            {action}
        </div>
    );
}
