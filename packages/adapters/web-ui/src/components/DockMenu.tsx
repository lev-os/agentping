import React, { useRef } from 'react';
import './DockMenu.css';

interface DockItem {
    id: string;
    icon: string;
    label: string;
}

interface DockMenuProps {
    items: DockItem[];
    onSelect?: (id: string) => void;
}

export function DockMenu({ items, onSelect }: DockMenuProps) {
    const dockRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const dock = dockRef.current;
        if (!dock) return;

        const buttons = dock.querySelectorAll('.dock-item');
        const dockRect = dock.getBoundingClientRect();

        // Basic magnification logic based on cursor X
        // In a real robust implementation, we'd use more complex per-item math.
        // For CSS-only approach, we can't easily do the "genie" wave perfectly,
        // but we can do simple scale on hover.
        // Let's rely on CSS :hover + siblings for a "wave" effect simulation.
    };

    return (
        <div className="dock-container">
            <div className="dock-glass" ref={dockRef} onMouseMove={handleMouseMove}>
                {items.map(item => (
                    <button
                        key={item.id}
                        className="dock-item"
                        onClick={() => onSelect?.(item.id)}
                        aria-label={item.label}
                    >
                        <span className="dock-icon">{item.icon}</span>
                        <span className="dock-tooltip">{item.label}</span>
                        <div className="dock-dot"></div>
                    </button>
                ))}
            </div>
        </div>
    );
}
