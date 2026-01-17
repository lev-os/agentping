import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Primitives.css';

interface HoverCardProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'top' | 'bottom';
    delayMs?: number;
}

export function HoverCard({ trigger, children, align = 'top', delayMs = 300 }: HoverCardProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setPosition({
                    x: rect.left + window.scrollX,
                    y: (align === 'top' ? rect.top : rect.bottom) + window.scrollY + (align === 'top' ? -10 : 10)
                });
                setVisible(true);
            }
        }, delayMs);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    return (
        <div
            className="hover-card-boundary"
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block' }}
        >
            {trigger}
            {visible && createPortal(
                <div
                    className="hover-card-content"
                    style={{
                        top: position.y,
                        left: position.x,
                        transform: align === 'top' ? 'translateY(-100%)' : 'none'
                    }}
                >
                    {children}
                </div>,
                document.body
            )}
        </div>
    );
}
