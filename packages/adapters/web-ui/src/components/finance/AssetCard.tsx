import React from 'react';
import './AssetCard.css';

export const AssetCard: React.FC = () => {
    return (
        <div className="asset-card">
            <div className="asset-header">
                <div className="asset-icon btc">₿</div>
                <div>
                    <div className="asset-symbol">Bitcoin</div>
                    <div className="asset-name">BTC</div>
                </div>
            </div>

            <div className="asset-chart-mini">
                {/* SVG Sparkline */}
                <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 L10,20 L20,22 L30,15 L40,18 L50,10 L60,12 L70,5 L80,8 L90,2 L100,5"
                        fill="none" stroke="#00e5ff" strokeWidth="2" />
                </svg>
            </div>

            <div className="asset-price-box">
                <div className="asset-price">$68,492.10</div>
                <div className="asset-change up">+4.2%</div>
            </div>
        </div>
    );
};
