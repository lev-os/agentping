import { forwardRef, type ButtonHTMLAttributes, type ComponentType, type ReactNode } from 'react';
import * as KinglyComponents from '@kingly/ui/components';
import { Spinner } from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
}

type MigrationButtonTone = 'primary' | 'secondary' | 'ghost' | 'danger';
type MigrationButtonSize = 'sm' | 'md' | 'lg';

interface MigrationButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    label: string;
    tone?: MigrationButtonTone;
    size?: MigrationButtonSize;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    className?: string;
}

type CanonicalButtonVariant =
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'menu-item'
    | 'nav-item'
    | 'tab'
    | 'unstyled';

type CanonicalButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';

interface CanonicalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: CanonicalButtonVariant;
    size?: CanonicalButtonSize;
    asChild?: boolean;
    children?: ReactNode;
}

const migrationComponents = KinglyComponents as Record<string, unknown>;
const ButtonCandidate = migrationComponents.ButtonCandidate as ComponentType<any> | undefined;
const ButtonBase = migrationComponents.Button as ComponentType<any> | undefined;

function toMigrationTone(variant: ButtonProps['variant']): MigrationButtonTone {
    switch (variant) {
        case 'secondary':
            return 'secondary';
        case 'ghost':
            return 'ghost';
        case 'danger':
            return 'danger';
        default:
            return 'primary';
    }
}

function toCanonicalVariant(variant: ButtonProps['variant']): CanonicalButtonVariant {
    switch (variant) {
        case 'secondary':
            return 'secondary';
        case 'ghost':
            return 'ghost';
        case 'danger':
            return 'destructive';
        default:
            return 'default';
    }
}

function toCanonicalSize(size: ButtonProps['size']): CanonicalButtonSize {
    switch (size) {
        case 'sm':
            return 'sm';
        case 'lg':
            return 'lg';
        default:
            return 'default';
    }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'secondary',
    size = 'md',
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    ...buttonProps
}, ref) => {
    const leadingIcon = loading ? <Spinner size="sm" /> : icon;
    const textLabel = typeof children === 'string' || typeof children === 'number'
        ? String(children)
        : null;

    if (ButtonCandidate && textLabel !== null) {
        return (
            <ButtonCandidate
                ref={ref}
                label={textLabel}
                tone={toMigrationTone(variant)}
                size={size}
                leadingIcon={leadingIcon}
                className={className}
                disabled={disabled || loading}
                {...buttonProps}
            />
        );
    }

    if (ButtonBase) {
        return (
            <ButtonBase
                ref={ref}
                variant={toCanonicalVariant(variant)}
                size={toCanonicalSize(size)}
                className={className}
                disabled={disabled || loading}
                {...buttonProps}
            >
                {leadingIcon}
                {children}
            </ButtonBase>
        );
    }

    const classes = [
        'ui-button',
        `ui-button--${variant}`,
        size !== 'md' && `ui-button--${size}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled || loading}
            {...buttonProps}
        >
            {leadingIcon}
            {children}
        </button>
    );
});

Button.displayName = 'Button';
