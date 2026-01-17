import './Slider.css';

export interface SliderProps {
    id: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    label?: string;
    unit?: string;
    disabled?: boolean;
    className?: string;
}

export function Slider({
    id,
    value,
    min,
    max,
    step = 1,
    onChange,
    label,
    unit,
    disabled = false,
    className = ''
}: SliderProps) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`slider-container ${className} ${disabled ? 'disabled' : ''}`}>
            <div className="slider-header">
                {label && <label htmlFor={id} className="slider-label">{label}</label>}
                <span className="slider-value">
                    {value}
                    {unit && <span className="slider-unit">{unit}</span>}
                </span>
            </div>
            <div className="slider-track-wrapper">
                <input
                    type="range"
                    id={id}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    disabled={disabled}
                    className="slider-input"
                    aria-label={label}
                    style={{ backgroundSize: `${percentage}% 100%` }}
                />
            </div>
        </div>
    );
}
