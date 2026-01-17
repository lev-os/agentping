import React from 'react';
import './Timeline.css';

interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description?: string;
    type?: 'info' | 'marker' | 'milestone';
}

interface TimelineProps {
    events: TimelineEvent[];
    onEventClick?: (event: TimelineEvent) => void;
}

export function Timeline({ events, onEventClick }: TimelineProps) {
    return (
        <div className="timeline-wrapper">
            <div className="timeline-track">
                {/* Horizontal Line */}
                <div className="timeline-line" />

                {events.map((event, index) => (
                    <div
                        key={event.id}
                        className={`timeline-item ${event.type || 'info'}`}
                        onClick={() => onEventClick?.(event)}
                    >
                        <div className="timeline-dot-wrapper">
                            <div className="timeline-dot" />
                            <div className="timeline-date">{event.date}</div>
                        </div>
                        <div className="timeline-content card-glass">
                            <h4 className="timeline-title">{event.title}</h4>
                            {event.description && <p className="timeline-desc">{event.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
