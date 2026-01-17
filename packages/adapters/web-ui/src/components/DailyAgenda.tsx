import React from 'react';
import './DailyAgenda.css';

interface AgendaItem {
    id: string;
    title: string;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    location?: string;
    color?: string;
    description?: string;
}

interface DailyAgendaProps {
    date?: Date;
    items: AgendaItem[];
    onItemClick?: (id: string) => void;
}

export const DailyAgenda: React.FC<DailyAgendaProps> = ({
    date = new Date(),
    items,
    onItemClick
}) => {
    // Sort items by start time
    const sortedItems = [...items].sort((a, b) => a.startTime.localeCompare(b.startTime));

    const formatDate = (d: Date) => {
        return {
            weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
            day: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'long' })
        };
    };

    const d = formatDate(date);

    return (
        <div className="daily-agenda">
            <div className="daily-header">
                <div className="daily-date">
                    <span className="daily-day-name">{d.weekday}</span>
                    <span className="daily-day-num">{d.month} {d.day}</span>
                </div>
                {date.toDateString() === new Date().toDateString() && (
                    <div className="daily-now-badge">TODAY</div>
                )}
            </div>

            <div className="agenda-list">
                {sortedItems.length === 0 ? (
                    <div className="agenda-empty">No events scheduled for today</div>
                ) : (
                    sortedItems.map(item => (
                        <div
                            key={item.id}
                            className="agenda-item"
                            style={{ '--item-color': item.color || 'var(--accent-primary)' } as React.CSSProperties}
                            onClick={() => onItemClick && onItemClick(item.id)}
                        >
                            <div className="agenda-time">
                                <span>{item.startTime}</span>
                                <span className="agenda-duration">
                                    {/* Simple duration text or end time? let's show end time for clarity */}
                                    - {item.endTime}
                                </span>
                            </div>
                            <div className="agenda-content">
                                <div className="agenda-title">{item.title}</div>
                                {item.location && (
                                    <div className="agenda-location">
                                        📍 {item.location}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
