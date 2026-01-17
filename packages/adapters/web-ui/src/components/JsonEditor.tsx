import { useState, useEffect } from 'react';
import './JsonEditor.css';

interface JsonEditorProps {
    value: object;
    onChange?: (value: object) => void;
    readOnly?: boolean;
}

export function JsonEditor({ value, onChange, readOnly = false }: JsonEditorProps) {
    const [text, setText] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setText(JSON.stringify(value, null, 2));
    }, [value]);

    const handleChange = (newText: string) => {
        setText(newText);
        try {
            const parsed = JSON.parse(newText);
            setError(null);
            onChange?.(parsed);
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="json-editor">
            <textarea
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                readOnly={readOnly}
                spellCheck={false}
                aria-label="JSON Editor"
                aria-invalid={!!error}
                aria-describedby={error ? "json-error-msg" : undefined}
            />
            <div className="json-status" role="status" aria-live="polite">
                {error ? (
                    <span id="json-error-msg" className="json-invalid">Invalid JSON: {error}</span>
                ) : (
                    <span className="json-valid">Valid JSON</span>
                )}
            </div>
        </div>
    );
}
