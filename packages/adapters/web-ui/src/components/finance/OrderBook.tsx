import React, { useMemo } from 'react';
import './OrderBook.css';

interface Order {
    price: number;
    size: number;
    total: number;
    depth: number; // 0-100%
}

export const OrderBook: React.FC = () => {
    // Mock Data
    const asks: Order[] = useMemo(() => [
        { price: 42150.50, size: 0.5, total: 15.5, depth: 90 },
        { price: 42145.20, size: 1.2, total: 15.0, depth: 80 },
        { price: 42142.10, size: 2.5, total: 13.8, depth: 60 },
        { price: 42140.00, size: 5.0, total: 11.3, depth: 40 },
        { price: 42138.50, size: 1.5, total: 6.3, depth: 20 },
    ].reverse(), []); // Lowest ask at bottom

    const bids: Order[] = useMemo(() => [
        { price: 42135.00, size: 2.0, total: 2.0, depth: 25 },
        { price: 42132.50, size: 4.5, total: 6.5, depth: 50 },
        { price: 42130.00, size: 1.2, total: 7.7, depth: 60 },
        { price: 42128.50, size: 3.0, total: 10.7, depth: 80 },
        { price: 42125.00, size: 5.5, total: 16.2, depth: 100 },
    ], []);

    return (
        <div className="orderbook-container">
            <div className="orderbook-header">
                <span>PRICE (USD)</span>
                <span>SIZE</span>
                <span>TOTAL</span>
            </div>

            <div className="orderbook-list asks">
                {asks.map((ask, i) => (
                    <div key={i} className="ob-row">
                        <div className="ob-bg" style={{ width: `${ask.depth}%` }}></div>
                        <span className="ob-price ask">{ask.price.toFixed(2)}</span>
                        <span className="ob-size">{ask.size.toFixed(4)}</span>
                        <span className="ob-total">{ask.total.toFixed(4)}</span>
                    </div>
                ))}
            </div>

            <div className="orderbook-spread">
                <span className="spread-price">42,136.50</span>
                <span className="spread-pct">0.15%</span>
            </div>

            <div className="orderbook-list bids">
                {bids.map((bid, i) => (
                    <div key={i} className="ob-row">
                        <div className="ob-bg" style={{ width: `${bid.depth}%` }}></div>
                        <span className="ob-price bid">{bid.price.toFixed(2)}</span>
                        <span className="ob-size">{bid.size.toFixed(4)}</span>
                        <span className="ob-total">{bid.total.toFixed(4)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
