/**
 * InfoSidebar - Collapsible side panel for extra context and docs
 */

import { useEffect, useCallback } from 'react';
import './InfoSidebar.css';

export interface SidebarLink {
    label: string;
    url: string;
    icon?: string;
}

interface InfoSidebarProps {
    title: string;
    content: string;
    links?: SidebarLink[];
    isOpen: boolean;
    onToggle: () => void;
    position?: 'left' | 'right';
    className?: string;
}

export function InfoSidebar({
    title,
    content,
    links,
    isOpen,
    onToggle,
    position = 'right',
    className = '',
}: InfoSidebarProps) {
    // Close on Escape
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
            onToggle();
        }
    }, [isOpen, onToggle]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <>
            {/* Overlay (only visible when open) */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onToggle}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Panel */}
            <aside
                className={`info-sidebar sidebar-${position} ${isOpen ? 'sidebar-open' : ''} ${className || ''}`}
                role="complementary"
                aria-label={title}
                aria-hidden={!isOpen}
            >
                <div className="sidebar-header">
                    <h3 className="sidebar-title">{title}</h3>
                    <button
                        className="sidebar-close"
                        onClick={onToggle}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                <div className="sidebar-content">
                    <p>{content}</p>
                </div>

                {links && links.length > 0 && (
                    <div className="sidebar-links">
                        <h4>Related Links</h4>
                        <ul>
                            {links.map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.icon && <span>{link.icon}</span>}
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>

            {/* Toggle button when closed */}
            {!isOpen && (
                <button
                    className={`sidebar-toggle sidebar-toggle-${position}`}
                    onClick={onToggle}
                    aria-label="Open info sidebar"
                >
                    {position === 'right' ? '◀' : '▶'}
                </button>
            )}
        </>
    );
}
