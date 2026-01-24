import { ReactNode } from 'react';

export interface BadgeProps {
    children?: ReactNode;
    count?: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    dot?: boolean;
    className?: string;
}

export function Badge({
    children,
    count,
    max = 99,
    variant = 'default',
    size = 'md',
    dot = false,
    className = '',
}: BadgeProps) {
    const classes = [
        'ui-badge',
        `ui-badge--${variant}`,
        size === 'sm' && 'ui-badge--sm',
        className,
    ].filter(Boolean).join(' ');

    // Format count display
    const displayCount = count !== undefined
        ? count > max ? `${max}+` : count.toString()
        : null;

    return (
        <span className={classes}>
            {dot && <span className="ui-badge-dot" aria-hidden="true" />}
            {displayCount ?? children}
        </span>
    );
}
