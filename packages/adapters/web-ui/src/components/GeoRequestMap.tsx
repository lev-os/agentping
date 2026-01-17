import React from 'react';
import './GeoRequestMap.css';

interface GeoLocation {
    id: string;
    lat: number;
    lng: number;
    intensity: number; // 0-1
    label: string;
}

interface GeoRequestMapProps {
    points: GeoLocation[];
    height?: number;
}

export function GeoRequestMap({ points, height = 300 }: GeoRequestMapProps) {
    // Simple projection: Map lat/lng to x/y percentages
    // Lat: -90 to 90 -> 100% to 0%
    // Lng: -180 to 180 -> 0% to 100%

    // Using a simple Equirectangular approximation for styling
    const project = (lat: number, lng: number) => {
        const x = ((lng + 180) / 360) * 100;
        const y = ((90 - lat) / 180) * 100;
        return { x, y };
    };

    return (
        <div className="geo-request-map" style={{ height }}>
            {/* Abstract World Map Outline (SVG) */}
            <svg className="world-outline" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path
                    d="M 5 15 Q 20 5 30 15 T 50 20 T 70 15 T 95 15 V 40 H 5 Z"
                    fill="rgba(255,255,255,0.02)"
                    stroke="rgba(255,255,255,0.05)"
                />
                {/* Simplified continents for visual context - abstract representation */}
            </svg>

            {points.map(pt => {
                const { x, y } = project(pt.lat, pt.lng);
                const size = 6 + (pt.intensity * 10);

                return (
                    <div
                        key={pt.id}
                        className="geo-point"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: size,
                            height: size,
                            backgroundColor: `rgba(var(--accent-primary-rgb), ${0.4 + pt.intensity * 0.6})`
                        }}
                        title={`${pt.label}: ${Math.round(pt.intensity * 100)}% load`}
                    >
                        <div className="geo-ripple" />
                    </div>
                );
            })}
        </div>
    );
}
