import * as React from 'react';
import {
    Badge as KinglyBadge,
    type BadgeProps as KinglyBadgeProps
} from '@kingly/ui/components';

export interface BadgeProps {
    label: string | number;
    type?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'outline';
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const TYPE_TO_VARIANT: Record<
    NonNullable<BadgeProps['type']>,
    NonNullable<KinglyBadgeProps['variant']>
> = {
    default: 'default',
    success: 'success',
    warning: 'warning',
    error: 'destructive',
    info: 'secondary',
    outline: 'outline'
};

export function Badge({
    label,
    type = 'default',
    icon,
    className = '',
    onClick
}: BadgeProps) {
    const handleKeyDown = onClick
        ? (e: React.KeyboardEvent<HTMLSpanElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        }
        : undefined;

    return (
        <KinglyBadge
            variant={TYPE_TO_VARIANT[type]}
            className={className}
            role={onClick ? 'button' : 'status'}
            aria-label={String(label)}
            onClick={onClick}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={handleKeyDown}
        >
            {icon ? (
                <span aria-hidden="true" style={{ marginRight: 4 }}>
                    {icon}
                </span>
            ) : null}
            {label}
        </KinglyBadge>
    );
}
