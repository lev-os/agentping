import { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

export interface MultiSelectOption {
    id: string;
    label: string;
}

export interface MultiSelectProps {
    options: MultiSelectOption[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export function MultiSelect({
    options,
    selectedIds,
    onChange,
    placeholder = 'Select options...',
    label,
    disabled = false,
    className = ''
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter(sid => sid !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const removeOption = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onChange(selectedIds.filter(sid => sid !== id));
    };

    const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

    return (
        <div className={`multi-select-container ${className}`} ref={containerRef}>
            {label && <div className="multi-select-label">{label}</div>}

            <div
                className={`multi-select-input ${isOpen ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!disabled) setIsOpen(!isOpen);
                    }
                }}
            >
                {selectedOptions.length > 0 ? (
                    <div className="multi-select-tags">
                        {selectedOptions.map(opt => (
                            <span key={opt.id} className="multi-select-tag">
                                {opt.label}
                                <button
                                    onClick={(e) => removeOption(e, opt.id)}
                                    className="tag-remove"
                                    aria-label={`Remove ${opt.label}`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="multi-select-placeholder">{placeholder}</span>
                )}
                <div className="multi-select-arrow" aria-hidden="true">▼</div>
            </div>

            {isOpen && !disabled && (
                <div className="multi-select-dropdown" role="listbox">
                    {options.map(opt => {
                        const isSelected = selectedIds.includes(opt.id);
                        return (
                            <div
                                key={opt.id}
                                className={`multi-select-option ${isSelected ? 'selected' : ''}`}
                                onClick={() => toggleOption(opt.id)}
                                role="option"
                                aria-selected={isSelected}
                            >
                                <div className="option-checkbox">
                                    {isSelected && '✓'}
                                </div>
                                {opt.label}
                            </div>
                        );
                    })}
                    {options.length === 0 && (
                        <div className="multi-select-empty">No options</div>
                    )}
                </div>
            )}
        </div>
    );
}
