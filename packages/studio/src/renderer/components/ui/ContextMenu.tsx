import { ReactNode, useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';

interface ContextMenuPosition {
    x: number;
    y: number;
}

interface ContextMenuContextValue {
    position: ContextMenuPosition | null;
    open: (x: number, y: number) => void;
    close: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export interface ContextMenuProps {
    children: ReactNode;
    menu: ReactNode;
}

export function ContextMenu({ children, menu }: ContextMenuProps) {
    const [position, setPosition] = useState<ContextMenuPosition | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const open = useCallback((x: number, y: number) => {
        // Adjust position to stay within viewport
        const menuWidth = 200;
        const menuHeight = 300;
        const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
        const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);
        setPosition({ x: Math.max(10, adjustedX), y: Math.max(10, adjustedY) });
    }, []);

    const close = useCallback(() => {
        setPosition(null);
    }, []);

    useEffect(() => {
        if (!position) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                close();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                close();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [position, close]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        open(e.clientX, e.clientY);
    };

    return (
        <ContextMenuContext.Provider value={{ position, open, close }}>
            <div onContextMenu={handleContextMenu}>
                {children}
            </div>
            {position && (
                <div
                    ref={menuRef}
                    className="ui-context-menu"
                    style={{ left: position.x, top: position.y }}
                    role="menu"
                >
                    {menu}
                </div>
            )}
        </ContextMenuContext.Provider>
    );
}

export interface ContextMenuItemProps {
    icon?: ReactNode;
    children: ReactNode;
    shortcut?: string;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export function ContextMenuItem({
    icon,
    children,
    shortcut,
    danger = false,
    disabled = false,
    onClick,
}: ContextMenuItemProps) {
    const context = useContext(ContextMenuContext);

    const handleClick = () => {
        if (disabled) return;
        onClick?.();
        context?.close();
    };

    return (
        <button
            className={`ui-context-menu-item ${danger ? 'ui-context-menu-item--danger' : ''}`}
            role="menuitem"
            disabled={disabled}
            onClick={handleClick}
        >
            {icon && <span className="ui-context-menu-item-icon">{icon}</span>}
            <span>{children}</span>
            {shortcut && <span className="ui-context-menu-item-shortcut">{shortcut}</span>}
        </button>
    );
}

export function ContextMenuSeparator() {
    return <div className="ui-context-menu-separator" role="separator" />;
}

ContextMenu.Item = ContextMenuItem;
ContextMenu.Separator = ContextMenuSeparator;
