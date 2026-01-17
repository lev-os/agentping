import React, { useState } from 'react';
import './TimezoneSlider.css';

interface TimezoneSliderProps {
    baseDate?: Date;
    timezones: string[]; // ["UTC", "America/New_York", "Asia/Tokyo"]
}

export const TimezoneSlider: React.FC<TimezoneSliderProps> = ({
    baseDate = new Date(),
    timezones
}) => {
    // Offset in minutes from baseDate
    const [offset, setOffset] = useState(0);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOffset(parseInt(e.target.value));
    };

    const formatTime = (tz: string, minutesAdded: number) => {
        const d = new Date(baseDate.getTime() + minutesAdded * 60000);
        return d.toLocaleTimeString('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="timezone-slider">
            <div className="tz-header">Timezone Converter</div>
            <div className="tz-controls">
                <input
                    type="range"
                    min="-720" // -12 hours
                    max="720" // +12 hours
                    value={offset}
                    onChange={handleSliderChange}
                    style={{ width: '100%' }}
                />
            </div>
            <div className="tz-rows" style={{ marginTop: 16 }}>
                {timezones.map(tz => (
                    <div key={tz} className="tz-row">
                        <div className="tz-label">{tz.split('/')[1] || tz}</div>
                        <div className="tz-time">{formatTime(tz, offset)}</div>
                        <div className="tz-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {/* In a real app, calculate offset diff */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
