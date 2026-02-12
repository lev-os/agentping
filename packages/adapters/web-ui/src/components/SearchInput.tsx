/**
 * SearchInput - Web-UI wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/search-input-conflict.tsx
 */
import { useEffect, useState } from 'react';
import { SearchInputCandidate } from '@kingly/ui/components';

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

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (debounceMs <= 0 || localValue === value || localValue === '') {
            return;
        }

        const handler = setTimeout(() => {
            onChange(localValue);
        }, debounceMs);

        return () => {
            clearTimeout(handler);
        };
    }, [localValue, debounceMs, onChange, value]);

    const handleLocalChange = (nextValue: string) => {
        setLocalValue(nextValue);
        if (nextValue === '' || debounceMs <= 0) {
            onChange(nextValue);
        }
    };

    return (
        <SearchInputCandidate
            query={localValue}
            onQueryChange={handleLocalChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            containerClassName={className}
        />
    );
}
