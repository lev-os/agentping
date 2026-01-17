import './Skeleton.css';

export interface SkeletonProps {
    variant?: 'text' | 'rect' | 'circle';
    width?: string | number;
    height?: string | number;
    className?: string;
}

export function Skeleton({
    variant = 'text',
    width,
    height,
    className = ''
}: SkeletonProps) {
    const style = {
        width: width,
        height: height
    };

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={style}
            aria-hidden="true"
        />
    );
}
