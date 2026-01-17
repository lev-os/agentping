import React from 'react';
import './ActiveSessions.css';

interface Session {
    id: string;
    user: string;
    ip: string;
    duration: string;
    device: string;
    status: 'active' | 'idle';
}

interface ActiveSessionsProps {
    sessions: Session[];
}

export function ActiveSessions({ sessions }: ActiveSessionsProps) {
    return (
        <div className="active-sessions-list">
            {sessions.map(session => (
                <div key={session.id} className="session-item">
                    <div className={`session-status ${session.status}`} />
                    <div className="session-info">
                        <div className="session-user">{session.user}</div>
                        <div className="session-meta">{session.ip} • {session.device}</div>
                    </div>
                    <div className="session-duration">{session.duration}</div>
                    <button className="session-kill-btn" title="Terminate Session">×</button>
                </div>
            ))}
        </div>
    );
}
