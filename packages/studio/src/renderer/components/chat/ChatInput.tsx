/**
 * Chat Input Component
 *
 * Message input with keyboard shortcuts, slash commands, and context actions.
 */

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Layout, Paperclip, Slash, AtSign, AlertTriangle } from 'lucide-react';
import { Kbd } from '../ui';

export interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onSendContext?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    placeholder?: string;
    turnCount?: { current: number; max: number };
}

const SLASH_COMMANDS = [
    { command: '/help', description: 'Show available commands' },
    { command: '/clear', description: 'Clear chat history' },
    { command: '/commit', description: 'Create a git commit' },
    { command: '/review', description: 'Review code changes' },
    { command: '/plan', description: 'Create implementation plan' },
    { command: '/test', description: 'Run tests' },
    { command: '/settings', description: 'Open settings' },
];

export function ChatInput({
    value,
    onChange,
    onSend,
    onSendContext,
    disabled = false,
    isLoading = false,
    placeholder = "Ask Claude to design or edit...",
    turnCount
}: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showCommands, setShowCommands] = useState(false);
    const [commandFilter, setCommandFilter] = useState('');

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [value]);

    // Check for slash command trigger
    useEffect(() => {
        if (value.startsWith('/')) {
            setShowCommands(true);
            setCommandFilter(value.slice(1).toLowerCase());
        } else {
            setShowCommands(false);
            setCommandFilter('');
        }
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && !isLoading && value.trim()) {
                onSend();
            }
        }

        // Close command menu on Escape
        if (e.key === 'Escape' && showCommands) {
            setShowCommands(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const insertCommand = (command: string) => {
        onChange(command + ' ');
        setShowCommands(false);
        textareaRef.current?.focus();
    };

    const filteredCommands = SLASH_COMMANDS.filter(
        cmd => cmd.command.toLowerCase().includes(commandFilter) ||
               cmd.description.toLowerCase().includes(commandFilter)
    );

    const showTurnWarning = turnCount && turnCount.current >= 15;

    return (
        <div className="chat-input-container">
            {/* Turn count warning */}
            {showTurnWarning && (
                <div className="turn-warning animate-in" role="alert">
                    <AlertTriangle size={12} />
                    <span>
                        High turn count ({turnCount.current}/{turnCount.max}).
                        Consider starting a new session soon.
                    </span>
                </div>
            )}

            {/* Slash command menu */}
            {showCommands && filteredCommands.length > 0 && (
                <div className="command-menu" role="listbox">
                    {filteredCommands.map(cmd => (
                        <button
                            key={cmd.command}
                            className="command-item"
                            onClick={() => insertCommand(cmd.command)}
                            role="option"
                        >
                            <Slash size={12} />
                            <span className="command-name">{cmd.command}</span>
                            <span className="command-desc">{cmd.description}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="input-wrapper">
                {/* Context button */}
                {onSendContext && (
                    <button
                        className="chat-context-btn"
                        onClick={onSendContext}
                        disabled={disabled || isLoading}
                        title="Send Canvas State as context"
                        aria-label="Send canvas state"
                    >
                        <Layout size={18} />
                    </button>
                )}

                {/* Main textarea */}
                <textarea
                    ref={textareaRef}
                    className="chat-input"
                    placeholder={disabled ? "Start a session to chat" : placeholder}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isLoading}
                    rows={1}
                    aria-label="Message input"
                />

                {/* Keyboard hint */}
                <div className="input-hint">
                    <Kbd keys="Enter" /> to send
                </div>

                {/* Send button */}
                <button
                    className="chat-send-btn"
                    onClick={onSend}
                    disabled={disabled || !value.trim() || isLoading}
                    aria-label="Send message"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
}
