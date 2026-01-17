import './Badge.css';

export interface BadgeProps {
    label: string | number;
    type?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'outline';
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export function Badge({
    label,
    type = 'default',
    icon,
    className = '',
    onClick
}: BadgeProps) {
    return (
        <span
            className={`badge badge-${type} ${className}`}
            role={onClick ? 'button' : 'status'}
            aria-label={typeof label === 'string' ? label : undefined}
            onClick={onClick}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            } : undefined}
        >
            {icon && <span className="badge-icon" aria-hidden="true" style={{ marginRight: 4 }}>{icon}</span>}
            {label}
        </span>
    );
}
