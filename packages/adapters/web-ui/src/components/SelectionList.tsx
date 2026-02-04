/**
 * SelectionList Component
 */

import './SelectionList.css';

interface SelectionOption {
    id: string;
    label: string;
    description?: string;
    preview?: string;
}

interface SelectionListProps {
    options: SelectionOption[];
    selectedOptions: Set<string>;
    onToggle: (optionId: string) => void;
    allowMultiple?: boolean;
}

export function SelectionList({ options, selectedOptions, onToggle, allowMultiple }: SelectionListProps) {
    // Warn in dev mode about options with empty labels
    if (process.env.NODE_ENV === 'development') {
        options.forEach(option => {
            if (!option.label) {
                console.warn('[SelectionList] Option missing label:', option);
            }
        });
    }

    return (
        <div className="selection-list">
            {options.map((option) => (
                <div
                    key={option.id}
                    className={`selection-item ${selectedOptions.has(option.id) ? 'selected' : ''}`}
                    onClick={() => onToggle(option.id)}
                >
                    {allowMultiple ? (
                        <input
                            type="checkbox"
                            checked={selectedOptions.has(option.id)}
                            onChange={() => onToggle(option.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <input
                            type="radio"
                            checked={selectedOptions.has(option.id)}
                            onChange={() => onToggle(option.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    <div className="selection-content">
                        <div className="selection-label">
                            {option.label || <span className="text-muted">(Unnamed option)</span>}
                        </div>
                        {option.description && (
                            <div className="selection-description">{option.description}</div>
                        )}
                        {option.preview && (
                            <pre className="selection-preview">{option.preview}</pre>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
