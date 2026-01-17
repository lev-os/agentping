import './ToggleSwitch.css';

export interface ToggleSwitchProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export function ToggleSwitch({
    id,
    checked,
    onChange,
    label,
    disabled = false,
    className = ''
}: ToggleSwitchProps) {
    return (
        <div className={`toggle-switch-wrapper ${className} ${disabled ? 'disabled' : ''}`}>
            <button
                role="switch"
                aria-checked={checked}
                aria-label={label || id}
                id={id}
                className={`toggle-switch ${checked ? 'checked' : ''}`}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
            >
                <div className="toggle-thumb" />
            </button>
            {label && (
                <label htmlFor={id} className="toggle-label" onClick={() => !disabled && onChange(!checked)}>
                    {label}
                </label>
            )}
        </div>
    );
}
