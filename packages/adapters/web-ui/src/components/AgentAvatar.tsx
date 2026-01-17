import React from 'react';
import './AgentAvatar.css';

interface AgentAvatarProps {
    name: string;
    src?: string;
    initials?: string;
    status?: 'idle' | 'speaking' | 'thinking' | 'offline';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function AgentAvatar({
    name,
    src,
    initials,
    status = 'idle',
    size = 'md',
    className = ''
}: AgentAvatarProps) {
    const getInitials = () => {
        if (initials) return initials;
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className={`agent-avatar size-${size} status-${status} ${className}`} title={name}>
            <div className="avatar-frame">
                {src ? (
                    <img src={src} alt={name} className="avatar-img" />
                ) : (
                    <div className="avatar-initials">{getInitials()}</div>
                )}
                <div className="avatar-ring" />
                {status === 'speaking' && <div className="avatar-waveform">
                    <span /><span /><span /><span />
                </div>}
            </div>
            <div className="avatar-status-dot" />
        </div>
    );
}
