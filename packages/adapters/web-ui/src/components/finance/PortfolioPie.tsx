import React from 'react';
import './PortfolioPie.css';

export const PortfolioPie: React.FC = () => {
    // Mock Data
    const slices = [
        { label: 'BTC', value: 45, color: '#f7931a' },
        { label: 'ETH', value: 30, color: '#627eea' },
        { label: 'USDT', value: 15, color: '#26a17b' },
        { label: 'SOL', value: 10, color: '#00ffbd' },
    ];

    let currentAngle = 0;

    return (
        <div className="portfolio-container">
            <div className="portfolio-chart">
                <svg viewBox="0 0 100 100" className="pie-svg">
                    {slices.map((slice, i) => {
                        const startAngle = currentAngle;
                        const sliceAngle = (slice.value / 100) * 360;
                        currentAngle += sliceAngle;

                        // Calculate path
                        const x1 = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
                        const y1 = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
                        const x2 = 50 + 40 * Math.cos(Math.PI * (startAngle + sliceAngle) / 180);
                        const y2 = 50 + 40 * Math.sin(Math.PI * (startAngle + sliceAngle) / 180);

                        // Large arc flag
                        const largeArc = sliceAngle > 180 ? 1 : 0;

                        const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

                        return (
                            <path
                                key={i}
                                d={pathData}
                                fill={slice.color}
                                stroke="#111"
                                strokeWidth="1"
                                className="pie-slice"
                            />
                        );
                    })}
                    <circle cx="50" cy="50" r="25" fill="#09090b" />
                </svg>
                <div className="portfolio-total">
                    <span>$124K</span>
                </div>
            </div>

            <div className="portfolio-legend">
                {slices.map((slice, i) => (
                    <div key={i} className="legend-item">
                        <span className="dot" style={{ background: slice.color }}></span>
                        <span className="label">{slice.label}</span>
                        <span className="value">{slice.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
