import { useState, useRef, useEffect } from 'react';
import './EditableText.css';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    multiline?: boolean;
}

export function EditableText({ value, onChange, placeholder = 'Click to edit...', label, multiline = false }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleSave = () => {
        if (localValue !== value) {
            onChange(localValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
        }
    };

    return (
        <div className="editable-text-container">
            {label && <label className="cyber-label">{label}</label>}
            {isEditing ? (
                multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="cyber-input editable-input"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        rows={3}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        className="cyber-input editable-input"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                    />
                )
            ) : (
                <div
                    className={`editable-display ${!value ? 'placeholder' : ''}`}
                    onClick={() => setIsEditing(true)}
                    title="Click to edit"
                >
                    {value || placeholder}
                    <span className="edit-icon">✎</span>
                </div>
            )}
        </div>
    );
}
