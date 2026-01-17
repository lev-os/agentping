import React, { useState } from 'react';
import './PromptEditor.css';

interface PromptEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function PromptEditor({
    value,
    onChange,
    className = '',
    placeholder = 'Enter prompt...'
}: PromptEditorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    // Simple heuristic to highlight variables like {{variable}}
    const renderHighlights = () => {
        const parts = value.split(/(\{\{.*?\}\})/g);
        return parts.map((part, i) => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
                return <span key={i} className="prompt-variable">{part}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className={`prompt-editor ${className}`}>
            <div className="prompt-backdrop">
                {renderHighlights()}
            </div>
            <textarea
                className="prompt-textarea"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                spellCheck={false}
            />
        </div>
    );
}
