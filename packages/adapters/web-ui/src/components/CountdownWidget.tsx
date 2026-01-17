import React, { useEffect, useState } from 'react';
import './CountdownWidget.css';

interface CountdownWidgetProps {
    targetDate: Date; // e.g. "2026-01-01"
    title?: string;
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({ targetDate, title = "Countdown" }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="countdown-widget">
            <div className="countdown-title">{title}</div>
            <div className="countdown-timer">
                <div className="countdown-segment">
                    <div className="countdown-value">{timeLeft.days}</div>
                    <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-segment">
                    <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-segment">
                    <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="countdown-label">Mins</div>
                </div>
                <div className="countdown-segment">
                    <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="countdown-label">Secs</div>
                </div>
            </div>
        </div>
    );
};
