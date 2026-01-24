export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    return (
        <span
            className={`ui-spinner ui-spinner--${size} ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="ui-sr-only">Loading...</span>
        </span>
    );
}
