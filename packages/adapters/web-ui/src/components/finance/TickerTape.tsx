import React from 'react';
import './TickerTape.css';

export const TickerTape: React.FC = () => {
    return (
        <div className="ticker-container">
            <div className="ticker-track">
                <div className="ticker-item up">BTC +5.2%</div>
                <div className="ticker-item down">ETH -1.2%</div>
                <div className="ticker-item up">SOL +8.4%</div>
                <div className="ticker-item up">NVDA +2.1%</div>
                <div className="ticker-item down">TSLA -0.5%</div>
                <div className="ticker-item up">AMD +1.8%</div>
                <div className="ticker-item down">DOGE -3.2%</div>
                <div className="ticker-item up">XRP +0.9%</div>
                {/* Duplicate for loop */}
                <div className="ticker-item up">BTC +5.2%</div>
                <div className="ticker-item down">ETH -1.2%</div>
                <div className="ticker-item up">SOL +8.4%</div>
                <div className="ticker-item up">NVDA +2.1%</div>
            </div>
        </div>
    );
};
