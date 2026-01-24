/**
 * Welcome Screen Component
 *
 * Empty state shown when no messages exist.
 */

import { Bot, Loader2, Sparkles, Code, Palette, FileCode } from 'lucide-react';

export interface WelcomeScreenProps {
    onStartSession: () => void;
    isLoading?: boolean;
}

const QUICK_ACTIONS = [
    {
        icon: <Palette size={16} />,
        title: 'Design a Component',
        prompt: 'Design a modern card component with hover effects'
    },
    {
        icon: <Code size={16} />,
        title: 'Generate Code',
        prompt: 'Create a responsive navigation bar'
    },
    {
        icon: <FileCode size={16} />,
        title: 'Refactor Existing',
        prompt: 'Improve the code structure and performance'
    }
];

export function WelcomeScreen({ onStartSession, isLoading = false }: WelcomeScreenProps) {
    return (
        <div className="chat-welcome">
            <div className="welcome-content animate-in">
                <div className="empty-icon-container">
                    <Bot size={64} strokeWidth={1} />
                    <Sparkles size={20} className="welcome-sparkle" />
                </div>

                <h3>Welcome to Studio</h3>
                <p>
                    Start a session to design components, generate UI, or refactor
                    existing plans with Claude Code.
                </p>

                <button
                    className="start-btn-large"
                    onClick={onStartSession}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="spinning" />
                            <span>Starting...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Start Designing</span>
                        </>
                    )}
                </button>

                <div className="quick-actions">
                    <span className="quick-actions-label">Quick start:</span>
                    {QUICK_ACTIONS.map((action, idx) => (
                        <button
                            key={idx}
                            className="quick-action-btn"
                            onClick={onStartSession}
                            disabled={isLoading}
                            title={action.prompt}
                        >
                            {action.icon}
                            <span>{action.title}</span>
                        </button>
                    ))}
                </div>

                <div className="keyboard-hints">
                    <span><kbd>Mod</kbd> + <kbd>K</kbd> New session</span>
                    <span><kbd>Mod</kbd> + <kbd>F</kbd> Search messages</span>
                    <span><kbd>Enter</kbd> Send message</span>
                </div>
            </div>
        </div>
    );
}
