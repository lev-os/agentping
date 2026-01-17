import { useState } from 'react';
import './TagInput.css';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    label?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Type and press Enter...', label }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag]);
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter(t => t !== tag));
    };

    return (
        <div className="tag-input-container">
            {label && <label className="cyber-label">{label}</label>}
            <div className="tag-input-box cyber-input">
                {tags.map(tag => (
                    <span key={tag} className="tag-chip">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="tag-remove-btn">×</button>
                    </span>
                ))}
                <input
                    type="text"
                    className="tag-input-field"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                />
            </div>
        </div>
    );
}
