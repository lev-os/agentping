import React from 'react';
import './TeamRoster.css';

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    status: 'online' | 'offline' | 'busy' | 'away';
    avatar?: string;
    location?: string;
}

interface TeamRosterProps {
    members: TeamMember[];
    className?: string;
}

export function TeamRoster({ members, className = '' }: TeamRosterProps) {
    const getStatusLabel = (status: TeamMember['status']) => {
        switch (status) {
            case 'online': return 'Online';
            case 'offline': return 'Offline';
            case 'busy': return 'Busy';
            case 'away': return 'Away';
            default: return status;
        }
    };

    return (
        <div className={`team-roster ${className}`}>
            {members.map((member) => (
                <div key={member.id} className="roster-item">
                    <div className={`roster-avatar status-${member.status}`}>
                        {member.avatar ? (
                            <img src={member.avatar} alt={member.name} />
                        ) : (
                            <span className="avatar-placeholder">{member.name.charAt(0)}</span>
                        )}
                        <div className="status-dot" title={getStatusLabel(member.status)} />
                    </div>
                    <div className="roster-info">
                        <div className="roster-name-row">
                            <span className="roster-name">{member.name}</span>
                            {member.location && <span className="roster-location">{member.location}</span>}
                        </div>
                        <div className="roster-role">{member.role}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
