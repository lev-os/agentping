import { useRef, useState, useEffect } from 'react';
import './PinInput.css';

interface PinInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    onComplete?: (value: string) => void;
}

export function PinInput({ length = 4, value, onChange, label, onComplete }: PinInputProps) {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputsRef.current = inputsRef.current.slice(0, length);
    }, [length]);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                // Focus previous input if current is empty
                inputsRef.current[index - 1]?.focus();
                const newValue = value.slice(0, index - 1) + value.slice(index);
                onChange(newValue);
            } else {
                const newValue = value.slice(0, index) + value.slice(index + 1);
                onChange(newValue);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const char = e.target.value.slice(-1); // Get last char (though input should only accept 1)
        if (!char) return; // Backspace handled in keydown

        const newValueArr = value.padEnd(length, ' ').split('');
        newValueArr[index] = char;
        const newValue = newValueArr.join('').trim();

        onChange(newValue);

        if (index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        } else if (onComplete && newValue.length === length) {
            onComplete(newValue);
        }
    };

    return (
        <div>
            {label && <label className="cyber-label">{label}</label>}
            <div className="pin-input-container">
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="pin-input-field"
                        value={value[i] || ''}
                        ref={(el) => { inputsRef.current[i] = el; }}
                        onFocus={() => setFocusedIndex(i)}
                        onBlur={() => setFocusedIndex(null)}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                ))}
            </div>
        </div>
    );
}
