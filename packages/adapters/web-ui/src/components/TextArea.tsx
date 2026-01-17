import { useState, useRef, useEffect } from 'react';
import './TextArea.css';

export interface TextAreaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    maxLength?: number;
    rows?: number;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export function TextArea({
    value,
    onChange,
    placeholder,
    label,
    maxLength,
    rows = 3,
    disabled = false,
    error,
    className = ''
}: TextAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto'; // Reset height
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [value]);

    return (
        <div className={`textarea-container ${className} ${error ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
            {label && (
                <div className="textarea-header">
                    <label className="cyber-label textarea-label">{label}</label>
                    {maxLength && (
                        <span className={`textarea-count ${value.length > maxLength ? 'over-limit' : ''}`}>
                            {value.length}/{maxLength}
                        </span>
                    )}
                </div>
            )}
            <textarea
                ref={textareaRef}
                className="cyber-input textarea-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={error ? 'textarea-error' : undefined}
            />
            {error && <div id="textarea-error" className="textarea-error-msg" role="alert">{error}</div>}
        </div>
    );
}
