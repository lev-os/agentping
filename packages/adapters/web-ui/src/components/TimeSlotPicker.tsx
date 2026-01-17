import React from 'react';
import './TimeSlotPicker.css';

interface TimeSlotPickerProps {
    slots: string[]; // ["09:00", "09:30", ...]
    selectedSlot?: string;
    onSelect: (slot: string) => void;
    disabledSlots?: string[];
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    slots = [],
    selectedSlot,
    onSelect,
    disabledSlots = []
}) => {
    return (
        <div className="time-slot-picker">
            <div className="time-grid">
                {slots.map(slot => (
                    <button
                        key={slot}
                        className={`time-slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                        disabled={disabledSlots.includes(slot)}
                        onClick={() => onSelect(slot)}
                    >
                        {slot}
                    </button>
                ))}
            </div>
        </div>
    );
};
