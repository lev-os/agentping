import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Primitives.css';

interface MenuItem {
    id: string;
    label: string;
    shortcut?: string;
    action?: () => void;
    separator?: boolean;
    disabled?: boolean;
}

interface ContextMenuProps {
    items: MenuItem[];
    children: React.ReactNode;
    className?: string;
}

export function ContextMenu({ items, children, className = '' }: ContextMenuProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setVisible(true);
        setPosition({ x: e.pageX, y: e.pageY });
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', () => setVisible(false));
            window.addEventListener('resize', () => setVisible(false));
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', () => setVisible(false));
            window.removeEventListener('resize', () => setVisible(false));
        };
    }, [visible]);

    return (
        <div className={`context-menu-trigger ${className}`} onContextMenu={handleContextMenu}>
            {children}
            {visible && createPortal(
                <div
                    ref={menuRef}
                    className="context-menu"
                    style={{ top: position.y, left: position.x }}
                    role="menu"
                >
                    {items.map((item, index) => (
                        item.separator ? (
                            <div key={`sep-${index}`} className="context-menu-separator" />
                        ) : (
                            <div
                                key={item.id}
                                className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
                                role="menuitem"
                                onClick={() => {
                                    if (!item.disabled && item.action) {
                                        item.action();
                                        setVisible(false);
                                    }
                                }}
                            >
                                <span className="context-menu-label">{item.label}</span>
                                {item.shortcut && <span className="context-menu-shortcut">{item.shortcut}</span>}
                            </div>
                        )
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}
