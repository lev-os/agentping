import React from 'react';
import './ServerRackStatus.css';

interface ServerUnit {
    id: number;
    status: 'ok' | 'warn' | 'error' | 'offline';
}

export const ServerRackStatus: React.FC = () => {
    const units: ServerUnit[] = Array.from({ length: 42 }, (_, i) => ({
        id: i + 1,
        status: Math.random() > 0.95 ? 'error' : (Math.random() > 0.8 ? 'warn' : 'ok')
    }));

    return (
        <div className="rack-container">
            <div className="rack-header">RACK_01 [US-EAST]</div>
            <div className="rack-grid">
                {units.map((unit) => (
                    <div key={unit.id} className={`rack-unit status-${unit.status}`}>
                        <div className="unit-led"></div>
                    </div>
                ))}
            </div>
            <div className="rack-footer">
                <span className="unit-legend ok">OK</span>
                <span className="unit-legend warn">WARN</span>
                <span className="unit-legend error">ERR</span>
            </div>
        </div>
    );
};
