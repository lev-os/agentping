import React from 'react';
import './EventCard.css';

interface Attendee {
    id: string;
    name: string;
    avatarUrl?: string;
    initials?: string;
}

interface EventCardProps {
    title: string;
    time: string; // "10:00 AM - 11:00 AM"
    date: string; // "Mon, Jan 15"
    description?: string;
    color?: string;
    attendees?: Attendee[];
    onJoin?: () => void;
    onEdit?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
    title,
    time,
    date,
    description,
    color,
    attendees = [],
    onJoin,
    onEdit
}) => {
    return (
        <div className="event-card" style={{ '--event-color': color } as React.CSSProperties}>
            <div className="event-card-banner"></div>
            <div className="event-card-content">
                <div className="event-card-time">
                    <span>{date}</span> • <span>{time}</span>
                </div>
                <h3 className="event-card-title">{title}</h3>
                {description && <p className="event-card-description">{description}</p>}

                {attendees.length > 0 && (
                    <div className="event-attendees">
                        {attendees.slice(0, 5).map(attendee => (
                            <div key={attendee.id} className="attendee-avatar" title={attendee.name}>
                                {attendee.avatarUrl ? (
                                    <img src={attendee.avatarUrl} alt={attendee.name} />
                                ) : (
                                    attendee.initials || attendee.name.substring(0, 2)
                                )}
                            </div>
                        ))}
                        {attendees.length > 5 && (
                            <div className="attendee-avatar">+{attendees.length - 5}</div>
                        )}
                    </div>
                )}
            </div>
            <div className="event-card-actions">
                <button className="event-btn primary" onClick={onJoin}>Join</button>
                <button className="event-btn" onClick={onEdit}>Edit</button>
            </div>
        </div>
    );
};
