import React from 'react';
import './StarField.css';

export const StarField: React.FC = () => {
    return (
        <div className="starfield-container">
            <div className="stars-small"></div>
            <div className="stars-medium"></div>
            <div className="stars-large"></div>
            <div className="starfield-overlay">
                <span>SECTOR: 7G</span>
            </div>
        </div>
    );
};
