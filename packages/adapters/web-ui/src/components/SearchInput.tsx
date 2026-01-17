import { useState, useEffect, useRef } from 'react';
import './SearchInput.css';

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    className?: string;
    autoFocus?: boolean;
}

export function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    debounceMs = 300,
    className = '',
    autoFocus = false
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);

    // Sync local value if prop changes externally
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [localValue, debounceMs, onChange, value]);

    return (
        <div className={`search-input-wrapper ${className}`}>
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
                type="text"
                className="cyber-input search-input"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                aria-label="Search"
            />
            {localValue && (
                <button
                    className="search-clear"
                    onClick={() => {
                        setLocalValue('');
                        onChange('');
                    }}
                    aria-label="Clear search"
                >
                    ×
                </button>
            )}
        </div>
    );
}
