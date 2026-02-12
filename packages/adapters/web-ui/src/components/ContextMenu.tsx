import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card, MenuList } from '@kingly/ui/components';

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
    const closeMenu = () => setVisible(false);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setVisible(true);

        const maxX = window.scrollX + window.innerWidth - 240;
        const maxY = window.scrollY + window.innerHeight - 240;
        setPosition({
            x: Math.min(e.pageX, maxX),
            y: Math.min(e.pageY, maxY)
        });
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            closeMenu();
        }
    };

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };

    useEffect(() => {
        if (!visible) {
            return undefined;
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('scroll', closeMenu, true);
        window.addEventListener('resize', closeMenu);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('scroll', closeMenu, true);
            window.removeEventListener('resize', closeMenu);
        };
    }, [visible]);

    const groupedItems = items.reduce<MenuItem[][]>((groups, item) => {
        if (item.separator) {
            if (groups[groups.length - 1].length > 0) {
                groups.push([]);
            }
            return groups;
        }

        groups[groups.length - 1].push(item);
        return groups;
    }, [[]]).filter((group) => group.length > 0);

    return (
        <div className={`context-menu-trigger ${className}`} onContextMenu={handleContextMenu}>
            {children}
            {visible && createPortal(
                <div
                    ref={menuRef}
                    style={{
                        position: 'absolute',
                        top: position.y,
                        left: position.x,
                        zIndex: 1000
                    }}
                    role="menu"
                    aria-label="Context menu"
                >
                    <Card className="min-w-[220px] p-1">
                        {groupedItems.map((group, groupIdx) => (
                            <React.Fragment key={`group-${groupIdx}`}>
                                <MenuList
                                    items={group.map((item) => ({
                                        id: item.id,
                                        label: item.label,
                                        description: item.shortcut,
                                        disabled: item.disabled
                                    }))}
                                    onSelect={(itemId: string) => {
                                        const selected = group.find((entry) => entry.id === itemId);
                                        if (!selected?.disabled && selected?.action) {
                                            selected.action();
                                            closeMenu();
                                        }
                                    }}
                                    className="py-0"
                                    aria-label="Context actions"
                                />
                                {groupIdx < groupedItems.length - 1 ? (
                                    <div className="my-1 h-px bg-border" />
                                ) : null}
                            </React.Fragment>
                        ))}
                    </Card>
                </div>,
                document.body
            )}
        </div>
    );
}
