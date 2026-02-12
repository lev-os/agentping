/**
 * IconButton - Studio wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/icon-button-conflict.tsx
 */
import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { IconButtonCandidate, type IconButtonConflictProps } from '@kingly/ui/components';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    label: string;
    size?: 'sm' | 'md' | 'lg';
    active?: boolean;
    shortcut?: string;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const SIZE_TO_CONFLICT: Record<string, IconButtonConflictProps['size']> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon,
    label,
    size = 'md',
    active = false,
    shortcut,
    tooltipPosition = 'bottom',
    className = '',
    ...props
}, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const resolvedClassName = [
        active && 'ui-icon-button--active',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            className="ui-tooltip-wrapper"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <IconButtonCandidate
                label={label}
                icon={icon}
                tone={active ? 'primary' : 'neutral'}
                size={SIZE_TO_CONFLICT[size] ?? 'md'}
                className={resolvedClassName}
                {...props}
            />
            <Tooltip
                text={label}
                shortcut={shortcut}
                position={tooltipPosition}
                visible={showTooltip && !props.disabled}
            />
        </div>
    );
});

IconButton.displayName = 'IconButton';
