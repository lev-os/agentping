import './SegmentedControl.css';

interface SegmentedControlProps {
    options: { id: string; label: string; icon?: string }[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export function SegmentedControl({ options, value, onChange, label, className = '' }: SegmentedControlProps) {
    return (
        <div className={`segmented-control-container ${className}`}>
            {label && <label className="cyber-label">{label}</label>}
            <div className="segmented-track">
                {options.map((option) => (
                    <button
                        key={option.id}
                        className={`segmented-option ${value === option.id ? 'active' : ''}`}
                        onClick={() => onChange(option.id)}
                    >
                        {option.icon && <span className="segmented-icon">{option.icon}</span>}
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
