import React, { useState, useEffect } from 'react';
import './WorldClock.css';

interface ClockProps {
    timezone: string;
    label: string;
}

interface WorldClockProps {
    clocks: ClockProps[];
    className?: string;
}

export function WorldClock({
    clocks,
    className = ''
}: WorldClockProps) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date, timezone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone,
            hour12: false
        }).format(date);
    };

    const formatDate = (date: Date, timezone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            timeZone: timezone
        }).format(date);
    };

    return (
        <div className={`world-clock-container ${className}`}>
            {clocks.map((clock) => (
                <div key={clock.timezone} className="clock-item">
                    <div className="clock-label">{clock.label}</div>
                    <div className="clock-time">{formatTime(time, clock.timezone)}</div>
                    <div className="clock-date">{formatDate(time, clock.timezone)}</div>
                </div>
            ))}
        </div>
    );
}
