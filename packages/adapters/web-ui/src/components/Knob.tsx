import { useState, useEffect, useRef } from 'react';
import './Knob.css';

interface KnobProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
    size?: number;
    label?: string;
    unit?: string;
}

export function Knob({ value, min, max, onChange, size = 60, label, unit }: KnobProps) {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef<number>(0);
    const startValue = useRef<number>(0);

    const percentage = ((value - min) / (max - min));
    const angle = percentage * 270 - 135; // -135 to 135 degrees

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startValue.current = value;
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaY = startY.current - e.clientY;
            const range = max - min;
            const deltaValue = (deltaY / 200) * range; // 200px drag for full range

            let newValue = startValue.current + deltaValue;
            newValue = Math.max(min, Math.min(max, newValue));
            onChange(newValue);
        };

        const handleMouseUp = () => setIsDragging(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max, onChange]);

    return (
        <div className="knob-container" style={{ width: size }}>
            <div
                className="knob-control"
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
                title="Drag up/down to adjust"
            >
                <svg width={size} height={size} viewBox="0 0 100 100">
                    {/* Track */}
                    <path
                        d="M 20 80 A 40 40 0 1 1 80 80"
                        fill="none"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    {/* Value Arc */}
                    <path
                        d="M 20 80 A 40 40 0 1 1 80 80"
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={184} // approx circumference of arc
                        strokeDashoffset={184 - (percentage * 184)}
                        style={{ transition: isDragging ? 'none' : 'stroke-dashoffset 0.1s' }}
                    />
                    {/* Indicator Dot */}
                    <g transform={`rotate(${angle} 50 50)`}>
                        <circle cx="50" cy="15" r="4" fill="var(--text-primary)" />
                    </g>
                </svg>
                <div className="knob-value">
                    {Math.round(value)}{unit}
                </div>
            </div>
            {label && <label className="knob-label">{label}</label>}
        </div>
    );
}
