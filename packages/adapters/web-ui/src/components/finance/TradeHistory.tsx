import React from 'react';
import './TradeHistory.css';

export const TradeHistory: React.FC = () => {
    // Mock Trades
    const trades = [
        { price: 42136.50, size: 0.155, time: '14:23:01', side: 'buy' },
        { price: 42136.50, size: 0.020, time: '14:23:00', side: 'buy' },
        { price: 42136.00, size: 1.500, time: '14:22:58', side: 'sell' },
        { price: 42135.50, size: 0.330, time: '14:22:55', side: 'sell' },
        { price: 42136.50, size: 0.100, time: '14:22:50', side: 'buy' },
        { price: 42137.00, size: 2.100, time: '14:22:42', side: 'buy' },
        { price: 42135.00, size: 0.050, time: '14:22:30', side: 'sell' },
        { price: 42135.00, size: 0.010, time: '14:22:29', side: 'sell' },
    ];

    return (
        <div className="trades-container">
            <div className="trades-header">
                <span>PRICE</span>
                <span>SIZE</span>
                <span>TIME</span>
            </div>
            <div className="trades-list">
                {trades.map((t, i) => (
                    <div key={i} className={`trade-row ${t.side}`}>
                        <span className="t-price">{t.price.toFixed(2)}</span>
                        <span className="t-size">{t.size.toFixed(4)}</span>
                        <span className="t-time">{t.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
