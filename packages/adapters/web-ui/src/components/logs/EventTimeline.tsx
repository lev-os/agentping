
import React from 'react';
import './EventTimeline.css';

interface TimelineEvent {
    id: string;
    label: string;
    start: number; // 0-100 percentage
    width: number; // 0-100 percentage
    color?: string;
    metadata?: string;
}

interface EventTimelineProps {
    events: TimelineEvent[];
    title?: string;
    totalDurationMs?: number;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, title, totalDurationMs }) => {
    return (
        <div className="event-timeline">
            <div className="timeline-header">
                <h3 className="timeline-title">{title || 'EVENT TIMELINE'}</h3>
                {totalDurationMs && <span className="timeline-duration">{totalDurationMs}ms</span>}
            </div>
            <div className="timeline-container">
                {events.map((event, index) => (
                    <div key={event.id} className="timeline-row">
                        <div className="row-label" title={event.label}>{event.label}</div>
                        <div className="row-track">
                            <div
                                className="timeline-bar"
                                style={{
                                    left: `${event.start}%`,
                                    width: `${event.width}%`,
                                    backgroundColor: event.color || 'var(--accent-primary)'
                                }}
                                title={event.metadata}
                            >
                                {event.width > 10 && <span className="bar-meta">{event.metadata}</span>}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Grid lines */}
                <div className="timeline-grid">
                    {[0, 20, 40, 60, 80, 100].map(p => (
                        <div key={p} className="grid-line" style={{ left: `${p}%` }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
