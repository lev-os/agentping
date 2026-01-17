import React from 'react';
import './ExchangeStatus.css';

export const ExchangeStatus: React.FC = () => {
    return (
        <div className="status-container">
            <div className="status-row">
                <span className="st-label">API Latency</span>
                <span className="st-val ok">45ms</span>
            </div>
            <div className="status-row">
                <span className="st-label">WebSocket</span>
                <span className="st-val ok">CONNECTED</span>
            </div>
            <div className="status-row">
                <span className="st-label">Orders</span>
                <span className="st-val ok">ACTIVE</span>
            </div>
            <div className="status-row">
                <span className="st-label">Risk Check</span>
                <span className="st-val warn">VERIFYING</span>
            </div>
        </div>
    );
};
