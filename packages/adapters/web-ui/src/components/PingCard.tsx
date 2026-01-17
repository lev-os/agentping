/**
 * PingCard Component
 * 
 * Shows a ping in the queue with type icon and metadata.
 * Accessible with aria-labels and keyboard navigation.
 */

import type { Ping } from '@agentping/core';
import './PingCard.css';

interface PingCardProps {
    ping: Ping;
    isSelected: boolean;
    onClick: () => void;
}

export function PingCard({ ping, isSelected, onClick }: PingCardProps) {
    const payload = ping.payload as { title?: string; question?: string; message?: string };
    const title = payload.title || payload.question || payload.message || 'Ping';

    const getTypeIcon = () => {
        switch (ping.type) {
            case 'step_approval': return '📋';
            case 'approval': return '✅';
            case 'question': return '❓';
            case 'selection': return '🔘';
            case 'research_request': return '🔬';
            case 'notification': return 'ℹ️';
            default: return '📌';
        }
    };

    const getTypeColor = () => {
        switch (ping.type) {
            case 'step_approval': return 'type-steps';
            case 'approval': return 'type-approval';
            case 'question': return 'type-question';
            case 'selection': return 'type-selection';
            case 'research_request': return 'type-research';
            case 'notification': return 'type-notification';
            default: return '';
        }
    };

    return (
        <div
            className={`ping-card ${isSelected ? 'selected' : ''} ${getTypeColor()}`}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
            aria-label={`${ping.agentName}: ${title}, ${ping.type}, ${ping.status === 'pending' ? 'pending response' : ping.status}`}
        >
            <div className="ping-card-icon" aria-hidden="true">{getTypeIcon()}</div>
            <div className="ping-card-content">
                <div className="ping-card-agent">{ping.agentName}</div>
                <div className="ping-card-title">{title}</div>
                <div className="ping-card-time">
                    {new Date(ping.createdAt).toLocaleTimeString()}
                </div>
            </div>
            {ping.status === 'pending' && (
                <div
                    className="ping-card-indicator"
                    aria-label="Awaiting response"
                />
            )}
        </div>
    );
}
