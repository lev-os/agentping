import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopyButtonProps {
    text: string;
    size?: number;
    className?: string;
}

export function CopyButton({ text, size = 14, className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [text]);

    return (
        <button
            className={`ui-copy-button ${copied ? 'ui-copy-button--copied' : ''} ${className}`}
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
            title={copied ? 'Copied!' : 'Copy'}
        >
            {copied ? <Check size={size} /> : <Copy size={size} />}
        </button>
    );
}
