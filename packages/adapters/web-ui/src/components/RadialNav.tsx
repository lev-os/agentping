import React, { useState } from 'react';
import './RadialNav.css';

interface RadialItem {
    id: string;
    icon: string;
    label: string;
}

interface RadialNavProps {
    items: RadialItem[];
    centerIcon?: string;
    onSelect?: (id: string) => void;
}

export function RadialNav({ items, centerIcon = '☰', onSelect }: RadialNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const radius = 80; // Distance from center

    return (
        <div className="radial-container">
            {/* Center Toggle */}
            <button
                className={`radial-center ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '×' : centerIcon}
            </button>

            {/* Menu Items */}
            <div className={`radial-menu ${isOpen ? 'open' : ''}`}>
                {items.map((item, index) => {
                    const angle = (index * (360 / items.length)) * (Math.PI / 180);
                    // Start from top (-90 deg usually), but flex centers it.
                    // Let's do CSS properties for positioning
                    const x = Math.cos(angle - Math.PI / 2) * radius;
                    const y = Math.sin(angle - Math.PI / 2) * radius;

                    return (
                        <button
                            key={item.id}
                            className="radial-item"
                            style={{
                                transform: isOpen ? `translate(${x}px, ${y}px)` : 'translate(0,0)',
                                opacity: isOpen ? 1 : 0
                            }}
                            onClick={() => {
                                onSelect?.(item.id);
                                setIsOpen(false);
                            }}
                            title={item.label}
                        >
                            {item.icon}
                        </button>
                    );
                })}
            </div>

            <div className="radial-backdrop" onClick={() => setIsOpen(false)} style={{ pointerEvents: isOpen ? 'auto' : 'none' }}></div>
        </div>
    );
}
