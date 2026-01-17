import './AlertBanner.css';

export interface AlertBannerProps {
    title?: string;
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
    className?: string;
    onDismiss?: () => void;
}

export function AlertBanner({
    title,
    message,
    type = 'info',
    className = '',
    onDismiss
}: AlertBannerProps) {
    const getIcon = () => {
        switch (type) {
            case 'success': return '✓';
            case 'warning': return '⚠';
            case 'error': return '✗';
            case 'info': return 'ℹ';
        }
    };

    return (
        <div
            className={`alert-banner alert-${type} ${className}`}
            role="alert"
        >
            <span className="alert-icon" aria-hidden="true">
                {getIcon()}
            </span>
            <div className="alert-content">
                {title && <div className="alert-title">{title}</div>}
                <div className="alert-message">{message}</div>
            </div>
            {onDismiss && (
                <button
                    className="alert-dismiss"
                    onClick={onDismiss}
                    aria-label="Dismiss alert"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7 }}
                >
                    ×
                </button>
            )}
        </div>
    );
}
