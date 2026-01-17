import React, { useEffect } from 'react';
import './SidePanel.css';

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number;
    side?: 'left' | 'right';
}

export function SidePanel({ isOpen, onClose, title, children, width = 300, side = 'right' }: SidePanelProps) {

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`panel-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`side-panel ${side} ${isOpen ? 'open' : ''}`}
                style={{ width, maxWidth: '90vw' }}
            >
                <div className="panel-header">
                    <h3 className="panel-title">{title}</h3>
                    <button className="panel-close" onClick={onClose}>×</button>
                </div>
                <div className="panel-content">
                    {children}
                </div>
                <div className="panel-footer">
                    {/* Optional footer content */}
                </div>
            </div>
        </>
    );
}
