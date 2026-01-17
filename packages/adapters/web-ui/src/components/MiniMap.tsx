import React from 'react';
import './MiniMap.css';

interface MiniMapProps {
    contentHeight: number;
    viewportHeight: number;
    scrollTop: number;
    width?: number;
    onScrollRequest?: (top: number) => void;
}

export function MiniMap({
    contentHeight,
    viewportHeight,
    scrollTop,
    width = 60,
    onScrollRequest
}: MiniMapProps) {
    const scale = width / 200; // Assumed generic content width to scale map
    // Better simple approach: view as proportional bar

    // Proportional heights
    const mapHeight = 150;
    const ratio = mapHeight / contentHeight;
    const viewThumbHeight = Math.max(20, viewportHeight * ratio);
    const viewThumbTop = scrollTop * ratio;

    const handleMapClick = (e: React.MouseEvent) => {
        if (!onScrollRequest) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const percent = y / mapHeight;
        onScrollRequest(percent * contentHeight);
    };

    return (
        <div
            className="minimap"
            style={{ width, height: mapHeight }}
            onClick={handleMapClick}
        >
            {/* Simulated content blocks */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', height: '20%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '40%', left: '10%', right: '40%', height: '10%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '60%', left: '10%', right: '10%', height: '30%', background: 'rgba(255,255,255,0.05)' }} />

            <div
                className="minimap-viewport"
                style={{
                    height: viewThumbHeight,
                    top: Math.min(mapHeight - viewThumbHeight, Math.max(0, viewThumbTop)),
                    left: 0,
                    right: 0
                }}
            />
        </div>
    );
}
