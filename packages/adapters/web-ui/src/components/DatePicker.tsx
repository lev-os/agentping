import { useState, useRef, useEffect } from 'react';
import './DatePicker.css';

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date) => void;
    label?: string;
    placeholder?: string;
}

export function DatePicker({ value, onChange, label, placeholder = 'Select date...' }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [viewDate, setViewDate] = useState(value || new Date());

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        onChange(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
        const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const isSelected = value && date.toDateString() === value.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="date-picker-container" ref={containerRef}>
            {label && <label className="cyber-label">{label}</label>}
            <button
                className={`date-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span style={{ opacity: value ? 1 : 0.6 }}>
                    {value ? value.toLocaleDateString() : placeholder}
                </span>
                <span className="date-icon">📅</span>
            </button>

            {isOpen && (
                <div className="date-calendar">
                    <div className="calendar-header">
                        <button onClick={handlePrevMonth}>&lt;</button>
                        <span style={{ fontWeight: 'bold' }}>
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextMonth}>&gt;</button>
                    </div>
                    <div className="calendar-grid">
                        <div className="calendar-day-header">Su</div>
                        <div className="calendar-day-header">Mo</div>
                        <div className="calendar-day-header">Tu</div>
                        <div className="calendar-day-header">We</div>
                        <div className="calendar-day-header">Th</div>
                        <div className="calendar-day-header">Fr</div>
                        <div className="calendar-day-header">Sa</div>
                        {renderCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
}
