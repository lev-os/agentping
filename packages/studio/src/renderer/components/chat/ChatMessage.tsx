/**
 * Chat Message Component
 *
 * Renders individual messages with markdown, code highlighting, timestamps, and copy functionality.
 */

import { useState } from 'react';
import { User, Bot, Terminal, Sparkles, Copy, Check, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ToolCard, ToolInfo } from './ToolCard';
import { CopyButton } from '../ui';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    thought?: string;
    toolCalls?: ToolInfo[];
    isThinking?: boolean;
}

export interface ChatMessageProps {
    message: Message;
    activeSession: string | null;
    onResolveTool?: (sessionId: string, toolId: string, approved: boolean) => void;
    showTimestamps?: boolean;
}

function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than a minute
    if (diff < 60000) return 'just now';

    // Less than an hour
    if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins}m ago`;
    }

    // Same day - show time
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Different day - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function MessageAvatar({ role }: { role: string }) {
    const Icon = role === 'user' ? User : role === 'system' ? Terminal : Bot;
    return (
        <div className={`message-avatar message-avatar-${role}`} aria-hidden="true">
            <Icon size={14} />
        </div>
    );
}

interface CodeBlockProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}

function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const code = String(children).replace(/\n$/, '');

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!inline && match) {
        return (
            <div className="code-block-wrapper">
                <div className="code-block-header">
                    <span className="code-language">{match[1]}</span>
                    <button
                        className="code-copy-btn"
                        onClick={handleCopy}
                        aria-label={copied ? 'Copied!' : 'Copy code'}
                    >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
                <SyntaxHighlighter
                    {...props}
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                        margin: 0,
                        borderRadius: '0 0 6px 6px',
                        fontSize: '12px',
                        maxHeight: '400px',
                        overflow: 'auto'
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        );
    }

    return (
        <code className={className} {...props}>
            {children}
        </code>
    );
}

export function ChatMessage({
    message,
    activeSession,
    onResolveTool,
    showTimestamps = true
}: ChatMessageProps) {
    const { role, content, thought, toolCalls, timestamp } = message;

    return (
        <article
            className={`chat-message chat-message-${role} animate-in`}
            aria-label={`${role} message`}
        >
            <MessageAvatar role={role} />

            <div className="chat-message-content">
                {/* Message header with timestamp and copy */}
                <div className="message-header">
                    <span className="message-role">
                        {role === 'user' ? 'You' : role === 'assistant' ? 'Claude' : 'System'}
                    </span>
                    {showTimestamps && (
                        <span className="message-timestamp" title={timestamp.toLocaleString()}>
                            <Clock size={10} />
                            {formatTimestamp(timestamp)}
                        </span>
                    )}
                    {content && role !== 'system' && (
                        <CopyButton text={content} size={12} className="message-copy-btn" />
                    )}
                </div>

                {/* Thoughts (Collapsible) */}
                {thought && (
                    <details className="message-thought">
                        <summary>
                            <Sparkles size={12} />
                            <span>Thinking Process</span>
                        </summary>
                        <div className="thought-content">
                            <ReactMarkdown>{thought}</ReactMarkdown>
                        </div>
                    </details>
                )}

                {/* Primary Content */}
                {content && (
                    <div className="message-text">
                        {role === 'system' ? (
                            <div className="system-text">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </div>
                        ) : (
                            <ReactMarkdown
                                components={{
                                    code: CodeBlock as any
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        )}
                    </div>
                )}

                {/* Tool Cards */}
                {toolCalls && toolCalls.map((tool, idx) => (
                    <ToolCard
                        key={`${tool.id || 'tool'}-${idx}`}
                        tool={tool}
                        onResolve={
                            tool.status === 'pending_approval' && activeSession && onResolveTool
                                ? (toolId, approved) => onResolveTool(activeSession, toolId, approved)
                                : undefined
                        }
                    />
                ))}
            </div>
        </article>
    );
}

export function TypingIndicator() {
    return (
        <div className="chat-message chat-message-assistant chat-message-loading" aria-live="polite">
            <div className="message-avatar message-avatar-assistant">
                <Bot size={14} />
            </div>
            <div className="typing-indicator" aria-label="Claude is typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}
