import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
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
    const inputClasses = [
        'ui-input',
        icon && 'ui-input--has-icon',
        error && 'ui-input--error',
        mono && 'ui-input--mono',
        className,
    ].filter(Boolean).join(' ');

    const showClear = onClear && value && String(value).length > 0;

    return (
        <div className="ui-input-wrapper">
            {label && <span className="ui-sr-only">{label}</span>}
            {icon && <span className="ui-input-icon" aria-hidden="true">{icon}</span>}
            <input
                ref={ref}
                className={inputClasses}
                value={value}
                aria-label={label}
                aria-invalid={error}
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
