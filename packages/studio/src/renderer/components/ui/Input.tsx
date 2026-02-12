/**
 * Input - Studio wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/input-conflict.tsx
 */
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { InputCandidate, type InputConflictProps } from '@kingly/ui/components';
import { X } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode;
    error?: boolean;
    mono?: boolean;
    onClear?: () => void;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    icon,
    error = false,
    mono = false,
    onClear,
    label,
    className = '',
    value,
    ...props
}, ref) => {
    const showClear = onClear && value && String(value).length > 0;

    // For simple cases without icon/clear, delegate fully to candidate
    if (!icon && !onClear) {
        return (
            <InputCandidate
                label={label}
                status={error ? 'error' : 'default'}
                value={value}
                className={[mono && 'font-mono', className].filter(Boolean).join(' ')}
                aria-label={label}
                {...props}
            />
        );
    }

    // For icon/clear cases, wrap the candidate with local adapter chrome
    const inputClasses = [
        'ui-input',
        icon && 'ui-input--has-icon',
        error && 'ui-input--error',
        mono && 'ui-input--mono',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className="ui-input-wrapper">
            {label && <span className="ui-sr-only">{label}</span>}
            {icon && <span className="ui-input-icon" aria-hidden="true">{icon}</span>}
            <InputCandidate
                status={error ? 'error' : 'default'}
                value={value}
                className={inputClasses}
                aria-label={label}
                {...props}
            />
            {showClear && (
                <button
                    type="button"
                    className="ui-input-clear"
                    onClick={onClear}
                    aria-label="Clear input"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
});

Input.displayName = 'Input';
