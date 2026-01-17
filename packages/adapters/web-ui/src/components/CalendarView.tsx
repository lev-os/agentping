import React, { useState, useMemo } from 'react';
import './CalendarView.css';

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

interface CalendarViewProps {
    /** @deprecated Use initialDate instead */
    month?: string;
    initialDate?: Date;
    events?: CalendarEvent[];
    onDateSelect?: (date: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
    month: monthStr,
    initialDate = new Date(),
    events = [],
    onDateSelect
}) => {
    // If monthStr is provided (legacy prop), try to parse it, otherwise use initialDate
    const startStateDate = useMemo(() => {
        if (monthStr) {
            const parsed = new Date(monthStr);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        return initialDate;
    }, [monthStr, initialDate]);

    const [currentDate, setCurrentDate] = useState<Date>(startStateDate);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDate(now.toISOString().split('T')[0]);
        if (onDateSelect) onDateSelect(now.toISOString().split('T')[0]);
    };

    const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Grid Generation
    const gridDays = useMemo(() => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun

        // Previous Month Padding
        const prevMonthDays = [];
        const prevMonthLastDate = new Date(year, month, 0).getDate();
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            prevMonthDays.push({
                date: new Date(year, month - 1, prevMonthLastDate - i),
                isCurrentMonth: false
            });
        }

        // Current Month
        const currentMonthDays = [];
        for (let i = 1; i <= daysInMonth; i++) {
            currentMonthDays.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next Month Padding
        const nextMonthDays = [];
        const totalUsed = prevMonthDays.length + currentMonthDays.length;
        const totalCells = totalUsed > 35 ? 42 : 35; // Expand to 6 rows if needed
        for (let i = 1; i <= totalCells - totalUsed; i++) {
            nextMonthDays.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    }, [year, month]);

    const handleDateClick = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        if (onDateSelect) onDateSelect(dateStr);
        // If clicked other month, switch view
        if (date.getMonth() !== month) {
            setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
        }
    };

    const isToday = (date: Date) => {
        const now = new Date();
        return date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
    };

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return events.filter(e => e.date === dateStr);
    };

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <div className="calendar-title">
                    <span style={{ opacity: 0.5 }}>SCHEDULE //</span> {monthLabel}
                </div>
                <div className="calendar-controls">
                    <button className="calendar-btn" onClick={goToPrevMonth} title="Previous Month">←</button>
                    <button className="calendar-btn today" onClick={goToToday} title="Go to Today">Today</button>
                    <button className="calendar-btn" onClick={goToNextMonth} title="Next Month">→</button>
                </div>
            </div>

            <div className="calendar-grid-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="calendar-day-label">{d}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {gridDays.map((day, idx) => {
                    const dateStr = day.date.toISOString().split('T')[0];
                    const dayEvents = getEventsForDate(day.date);
                    const isSelected = selectedDate === dateStr;

                    return (
                        <div
                            key={idx}
                            className={`
                                calendar-cell 
                                ${!day.isCurrentMonth ? 'other-month' : ''}
                                ${isToday(day.date) ? 'today' : ''}
                                ${isSelected ? 'selected' : ''}
                            `}
                            onClick={() => handleDateClick(day.date)}
                        >
                            <div className="calendar-date-number">{day.date.getDate()}</div>
                            {dayEvents.map(e => (
                                <div key={e.id} className={`calendar-event type-${e.type || 'default'}`}>
                                    {e.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
