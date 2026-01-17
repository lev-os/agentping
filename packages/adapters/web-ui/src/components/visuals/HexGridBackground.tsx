import React from 'react';
import './HexGridBackground.css';

export const HexGridBackground: React.FC = () => {
    return (
        <div className="hex-container">
            <div className="hex-grid">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="hex-cell"></div>
                ))}
            </div>
            <div className="hex-content">
                <span>GRID: ACTIVE</span>
            </div>
        </div>
    );
};
