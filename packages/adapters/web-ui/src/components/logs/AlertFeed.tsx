
import React from 'react';
import './AlertFeed.css';

interface Alert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    message: string;
    timestamp: string;
    source: string;
}

interface AlertFeedProps {
    alerts: Alert[];
    title?: string;
}

export const AlertFeed: React.FC<AlertFeedProps> = ({ alerts, title }) => {
    return (
        <div className="alert-feed">
            <div className="alert-header">
                <h3 className="alert-title">{title || 'ALERT FEED'}</h3>
                <div className="alert-count-badge">{alerts.length}</div>
            </div>
            <div className="alert-list">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`alert-card ${alert.severity}`}>
                        <div className="alert-row-top">
                            <span className={`severity-tag ${alert.severity}`}>{alert.severity}</span>
                            <span className="alert-source">{alert.source}</span>
                            <span className="alert-time">{alert.timestamp}</span>
                        </div>
                        <div className="alert-content">
                            <div className="alert-item-title">{alert.title}</div>
                            <div className="alert-item-message">{alert.message}</div>
                        </div>
                    </div>
                ))}
                {alerts.length === 0 && (
                    <div className="no-alerts">
                        <span className="check-icon">✓</span>
                        NO ALERTS
                    </div>
                )}
            </div>
        </div>
    );
};
