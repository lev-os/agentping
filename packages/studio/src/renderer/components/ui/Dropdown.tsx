import { ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
    id: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
}

export interface DropdownProps {
    value?: string;
    options: DropdownOption[];
    onChange?: (id: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function Dropdown({
    value,
    options,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    className = '',
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prev => (prev + 1) % options.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prev => (prev - 1 + options.length) % options.length);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0 && !options[focusedIndex].disabled) {
                    onChange?.(options[focusedIndex].id);
                    setIsOpen(false);
                }
                break;
        }
    };

    return (
        <div ref={dropdownRef} className={`ui-dropdown ${className}`}>
            <button
                type="button"
                className="ui-dropdown-trigger"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {selectedOption?.icon}
                <span>{selectedOption?.label || placeholder}</span>
                <ChevronDown size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />
            </button>
            {isOpen && (
                <div className="ui-dropdown-menu" role="listbox">
                    {options.map((option, index) => (
                        <button
                            key={option.id}
                            className={`ui-context-menu-item ${index === focusedIndex ? 'ui-context-menu-item--focused' : ''}`}
                            role="option"
                            aria-selected={option.id === value}
                            disabled={option.disabled}
                            onClick={() => {
                                if (!option.disabled) {
                                    onChange?.(option.id);
                                    setIsOpen(false);
                                }
                            }}
                        >
                            {option.icon && <span className="ui-context-menu-item-icon">{option.icon}</span>}
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
