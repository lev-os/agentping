import React from 'react';
import './SonarDisplay.css';

export const SonarDisplay: React.FC = () => {
    return (
        <div className="sonar-container">
            <div className="sonar-circle">
                <div className="sonar-line"></div>
                <div className="sonar-obj o1"></div>
                <div className="sonar-obj o2"></div>
            </div>
            <div className="sonar-grid"></div>
        </div>
    );
};
