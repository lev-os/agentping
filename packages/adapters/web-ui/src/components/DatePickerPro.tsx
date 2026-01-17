import React, { useState, useRef, useEffect } from 'react';
import './DatePickerPro.css';

interface DatePickerProProps {
    label?: string;
    value?: Date | [Date, Date]; // Single date or Range
    onChange?: (date: Date | [Date, Date]) => void;
    range?: boolean;
    placeholder?: string;
}

export const DatePickerPro: React.FC<DatePickerProProps> = ({
    label,
    value,
    onChange,
    range = false,
    placeholder = "Select Date"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date()); // Month being viewed
    // Internal state handling for uncontrolled mode could be added, but assuming controlled for now or simple internal

    // Normalize value to array for easier handling
    const selectedDates = Array.isArray(value) ? value : (value ? [value] : []);

    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const days = [];
        // Pad prev
        for (let i = 0; i < firstDay; i++) {
            days.push({
                date: new Date(year, month, -firstDay + 1 + i),
                currentMonth: false
            });
        }
        // Current
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                currentMonth: true
            });
        }
        // Next (fill to 42)
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                currentMonth: false
            });
        }
        return days;
    };

    const isSelected = (date: Date) => {
        return selectedDates.some(d => d.toDateString() === date.toDateString());
    };

    const isInRange = (date: Date) => {
        if (!range || selectedDates.length !== 2) return false;
        const start = selectedDates[0];
        const end = selectedDates[1];
        return date > start && date < end;
    };

    const isRangeStart = (date: Date) => range && selectedDates[0] && date.toDateString() === selectedDates[0].toDateString();
    const isRangeEnd = (date: Date) => range && selectedDates[1] && date.toDateString() === selectedDates[1].toDateString();

    const handleDateClick = (date: Date) => {
        if (!range) {
            if (onChange) onChange(date);
            setIsOpen(false);
        } else {
            // Range logic
            let newRange: [Date, Date] | Date[] = [...selectedDates];
            if (newRange.length === 2) {
                newRange = [date]; // Reset
            } else if (newRange.length === 1) {
                if (date < newRange[0]) {
                    newRange = [date, newRange[0]];
                } else {
                    newRange = [newRange[0], date];
                }
                if (onChange) onChange(newRange as [Date, Date]);
                setIsOpen(false);
            } else {
                newRange = [date];
            }
            // Update internal controlled state logic (assumed parent updates props)
        }
    };

    const formatDisplay = () => {
        if (selectedDates.length === 0) return placeholder;
        if (!range) return selectedDates[0].toLocaleDateString();
        if (selectedDates.length === 1) return `${selectedDates[0].toLocaleDateString()} - ...`;
        return `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`;
    };

    const days = getDaysInMonth(viewDate);

    return (
        <div className="date-picker-pro" ref={containerRef}>
            {label && <div className="input-label">{label}</div>}
            <div className={`picker-input-group ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span className="picker-icon">📅</span>
                <span className={`picker-display-value ${selectedDates.length === 0 ? 'placeholder' : ''}`}>
                    {formatDisplay()}
                </span>
            </div>

            {isOpen && (
                <div className="picker-dropdown">
                    {range && (
                        <div className="picker-shortcuts">
                            <button className="shortcut-btn" onClick={() => {
                                const today = new Date();
                                const weekLater = new Date();
                                weekLater.setDate(today.getDate() + 7);
                                if (onChange) onChange([today, weekLater]);
                                setIsOpen(false);
                            }}>Next 7 Days</button>
                            <button className="shortcut-btn" onClick={() => {
                                const today = new Date();
                                const nextMonth = new Date();
                                nextMonth.setMonth(today.getMonth() + 1);
                                if (onChange) onChange([today, nextMonth]);
                                setIsOpen(false);
                            }}>Next Month</button>
                        </div>
                    )}
                    <div className="picker-calendar">
                        <div className="picker-header">
                            <button className="picker-month-nav" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); }}>←</button>
                            <span className="picker-month-label">{viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            <button className="picker-month-nav" onClick={(e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); }}>→</button>
                        </div>
                        <div className="picker-days-header">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="picker-day-label">{d}</div>)}
                        </div>
                        <div className="picker-grid">
                            {days.map((d, i) => (
                                <div
                                    key={i}
                                    className={`picker-cell 
                                        ${!d.currentMonth ? 'other-month' : ''} 
                                        ${isSelected(d.date) ? 'selected' : ''}
                                        ${isInRange(d.date) ? 'in-range' : ''}
                                        ${isRangeStart(d.date) ? 'range-start' : ''}
                                        ${isRangeEnd(d.date) ? 'range-end' : ''}
                                    `}
                                    onClick={(e) => { e.stopPropagation(); handleDateClick(d.date); }}
                                >
                                    {d.date.getDate()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
