/**
 * VoiceConsole Component
 *
 * Floating voice control with:
 * - Ctrl+Shift+V toggle
 * - Preset command chips
 * - Voice input indicator
 * - Response display area
 */

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X, Send } from 'lucide-react';
import './VoiceConsole.css';

interface VoiceConsoleProps {
    isOpen?: boolean;
    onToggle?: () => void;
    onCommand?: (command: string) => void;
    presetCommands?: string[];
    isListening?: boolean;
    transcript?: string;
    response?: string;
    className?: string;
}

const DEFAULT_PRESETS = [
    'Show agent status',
    'List active tasks',
    'Clear file locks',
    'Sync workspace',
    'Open diagnostics',
    'Show recent logs',
];

export function VoiceConsole({
    isOpen = false,
    onToggle,
    onCommand,
    presetCommands = DEFAULT_PRESETS,
    isListening = false,
    transcript = '',
    response = '',
    className = '',
}: VoiceConsoleProps) {
    const [localIsOpen, setLocalIsOpen] = useState(isOpen);
    const [textInput, setTextInput] = useState('');
    const consoleRef = useRef<HTMLDivElement>(null);

    // Sync with external state
    useEffect(() => {
        setLocalIsOpen(isOpen);
    }, [isOpen]);

    // Keyboard shortcut: Ctrl+Shift+V
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                handleToggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Click outside to close
    useEffect(() => {
        if (!localIsOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (consoleRef.current && !consoleRef.current.contains(e.target as Node)) {
                handleToggle();
            }
        };

        setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [localIsOpen]);

    const handleToggle = () => {
        const newState = !localIsOpen;
        setLocalIsOpen(newState);
        onToggle?.();
    };

    const handlePresetClick = (command: string) => {
        onCommand?.(command);
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (textInput.trim()) {
            onCommand?.(textInput.trim());
            setTextInput('');
        }
    };

    if (!localIsOpen) {
        return (
            <button
                className={`voice-console-trigger ${className}`}
                onClick={handleToggle}
                title="Voice Console (Ctrl+Shift+V)"
            >
                <Mic size={20} />
            </button>
        );
    }

    return (
        <div ref={consoleRef} className={`voice-console ${className}`}>
            <div className="console-header">
                <div className="console-title">
                    <Sparkles size={16} />
                    <span>Voice Console</span>
                </div>
                <button
                    className="console-close"
                    onClick={handleToggle}
                    title="Close (Ctrl+Shift+V)"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="console-body">
                {/* Voice Input Indicator */}
                <div className={`voice-indicator ${isListening ? 'listening' : ''}`}>
                    {isListening ? (
                        <>
                            <div className="listening-animation">
                                <span className="pulse" />
                                <span className="pulse" />
                                <span className="pulse" />
                            </div>
                            <MicOff size={20} />
                            <span>Listening...</span>
                        </>
                    ) : (
                        <>
                            <Mic size={20} />
                            <span>Ready</span>
                        </>
                    )}
                </div>

                {/* Transcript Display */}
                {transcript && (
                    <div className="transcript-display">
                        <label>You said:</label>
                        <p>{transcript}</p>
                    </div>
                )}

                {/* Response Display */}
                {response && (
                    <div className="response-display">
                        <label>Response:</label>
                        <p>{response}</p>
                    </div>
                )}

                {/* Preset Commands */}
                <div className="preset-commands">
                    <label>Quick Commands</label>
                    <div className="command-chips">
                        {presetCommands.map((command, index) => (
                            <button
                                key={index}
                                className="command-chip"
                                onClick={() => handlePresetClick(command)}
                            >
                                {command}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Text Input */}
                <form className="text-input-form" onSubmit={handleTextSubmit}>
                    <input
                        type="text"
                        className="text-input"
                        placeholder="Type a command..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={!textInput.trim()}
                    >
                        <Send size={16} />
                    </button>
                </form>

                {/* Keyboard Hint */}
                <div className="keyboard-hint">
                    <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> to toggle
                </div>
            </div>
        </div>
    );
}
