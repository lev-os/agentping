import React from 'react';
import './CircuitPattern.css';

export const CircuitPattern: React.FC = () => {
    return (
        <div className="circuit-container">
            <svg width="100%" height="100%" className="circuit-svg">
                <path d="M10,10 L50,10 L50,50" className="circuit-trace t1" />
                <path d="M80,10 L80,30 L120,30 L120,80" className="circuit-trace t2" />
                <path d="M10,120 L40,120 L40,80 L80,80" className="circuit-trace t3" />

                <circle cx="10" cy="10" r="3" className="circuit-node" />
                <circle cx="50" cy="50" r="3" className="circuit-node" />
                <circle cx="80" cy="10" r="3" className="circuit-node" />
                <circle cx="120" cy="80" r="3" className="circuit-node" />
            </svg>
            <div className="circuit-iso">PCB_LAYER_01</div>
        </div>
    );
};
