import {
    Children,
    createContext,
    isValidElement,
    type ComponentType,
    type MouseEvent as ReactMouseEvent,
    type ReactElement,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import * as KinglyComponents from '@kingly/ui/components';

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

export interface ContextMenuProps {
    children: ReactNode;
    menu: ReactNode;
}

interface MigrationContextMenuAction {
    id: string;
    label: string;
    shortcut?: string;
    danger?: boolean;
    disabled?: boolean;
}

interface MigrationContextMenuProps {
    title?: string;
    actions: MigrationContextMenuAction[];
    onActionSelect?: (actionId: string) => void;
    className?: string;
}

const migrationComponents = KinglyComponents as Record<string, unknown>;
const ContextMenuCandidate = migrationComponents.ContextMenuCandidate as ComponentType<MigrationContextMenuProps> | undefined;

function toPlainText(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map((item) => toPlainText(item)).join('');
    }

    if (isValidElement(node)) {
        const element = node as { props?: { children?: ReactNode } };
        return toPlainText(element.props?.children);
    }

    return '';
}

function parseMigrationActions(menu: ReactNode) {
    const actions: MigrationContextMenuAction[] = [];
    const handlers: Record<string, (() => void) | undefined> = {};

    for (const child of Children.toArray(menu)) {
        if (!isValidElement(child)) {
            continue;
        }

        if (child.type === ContextMenuSeparator) {
            continue;
        }

        if (child.type !== ContextMenuItem) {
            return null;
        }

        const props = child.props as ContextMenuItemProps;
        const label = toPlainText(props.children).trim();
        if (!label) {
            return null;
        }

        const actionId = `menu-action-${actions.length}`;
        actions.push({
            id: actionId,
            label,
            shortcut: props.shortcut,
            danger: props.danger,
            disabled: props.disabled,
        });
        handlers[actionId] = props.onClick;
    }

    return {
        actions,
        handlers,
    };
}

interface ContextMenuComponent {
    (props: ContextMenuProps): ReactElement;
    Item: typeof ContextMenuItem;
    Separator: typeof ContextMenuSeparator;
}

const ContextMenuImpl = ({ children, menu }: ContextMenuProps) => {
    const [position, setPosition] = useState<ContextMenuPosition | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const migrationMenu = useMemo(() => parseMigrationActions(menu), [menu]);

    const open = useCallback((x: number, y: number) => {
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

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                close();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
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

    const handleContextMenu = (event: ReactMouseEvent) => {
        event.preventDefault();
        open(event.clientX, event.clientY);
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
                    {ContextMenuCandidate && migrationMenu ? (
                        <ContextMenuCandidate
                            title="Actions"
                            actions={migrationMenu.actions}
                            onActionSelect={(actionId) => {
                                migrationMenu.handlers[actionId]?.();
                                close();
                            }}
                            className="ui-context-menu-candidate"
                        />
                    ) : (
                        menu
                    )}
                </div>
            )}
        </ContextMenuContext.Provider>
    );
};

export const ContextMenu = ContextMenuImpl as ContextMenuComponent;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Separator = ContextMenuSeparator;
