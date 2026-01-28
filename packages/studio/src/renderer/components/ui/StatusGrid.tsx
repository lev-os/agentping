import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Activity } from 'lucide-react';
import './StatusGrid.css';

export type StatusType = 'success' | 'error' | 'warning' | 'pending' | 'active';

export interface StatusCard {
  id: string;
  title: string;
  status: StatusType;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

export interface StatusGridProps {
  cards: StatusCard[];
  loading?: boolean;
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
  onCardClick?: (card: StatusCard) => void;
  className?: string;
}

const defaultIcons: Record<StatusType, React.ReactNode> = {
  success: <CheckCircle size={24} />,
  error: <XCircle size={24} />,
  warning: <AlertTriangle size={24} />,
  pending: <Clock size={24} />,
  active: <Activity size={24} />,
};

const statusLabels: Record<StatusType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  pending: 'Pending',
  active: 'Active',
};

export function StatusGrid({
  cards,
  loading = false,
  emptyMessage = 'No status cards to display',
  columns = 3,
  onCardClick,
  className = '',
}: StatusGridProps) {
  if (loading) {
    return (
      <div className={`status-grid-container loading ${className}`}>
        <div className="status-grid-loading">
          <div className="spinner" />
          <span>Loading status...</span>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className={`status-grid-container empty ${className}`}>
        <div className="status-grid-empty">
          <Activity size={32} />
          <span>{emptyMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`status-grid-container ${className}`}>
      <div className={`status-grid columns-${columns}`}>
        {cards.map((card) => {
          const icon = card.icon || defaultIcons[card.status];
          const statusLabel = statusLabels[card.status];

          return (
            <div
              key={card.id}
              className={`status-card ${card.status} ${onCardClick ? 'clickable' : ''}`}
              onClick={() => onCardClick?.(card)}
            >
              <div className="status-card-header">
                <div className={`status-icon ${card.status}`}>
                  {icon}
                </div>
                <div className={`status-indicator ${card.status}`}>
                  {statusLabel}
                </div>
              </div>

              <div className="status-card-body">
                <h3 className="status-card-title">{card.title}</h3>

                {card.value !== undefined && (
                  <div className="status-card-value">{card.value}</div>
                )}

                {card.description && (
                  <p className="status-card-description">{card.description}</p>
                )}

                {card.metadata && Object.keys(card.metadata).length > 0 && (
                  <div className="status-card-metadata">
                    {Object.entries(card.metadata).map(([key, value]) => (
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
