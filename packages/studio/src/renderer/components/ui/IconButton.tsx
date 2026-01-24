import { forwardRef, ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { Tooltip } from './Tooltip';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;
    label: string;
    size?: 'sm' | 'md' | 'lg';
    active?: boolean;
    shortcut?: string;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

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

    const classes = [
        'ui-icon-button',
        size !== 'md' && `ui-icon-button--${size}`,
        active && 'ui-icon-button--active',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            className="ui-tooltip-wrapper"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <button
                ref={ref}
                className={classes}
                aria-label={label}
                {...props}
            >
                {icon}
            </button>
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
