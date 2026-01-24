/**
 * Terminal Link Popup Component
 *
 * Shows a popup with options when hovering over a URL in the terminal.
 */

import { useEffect, useRef } from 'react';
import { ExternalLink, Eye, X } from 'lucide-react';
import './TerminalLinkPopup.css';

interface TerminalLinkPopupProps {
    url: string;
    position: { x: number; y: number };
    onOpenExternal: () => void;
    onOpenPreview: () => void;
    onClose: () => void;
}

export function TerminalLinkPopup({ url, position, onOpenExternal, onOpenPreview, onClose }: TerminalLinkPopupProps) {
    const popupRef = useRef<HTMLDivElement>(null);

    // Close on escape key or click outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Truncate URL for display
    const displayUrl = url.length > 40 ? url.slice(0, 37) + '...' : url;

    return (
        <div
            ref={popupRef}
            className="terminal-link-popup"
            style={{
                left: position.x,
                top: position.y,
            }}
        >
            <div className="popup-header">
                <span className="popup-url" title={url}>{displayUrl}</span>
                <button className="popup-close" onClick={onClose}>
                    <X size={12} />
                </button>
            </div>
            <div className="popup-actions">
                <button className="popup-action preview" onClick={onOpenPreview}>
                    <Eye size={14} />
                    <span>Open in Preview</span>
                </button>
                <button className="popup-action external" onClick={onOpenExternal}>
                    <ExternalLink size={14} />
                    <span>Open in Browser</span>
                </button>
            </div>
        </div>
    );
}
