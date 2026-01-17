import React from 'react';
import './ActivityFeed.css';

export interface ActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    timestamp: string;
    type: 'deploy' | 'alert' | 'info' | 'error' | 'success';
}

interface ActivityFeedProps {
    activities: ActivityItem[];
    className?: string;
    maxHeight?: number;
}

export function ActivityFeed({ activities, className = '', maxHeight = 300 }: ActivityFeedProps) {
    const getIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'deploy': return '🚀';
            case 'alert': return '⚠️';
            case 'error': return '✗';
            case 'success': return '✓';
            case 'info': default: return 'ℹ️';
        }
    };

    return (
        <div className={`activity-feed ${className}`} style={{ maxHeight: maxHeight }}>
            {activities.map((item) => (
                <div key={item.id} className={`activity-item activity-${item.type}`}>
                    <div className="activity-icon">
                        {getIcon(item.type)}
                    </div>
                    <div className="activity-content">
                        <div className="activity-header">
                            <span className="activity-user">{item.user}</span>
                            <span className="activity-action">{item.action}</span>
                            <span className="activity-target">{item.target}</span>
                        </div>
                        <div className="activity-time">{item.timestamp}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
