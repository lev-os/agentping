/**
 * EnrichmentPanel and QuickActionBar
 */

import { useState, useRef, useEffect } from 'react';
import type { Directive } from '@agentping/core';
import { DIRECTIVE_METADATA, createDirective, formatDirective } from '@agentping/core';
import './EnrichmentPanel.css';

// ============================================================================
// Icons
// ============================================================================

const Icons = {
    Plus: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    X: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Paperclip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
    MessageSquare: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    Focus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>,
    Skip: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>,
    AlertOctagon: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
};

// ============================================================================
// QuickActionBar
// ============================================================================

interface QuickAction {
    id: string;
    label: string;
    style: 'primary' | 'secondary' | 'danger' | 'ghost';
    shortcut?: string;
    onClick: () => void;
}

interface QuickActionBarProps {
    actions: QuickAction[];
}

export function QuickActionBar({ actions }: QuickActionBarProps) {
    if (actions.length === 0) return null;

    return (
        <div className="quick-action-bar">
            {actions.map((action) => (
                <button
                    key={action.id}
                    className={`btn-${action.style} btn-sm`}
                    onClick={action.onClick}
                    title={action.shortcut ? `Press ${action.shortcut}` : undefined}
                >
                    {action.label}
                    {action.shortcut && <span className="kbd-mini">{action.shortcut}</span>}
                </button>
            ))}
        </div>
    );
}

// ============================================================================
// EnrichmentPanel
// ============================================================================

interface FileAttachment {
    id: string;
    file: File;
    previewUrl?: string;
}

interface EnrichmentPanelProps {
    directives: Directive[];
    notes: string;
    onAddDirective: (directive: Directive) => void;
    onRemoveDirective: (index: number) => void;
    onNotesChange: (notes: string) => void;
    attachments?: FileAttachment[];
    onAddAttachment?: (file: File) => void;
    onRemoveAttachment?: (id: string) => void;
    suggestedDirectives?: string[];
    actions?: QuickAction[];
}

export function EnrichmentPanel({
    directives,
    notes,
    onAddDirective,
    onRemoveDirective,
    onNotesChange,
    attachments = [],
    onAddAttachment,
    onRemoveAttachment,
    suggestedDirectives = [],
    actions = [],
}: EnrichmentPanelProps) {
    const [showInput, setShowInput] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (showInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);

    const handleAddDirective = (type: string) => {
        if (showInput === type && inputValue.trim()) {
            const directive = createDirective(type as any, inputValue.trim());
            onAddDirective(directive);
            setInputValue('');
            setShowInput(null);
        } else {
            setShowInput(type);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            handleAddDirective(showInput!);
        } else if (e.key === 'Escape') {
            setShowInput(null);
            setInputValue('');
        }
    };

    // Drag-and-Drop Handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (onAddAttachment && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach(file => onAddAttachment(file));
        }
    };

    const suggestedTypes = suggestedDirectives.length > 0
        ? suggestedDirectives
        : ['focus_on', 'skip', 'constraint'];

    const getIconForType = (type: string) => {
        switch (type) {
            case 'focus_on': return <Icons.Focus />;
            case 'skip': return <Icons.Skip />;
            case 'constraint': return <Icons.AlertOctagon />;
            default: return <Icons.Plus />;
        }
    };

    return (
        <div
            className={`enrichment-container ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Overlay for Drop Zone */}
            {isDragging && (
                <div className="drag-overlay">
                    <div className="drag-message">
                        <Icons.Paperclip />
                        <span>Drop files to attach</span>
                    </div>
                </div>
            )}

            {/* Header / Actions Row */}
            <div className="enrichment-top-bar">
                <div className="enrichment-label">
                    <Icons.Paperclip />
                    <span>ENRICHMENT</span>
                </div>

                <div className="enrichment-actions-wrapper">
                    <QuickActionBar actions={actions} />
                </div>
            </div>

            {/* Directive Controls */}
            <div className="directives-section">
                <div className="directive-controls">
                    {suggestedTypes.map((type) => {
                        const isActive = showInput === type;
                        const meta = DIRECTIVE_METADATA[type as keyof typeof DIRECTIVE_METADATA];
                        const label = meta?.label || type;

                        return (
                            <button
                                key={type}
                                className={`directive-toggle ${isActive ? 'active' : ''}`}
                                onClick={() => handleAddDirective(type)}
                            >
                                {getIconForType(type)}
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Input Area */}
                {showInput && (
                    <div className="directive-input-anim">
                        <input
                            ref={inputRef}
                            type="text"
                            className="directive-text-input"
                            placeholder={DIRECTIVE_METADATA[showInput as keyof typeof DIRECTIVE_METADATA]?.inputPlaceholder || `Enter ${showInput} details...`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="input-actions">
                            <span className="kbd-hint">↵</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Chips (Directives + Attachments) */}
            {(directives.length > 0 || attachments.length > 0) && (
                <div className="active-directives-list">
                    {directives.map((dir, i) => (
                        <div key={`dir-${i}`} className="directive-chip-premium">
                            <span className="chip-label">{formatDirective(dir)}</span>
                            <button
                                className="chip-remove-btn"
                                onClick={() => onRemoveDirective(i)}
                            >
                                <Icons.X />
                            </button>
                        </div>
                    ))}
                    {attachments.map((att) => (
                        <div key={att.id} className="attachment-chip">
                            <Icons.Paperclip />
                            <span className="chip-label">{att.file.name}</span>
                            <span className="chip-size">({(att.file.size / 1024).toFixed(1)}KB)</span>
                            <button
                                className="chip-remove-btn"
                                onClick={() => onRemoveAttachment?.(att.id)}
                            >
                                <Icons.X />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Notes Area */}
            <div className="notes-area-wrapper">
                <textarea
                    className="notes-textarea"
                    placeholder="Add notes... (Drag & Drop files supported)"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows={1}
                />
            </div>
        </div>
    );
}
