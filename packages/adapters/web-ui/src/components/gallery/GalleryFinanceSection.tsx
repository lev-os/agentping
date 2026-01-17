import React from 'react';
import { OrderBook } from '../finance/OrderBook';
import { CandleStickChart } from '../finance/CandleStickChart';
import { TradeHistory } from '../finance/TradeHistory';
import { DepthChart } from '../finance/DepthChart';
import { TickerTape } from '../finance/TickerTape';
import { AssetCard } from '../finance/AssetCard';
import { PortfolioPie } from '../finance/PortfolioPie';
import { MarketHeatmap } from '../finance/MarketHeatmap';
import { ForecastingLine } from '../finance/ForecastingLine';
import { ExchangeStatus } from '../finance/ExchangeStatus';

export const GalleryFinanceSection: React.FC = () => {
    return (
        <div className="app-grid">

            {/* Ticker Tape Full Width */}
            <div className="app-card col-span-2" style={{ height: '48px', minHeight: 'auto' }}>
                <TickerTape />
            </div>

            {/* Row 1: Main Chart & Order Book */}
            <div className="app-card col-span-2" style={{ height: '320px' }}>
                <div className="app-card-header">
                    <h3>Price Action</h3>
                    <p>BTC/USD Perpetual</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <CandleStickChart />
                </div>
            </div>

            <div className="app-card" style={{ gridRow: 'span 2' }}>
                <div className="app-card-header">
                    <h3>Order Book</h3>
                    <p>L2 Market Data</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <OrderBook />
                </div>
            </div>

            {/* Row 2: Secondary Visuals */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>Market Depth</h3>
                    <p>Liquidity View</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <DepthChart />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Recent Trades</h3>
                    <p>Tick History</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <TradeHistory />
                </div>
            </div>

            {/* Row 3: Portfolio & Assets */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>Portfolio</h3>
                    <p>Asset Allocation</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <PortfolioPie />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Asset Overview</h3>
                    <p>Bitcoin (BTC)</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <AssetCard />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>System Status</h3>
                    <p>Connectivity</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <ExchangeStatus />
                </div>
            </div>

            {/* Row 4: Advanced */}
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Market Heatmap</h3>
                    <p>Sector Performance</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <MarketHeatmap />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>AI Forecast</h3>
                    <p>Predictive Modeling</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <ForecastingLine />
                </div>
            </div>
        </div>
    );
};
