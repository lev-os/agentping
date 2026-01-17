import React, { useEffect, useRef } from 'react';
import './CandleStickChart.css';

export const CandleStickChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Mock Candle Data
        const candles = Array.from({ length: 40 }).map((_, i) => {
            const open = Math.random() * 80 + 20;
            const close = open + (Math.random() * 20 - 10);
            const high = Math.max(open, close) + Math.random() * 10;
            const low = Math.min(open, close) - Math.random() * 10;
            return { open, close, high, low };
        });

        const barWidth = (width / candles.length) * 0.7;
        const spacing = (width / candles.length) * 0.3;

        // Find min/max for scaling
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        candles.forEach(c => {
            minPrice = Math.min(minPrice, c.low);
            maxPrice = Math.max(maxPrice, c.high);
        });

        const scaleY = (val: number) => height - ((val - minPrice) / (maxPrice - minPrice) * (height * 0.8) + 10);

        candles.forEach((c, i) => {
            const x = i * (barWidth + spacing) + 10;
            const yOpen = scaleY(c.open);
            const yClose = scaleY(c.close);
            const yHigh = scaleY(c.high);
            const yLow = scaleY(c.low);

            const isUp = c.close >= c.open;
            ctx.fillStyle = isUp ? '#00e5ff' : '#ff2a6d'; // Cyber colors
            ctx.strokeStyle = ctx.fillStyle;

            // Wick
            ctx.beginPath();
            ctx.moveTo(x + barWidth / 2, yHigh);
            ctx.lineTo(x + barWidth / 2, yLow);
            ctx.stroke();

            // Body
            const bodyH = Math.max(Math.abs(yClose - yOpen), 1);
            const bodyY = Math.min(yOpen, yClose);
            ctx.fillRect(x, bodyY, barWidth, bodyH);
        });

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

    }, []);

    return (
        <div className="chart-container">
            <div className="chart-header">
                <span className="pair">BTC/USD</span>
                <span className="timeframe">1H</span>
            </div>
            <canvas ref={canvasRef} width={600} height={200} className="chart-canvas" />
        </div>
    );
};
