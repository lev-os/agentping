/**
 * AuditFeed Component
 *
 * Live agent activity stream with:
 * - Animated entry transitions
 * - Event type icons (task, message, error, success)
 * - Timestamps with relative time
 * - Filterable by event type
 */

import { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertTriangle, MessageSquare, Zap, XCircle, Filter } from 'lucide-react';
import './AuditFeed.css';

export type EventType = 'success' | 'error' | 'warning' | 'message' | 'task';

export interface AuditEvent {
    id: string;
    timestamp: Date;
    type: EventType;
    message: string;
    metadata?: Record<string, any>;
}

interface AuditFeedProps {
    events?: AuditEvent[];
    maxEvents?: number;
    autoScroll?: boolean;
    showFilter?: boolean;
    className?: string;
}

const EventIcons: Record<EventType, React.ReactNode> = {
    success: <CheckCircle size={14} />,
    error: <XCircle size={14} />,
    warning: <AlertTriangle size={14} />,
    message: <MessageSquare size={14} />,
    task: <Zap size={14} />,
};

function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
}

export function AuditFeed({
    events = [],
    maxEvents = 50,
    autoScroll = true,
    showFilter = true,
    className = '',
}: AuditFeedProps) {
    const [filter, setFilter] = useState<Set<EventType>>(new Set(['success', 'error', 'warning', 'message', 'task']));
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const feedRef = useRef<HTMLDivElement>(null);
    const prevEventsLength = useRef(events.length);

    // Auto-scroll on new events
    useEffect(() => {
        if (autoScroll && feedRef.current && events.length > prevEventsLength.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
        prevEventsLength.current = events.length;
    }, [events, autoScroll]);

    const toggleFilter = (type: EventType) => {
        setFilter(prev => {
            const next = new Set(prev);
            if (next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };

    const filteredEvents = events
        .filter(event => filter.has(event.type))
        .slice(-maxEvents);

    return (
        <div className={`audit-feed ${className}`}>
            <div className="feed-header">
                <div className="feed-title">
                    <Zap size={16} />
                    <span>Activity Stream</span>
                    <span className="event-count">{filteredEvents.length}</span>
                </div>

                {showFilter && (
                    <div className="feed-filter">
                        <button
                            className={`filter-toggle ${isFilterOpen ? 'active' : ''}`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            title="Filter events"
                        >
                            <Filter size={14} />
                        </button>

                        {isFilterOpen && (
                            <div className="filter-dropdown">
                                {(['success', 'error', 'warning', 'message', 'task'] as EventType[]).map(type => (
                                    <label key={type} className="filter-option">
                                        <input
                                            type="checkbox"
                                            checked={filter.has(type)}
                                            onChange={() => toggleFilter(type)}
                                        />
                                        <span className={`filter-icon ${type}`}>
                                            {EventIcons[type]}
                                        </span>
                                        <span className="filter-label">{type}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="feed-events" ref={feedRef}>
                {filteredEvents.length === 0 ? (
                    <div className="feed-empty">
                        <MessageSquare size={32} opacity={0.3} />
                        <p>No events to display</p>
                    </div>
                ) : (
                    filteredEvents.map((event, index) => (
                        <AuditEventItem
                            key={event.id}
                            event={event}
                            isNew={index === filteredEvents.length - 1 && events.length > prevEventsLength.current}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

interface AuditEventItemProps {
    event: AuditEvent;
    isNew?: boolean;
}

function AuditEventItem({ event, isNew }: AuditEventItemProps) {
    const [relativeTime, setRelativeTime] = useState(getRelativeTime(event.timestamp));

    // Update relative time every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(event.timestamp));
        }, 30000);
        return () => clearInterval(interval);
    }, [event.timestamp]);

    return (
        <div className={`event-item ${event.type} ${isNew ? 'new' : ''}`}>
            <div className="event-icon">
                {EventIcons[event.type]}
            </div>
            <div className="event-content">
                <div className="event-message">{event.message}</div>
                <div className="event-meta">
                    <span className="event-time" title={event.timestamp.toLocaleString()}>
                        {relativeTime}
                    </span>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <span className="event-metadata">
                            {Object.entries(event.metadata).map(([key, value]) => (
                                <span key={key} className="meta-item">
                                    {key}: {String(value)}
                                </span>
                            ))}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
