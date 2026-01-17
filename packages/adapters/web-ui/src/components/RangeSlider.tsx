import { useState, useRef, useEffect } from 'react';

interface RangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    label?: string;
    step?: number;
    unit?: string;
}

export function RangeSlider({ min, max, value, onChange, label, step = 1, unit = '' }: RangeSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

    const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

    const handleMouseDown = (e: React.MouseEvent, thumb: 'min' | 'max') => {
        e.preventDefault();
        setDragging(thumb);
    };

    useEffect(() => {
        if (!dragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const rawValue = min + (percent / 100) * (max - min);

            // Round to step
            let roundedValue = Math.round(rawValue / step) * step;
            if (roundedValue < min) roundedValue = min;
            if (roundedValue > max) roundedValue = max;

            if (dragging === 'min') {
                const newValue = Math.min(roundedValue, value[1] - step);
                onChange([newValue, value[1]]);
            } else {
                const newValue = Math.max(roundedValue, value[0] + step);
                onChange([value[0], newValue]);
            }
        };

        const handleMouseUp = () => {
            setDragging(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, min, max, step, value, onChange]);

    return (
        <div className="range-slider-container">
            {label && (
                <div className="slider-header">
                    <label className="cyber-label">{label}</label>
                    <span className="slider-value">
                        {value[0]}{unit} - {value[1]}{unit}
                    </span>
                </div>
            )}
            <div className="range-slider-track" ref={trackRef}>
                <div
                    className="range-slider-selected"
                    style={{
                        left: `${getPercentage(value[0])}%`,
                        width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
                    }}
                />
                <div
                    className="range-slider-thumb"
                    style={{ left: `${getPercentage(value[0])}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'min')}
                />
                <div
                    className="range-slider-thumb"
                    style={{ left: `${getPercentage(value[1])}%` }}
                    onMouseDown={(e) => handleMouseDown(e, 'max')}
                />
            </div>
        </div>
    );
}
