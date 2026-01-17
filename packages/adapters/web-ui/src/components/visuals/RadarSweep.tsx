import React from 'react';
import './RadarSweep.css';

export const RadarSweep: React.FC = () => {
    return (
        <div className="radar-container">
            <div className="radar-screen">
                <div className="radar-sweep"></div>

                {/* Random Blips */}
                <div className="radar-blip" style={{ top: '30%', left: '60%', animationDelay: '1s' }}></div>
                <div className="radar-blip" style={{ top: '70%', left: '40%', animationDelay: '3s' }}></div>
                <div className="radar-blip" style={{ top: '20%', left: '30%', animationDelay: '5s' }}></div>

                {/* Grid Rings */}
                <div className="radar-ring r1"></div>
                <div className="radar-ring r2"></div>
                <div className="radar-ring r3"></div>

                {/* Crosshair */}
                <div className="radar-axis x"></div>
                <div className="radar-axis y"></div>
            </div>
            <div className="radar-info">SCANNING...</div>
        </div>
    );
};
