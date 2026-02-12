/**
 * Timeline - Studio wrapper
 * Migrated to @kingly/ui canonical component
 * @see packages/ui/src/components/migrations/timeline-conflict.tsx
 */
import { type ReactNode } from 'react';
import { TimelineCandidate, type TimelineItem, type TimelineConflictProps } from '@kingly/ui/components';
import { Clock, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import './Timeline.css';

export type TimelineEventType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: Date | string;
  type?: TimelineEventType;
  icon?: ReactNode;
  metadata?: Record<string, any>;
}

export interface TimelineProps {
  events: TimelineEvent[];
  loading?: boolean;
  emptyMessage?: string;
  onEventClick?: (event: TimelineEvent) => void;
  showTime?: boolean;
  className?: string;
}

const defaultIcons: Record<TimelineEventType, ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertCircle size={16} />,
  info: <Info size={16} />,
  default: <Clock size={16} />,
};

type MigrationTimelineStatus = 'done' | 'active' | 'queued';

function toMigrationStatus(type: TimelineEventType | undefined): MigrationTimelineStatus {
  switch (type) {
    case 'success':
      return 'done';
    case 'info':
      return 'active';
    default:
      return 'queued';
  }
}

export function Timeline({
  events,
  loading = false,
  emptyMessage = 'No events to display',
  onEventClick,
  showTime = true,
  className = '',
}: TimelineProps) {
  const formatTimestamp = (timestamp: Date | string): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    if (showTime) {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={`timeline-container loading ${className}`}>
        <div className="timeline-loading">
          <div className="spinner" />
          <span>Loading timeline...</span>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className={`timeline-container empty ${className}`}>
        <div className="timeline-empty">
          <Clock size={32} />
          <span>{emptyMessage}</span>
        </div>
      </div>
    );
  }

  const migrationItems: TimelineItem[] = events.map((event) => ({
    id: event.id,
    title: event.title,
    detail: event.description,
    time: formatTimestamp(event.timestamp),
    status: toMigrationStatus(event.type),
  }));

  // When onEventClick is present, fall back to local rendering for click handling
  if (onEventClick) {
    return (
      <div className={`timeline-container ${className}`}>
        <div className="timeline-track" />
        <div className="timeline-events">
          {events.map((event) => {
            const eventType = event.type || 'default';
            const icon = event.icon || defaultIcons[eventType];

            return (
              <div
                key={event.id}
                className={`timeline-event ${eventType} clickable`}
                onClick={() => onEventClick(event)}
              >
                <div className={`timeline-marker ${eventType}`}>
                  {icon}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4 className="timeline-title">{event.title}</h4>
                    <span className="timeline-timestamp">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>

                  {event.description && (
                    <p className="timeline-description">{event.description}</p>
                  )}

                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="timeline-metadata">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="metadata-item">
                          <span className="metadata-key">{key}:</span>
                          <span className="metadata-value">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <TimelineCandidate items={migrationItems} className={className} />;
}
