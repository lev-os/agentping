import React from 'react';
import './MarketHeatmap.css';

export const MarketHeatmap: React.FC = () => {
    const data = [
        { sym: 'BTC', chg: +2.5, size: 'large' },
        { sym: 'ETH', chg: -1.2, size: 'medium' },
        { sym: 'SOL', chg: +5.4, size: 'medium' },
        { sym: 'XRP', chg: +0.8, size: 'small' },
        { sym: 'ADA', chg: -2.1, size: 'small' },
        { sym: 'DOGE', chg: -0.5, size: 'small' },
        { sym: 'DOT', chg: +1.1, size: 'small' },
    ];

    return (
        <div className="heatmap-container">
            {data.map((item, i) => (
                <div
                    key={i}
                    className={`heatmap-cell size-${item.size} ${item.chg >= 0 ? 'pos' : 'neg'}`}
                    style={{ opacity: 0.5 + Math.abs(item.chg) / 10 }}
                >
                    <span className="hm-sym">{item.sym}</span>
                    <span className="hm-chg">{item.chg > 0 ? '+' : ''}{item.chg}%</span>
                </div>
            ))}
        </div>
    );
};
