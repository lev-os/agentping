import React, { useState, useEffect } from 'react';
import './CommandPalette.css';

interface CommandItem {
    id: string;
    label: string;
    shortcut?: string;
    group: string;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const filtered = commands.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase())
    );

    // Grouping
    const groups: Record<string, CommandItem[]> = {};
    filtered.forEach(c => {
        if (!groups[c.group]) groups[c.group] = [];
        groups[c.group].push(c);
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose(); // Toggle logic handled by parent usually
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" onClick={onClose}>
            <div className="command-palette" onClick={e => e.stopPropagation()}>
                <div className="cmd-input-wrapper">
                    <span className="cmd-icon">⌘</span>
                    <input
                        autoFocus
                        className="cmd-input"
                        placeholder="Type a command..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <div className="cmd-results">
                    {Object.keys(groups).map(group => (
                        <div key={group}>
                            <div className="cmd-group-title">{group}</div>
                            {groups[group].map((cmd, i) => (
                                <div key={cmd.id} className="cmd-item" onClick={() => { cmd.action(); onClose(); }}>
                                    <span>{cmd.label}</span>
                                    {cmd.shortcut && <span className="cmd-shortcut">{cmd.shortcut}</span>}
                                </div>
                            ))}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>
                            No results found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
