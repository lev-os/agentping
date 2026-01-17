import React from 'react';
import './WeatherCard.css';

interface WeatherCardProps {
    location: string;
    temperature: number; // Celsius
    condition: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'snow';
    humidity?: number;
    windSpeed?: number;
    className?: string;
}

export function WeatherCard({
    location,
    temperature,
    condition,
    humidity,
    windSpeed,
    className = ''
}: WeatherCardProps) {
    const getIcon = () => {
        switch (condition) {
            case 'sunny': return '☀️';
            case 'cloudy': return '☁️';
            case 'rain': return '🌧️';
            case 'storm': return '⚡';
            case 'snow': return '❄️';
            default: return '🌡️';
        }
    };

    return (
        <div className={`weather-card condition-${condition} ${className}`}>
            <div className="weather-header">
                <span className="weather-location">{location}</span>
                <span className="weather-icon">{getIcon()}</span>
            </div>
            <div className="weather-main">
                <div className="weather-temp">{temperature}°</div>
                <div className="weather-condition">{condition}</div>
            </div>
            {(humidity !== undefined || windSpeed !== undefined) && (
                <div className="weather-details">
                    {humidity !== undefined && (
                        <div className="weather-metric">
                            <span className="metric-label">HUM</span>
                            <span className="metric-value">{humidity}%</span>
                        </div>
                    )}
                    {windSpeed !== undefined && (
                        <div className="weather-metric">
                            <span className="metric-label">WND</span>
                            <span className="metric-value">{windSpeed}km/h</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
