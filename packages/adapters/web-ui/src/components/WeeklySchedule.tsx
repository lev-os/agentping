import React, { useEffect, useState, useRef } from 'react';
import './WeeklySchedule.css';

export interface WeeklyEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string;
}

interface WeeklyScheduleProps {
    events: WeeklyEvent[];
    startDate?: Date; // Week starts from this date
    onEventClick?: (id: string) => void;
}

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
    events,
    startDate = new Date(),
    onEventClick
}) => {
    // Calculate week start (Sunday)
    const getWeekStart = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.setDate(diff));
    };

    const weekStart = getWeekStart(startDate);
    const days = [...Array(7)].map((_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to 9 AM initially
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 60 * 9;
        }
    }, []);

    const hours = [...Array(24)].map((_, i) => i);

    const getEventStyle = (event: WeeklyEvent, dayStart: Date) => {
        const startHour = event.start.getHours() + event.start.getMinutes() / 60;
        const endHour = event.end.getHours() + event.end.getMinutes() / 60;
        const duration = endHour - startHour;

        return {
            top: `${startHour * 60}px`,
            height: `${duration * 60}px`,
            backgroundColor: event.color ? `${event.color}33` : undefined, // Add transparency
            borderLeftColor: event.color
        };
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear();
    };

    return (
        <div className="weekly-schedule">
            <div className="weekly-header">
                <div className="time-gutter-header"></div>
                <div className="days-header">
                    {days.map((day, i) => (
                        <div key={i} className={`day-header-cell ${isSameDay(day, new Date()) ? 'today' : ''}`}>
                            <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className="day-num">{day.getDate()}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="weekly-body" ref={scrollRef}>
                <div className="time-gutter">
                    {hours.map(h => (
                        <div key={h} className="time-slot-label">
                            {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                        </div>
                    ))}
                </div>
                <div className="days-grid" style={{ height: 24 * 60 }}>
                    {days.map((day, i) => (
                        <div key={i} className="day-column">
                            {/* Filter events for this day */}
                            {events.filter(e => isSameDay(e.start, day)).map(e => (
                                <div
                                    key={e.id}
                                    className="weekly-event"
                                    style={getEventStyle(e, day)}
                                    onClick={() => onEventClick && onEventClick(e.id)}
                                >
                                    <div className="event-title">{e.title}</div>
                                    <div className="event-time">
                                        {e.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    {/* Current time indicator if in view */}
                    {/* (Simplified: only showing strictly vertical line, hard to place in correct column dynamically without complex logic, omitting for MVP or ensuring it only renders on Today's column) */}
                </div>
            </div>
        </div>
    );
};
