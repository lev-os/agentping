import { useState } from 'react';
import './SecretInput.css';

interface SecretInputProps {
    value?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
}

export function SecretInput({ value = '', placeholder = 'Enter secret...', onChange }: SecretInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="secret-input-container">
            <div className="secret-input-wrapper">
                <input
                    type={isVisible ? 'text' : 'password'}
                    className="cyber-input secret-input"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    aria-label={placeholder}
                />
                <button
                    className="secret-toggle"
                    onClick={() => setIsVisible(!isVisible)}
                    title={isVisible ? 'Hide password' : 'Show password'}
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isVisible}
                >
                    {isVisible ? '👁️' : '🔒'}
                </button>
            </div>
        </div>
    );
}
