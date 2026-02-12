/**
 * SearchInput - Studio wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/search-input-conflict.tsx
 */
import {
    useState,
    useRef,
    useEffect,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import { SearchInputCandidate } from '@kingly/ui/components';

export interface SearchResult {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
}

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onSearch?: (query: string) => void;
    onSelect?: (result: SearchResult) => void;
    results?: SearchResult[];
    placeholder?: string;
    loading?: boolean;
    emptyMessage?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    onSearch,
    onSelect,
    results = [],
    placeholder = 'Search...',
    loading = false,
    emptyMessage = 'No results found',
    size = 'md',
    className = '',
}: SearchInputProps) {
    const [showResults, setShowResults] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setShowResults(value.length > 0 && results.length > 0);
        setFocusedIndex(-1);
    }, [value, results]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!showResults) {
            if (e.key === 'Enter' && onSearch) {
                onSearch(value);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1) % results.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => (prev - 1 + results.length) % results.length);
                break;
            case 'Enter':
                e.preventDefault();
                if (focusedIndex >= 0 && results[focusedIndex]) {
                    onSelect?.(results[focusedIndex]);
                    setShowResults(false);
                } else if (onSearch) {
                    onSearch(value);
                }
                break;
            case 'Escape':
                setShowResults(false);
                break;
        }
    };

    return (
        <div className={`ui-search ui-search--${size} ${className}`}>
            <SearchInputCandidate
                query={value}
                onQueryChange={onChange}
                loading={loading}
                onKeyDown={handleKeyDown}
                onFocus={() => value.length > 0 && results.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
                placeholder={placeholder}
                aria-expanded={showResults}
                aria-controls="search-results"
                aria-autocomplete="list"
                role="combobox"
            />
            {showResults && (
                <div
                    ref={resultsRef}
                    id="search-results"
                    className="ui-search-results ui-scrollbar"
                    role="listbox"
                >
                    {results.length === 0 ? (
                        <div className="ui-search-empty">{emptyMessage}</div>
                    ) : (
                        results.map((result, index) => (
                            <div
                                key={result.id}
                                className={`ui-search-result ${index === focusedIndex ? 'ui-search-result--focused' : ''}`}
                                role="option"
                                aria-selected={index === focusedIndex}
                                onClick={() => {
                                    onSelect?.(result);
                                    setShowResults(false);
                                }}
                            >
                                {result.icon && <span className="ui-search-result-icon">{result.icon}</span>}
                                <div>
                                    <div className="ui-search-result-label">{result.label}</div>
                                    {result.description && (
                                        <div className="ui-search-result-desc">{result.description}</div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
