import { type ComponentType, type ReactNode } from 'react';
import * as KinglyComponents from '@kingly/ui/components';

type MigrationBadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

interface MigrationBadgeProps {
    label: string;
    tone?: MigrationBadgeTone;
    subtle?: boolean;
    className?: string;
}

type CanonicalBadgeVariant =
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'destructive'
    | 'outline'
    | 'ghost';

interface CanonicalBadgeProps {
    children?: ReactNode;
    className?: string;
    variant?: CanonicalBadgeVariant;
}

const migrationComponents = KinglyComponents as Record<string, unknown>;
const BadgeCandidate = migrationComponents.BadgeCandidate as ComponentType<MigrationBadgeProps> | undefined;
const BadgeBase = migrationComponents.Badge as ComponentType<CanonicalBadgeProps> | undefined;

export interface BadgeProps {
    children?: ReactNode;
    count?: number;
    max?: number;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    dot?: boolean;
    className?: string;
}

function toMigrationTone(variant: BadgeProps['variant']): MigrationBadgeTone {
    switch (variant) {
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'danger';
        default:
            return 'neutral';
    }
}

function toCanonicalVariant(variant: BadgeProps['variant']): CanonicalBadgeVariant {
    switch (variant) {
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'destructive';
        case 'info':
            return 'secondary';
        default:
            return 'default';
    }
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
    const sizeClass = size === 'sm' ? 'ui-badge--sm' : '';
    const mergedClassName = [sizeClass, className].filter(Boolean).join(' ');

    const displayCount = count !== undefined
        ? count > max ? `${max}+` : count.toString()
        : null;
    const content = displayCount ?? children;
    const simpleContent = content === null || typeof content === 'string' || typeof content === 'number';

    if (BadgeCandidate && simpleContent) {
        const label = content === null ? (dot ? '•' : '') : String(content);
        return (
            <BadgeCandidate
                label={label}
                tone={toMigrationTone(variant)}
                subtle={size === 'sm'}
                className={mergedClassName}
            />
        );
    }

    if (BadgeBase) {
        return (
            <BadgeBase className={mergedClassName} variant={toCanonicalVariant(variant)}>
                {dot && <span className="ui-badge-dot" aria-hidden="true" />}
                {content}
            </BadgeBase>
        );
    }

    return (
        <span className={mergedClassName}>
            {dot && <span className="ui-badge-dot" aria-hidden="true" />}
            {content}
        </span>
    );
}
