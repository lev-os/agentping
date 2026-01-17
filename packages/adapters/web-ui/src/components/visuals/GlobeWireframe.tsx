import React from 'react';
import './GlobeWireframe.css';

export const GlobeWireframe: React.FC = () => {
    return (
        <div className="globe-container">
            <div className="globe">
                <div className="globe-latitude"></div>
                <div className="globe-latitude"></div>
                <div className="globe-latitude"></div>
                <div className="globe-longitude"></div>
                <div className="globe-longitude"></div>
                <div className="globe-longitude"></div>
                <div className="globe-core"></div>
            </div>
            <div className="globe-data">
                <span>ORBIT: LEO</span>
                <span>ALT: 400KM</span>
            </div>
        </div>
    );
};
