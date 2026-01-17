import { useState } from 'react';
import './Rating.css';

interface RatingProps {
    value: number;
    max?: number;
    onChange?: (value: number) => void;
    label?: string;
    icon?: string; // e.g., '★' or '⚡' or '💀'
}

export function Rating({ value, max = 5, onChange, label, icon = '★' }: RatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    return (
        <div>
            {label && <label className="cyber-label">{label}</label>}
            <div className="rating-container" onMouseLeave={() => setHoverValue(null)}>
                {Array.from({ length: max }).map((_, i) => {
                    const ratingValue = i + 1;
                    const isActive = ratingValue <= (hoverValue || value);
                    const isHovered = hoverValue !== null && ratingValue <= hoverValue;

                    return (
                        <span
                            key={i}
                            className={`rating-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered-active' : ''}`}
                            onClick={() => onChange && onChange(ratingValue)}
                            onMouseEnter={() => onChange && setHoverValue(ratingValue)}
                        >
                            {icon}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
