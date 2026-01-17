import React from 'react';
import './MessageBubble.css';
import { AgentAvatar } from './AgentAvatar';

interface MessageBubbleProps {
    role: 'user' | 'assistant' | 'system';
    content: string;
    senderName?: string;
    avatarSrc?: string;
    timestamp?: string;
    className?: string;
}

export function MessageBubble({
    role,
    content,
    senderName,
    avatarSrc,
    timestamp,
    className = ''
}: MessageBubbleProps) {
    return (
        <div className={`message-bubble role-${role} ${className}`}>
            <div className="message-avatar">
                {role !== 'system' && (
                    <AgentAvatar
                        name={senderName || role}
                        src={avatarSrc}
                        size="sm"
                        status={role === 'assistant' ? 'idle' : undefined}
                    />
                )}
            </div>
            <div className="message-body">
                <div className="message-header">
                    <span className="message-sender">{senderName || (role === 'system' ? 'SYSTEM' : 'User')}</span>
                    {timestamp && <span className="message-time">{timestamp}</span>}
                </div>
                <div className="message-content">
                    {content}
                </div>
            </div>
        </div>
    );
}
