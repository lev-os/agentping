import { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';

// Default cyber palette
const CYBER_PALETTE = [
    '#f7b731', '#eb3b5a', '#fa8231', '#20bf6b', '#0fb9b1',
    '#2d98da', '#3867d6', '#8854d0', '#a55eea', '#4b7bec',
    '#45aaf2', '#2bcbba', '#fed330', '#fd9644', '#fc5c65',
    '#00d2d3', '#54a0ff', '#5f27cd', '#c8d6e5', '#576574'
];

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
    palette?: string[];
}

export function ColorPicker({ value, onChange, label, palette = CYBER_PALETTE }: ColorPickerProps) {
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

    return (
        <div className="color-picker-container" ref={containerRef}>
            {label && <label className="cyber-label">{label}</label>}
            <div className="color-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="color-swatch" style={{ backgroundColor: value }} />
                <span className="color-value">{value}</span>
            </div>

            {isOpen && (
                <div className="color-popover">
                    <div className="color-grid">
                        {palette.map((color) => (
                            <div
                                key={color}
                                className={`color-option ${value === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    onChange(color);
                                    setIsOpen(false);
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
