import './CircularProgress.css';

export interface CircularProgressProps {
    value: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    label?: string; // Optional center text, defaults to value%
    showLabel?: boolean;
    color?: string; // Hex or CSS var
    className?: string;
}

export function CircularProgress({
    value,
    size = 40,
    strokeWidth = 4,
    label,
    showLabel = false,
    color = 'var(--accent-primary)',
    className = ''
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div
            className={`circular-progress ${className}`}
            style={{ width: size, height: size }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <svg
                className="circular-svg"
                width={size}
                height={size}
            >
                <circle
                    className="circular-bg"
                    strokeWidth={strokeWidth}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                />
                <circle
                    className="circular-fg"
                    strokeWidth={strokeWidth}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        stroke: color
                    }}
                />
            </svg>
            {showLabel && (
                <span className="circular-label">
                    {label || `${Math.round(value)}%`}
                </span>
            )}
        </div>
    );
}
