import React, { useEffect, useRef } from 'react';
import './ForecastingLine.css';

export const ForecastingLine: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // History
        ctx.beginPath();
        let x = 0;
        let y = height * 0.6;
        ctx.moveTo(x, y);
        for (let i = 0; i < width * 0.6; i += 5) {
            x = i;
            y += (Math.random() * 10 - 4.5); // Slight upward trend
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Forecast start point
        const startX = x;
        const startY = y;

        // Confidence interval (Cone)
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(width, startY - 50); // Upper bound
        ctx.lineTo(width, startY + 80); // Lower bound
        ctx.lineTo(startX, startY);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
        ctx.fill();

        // Predicted line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(width, startY + 10);
        ctx.strokeStyle = '#00e5ff';
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#00e5ff';
        ctx.font = '10px monospace';
        ctx.fillText('PREDICTED', width - 60, startY + 25);

    }, []);

    return (
        <div className="forecast-container">
            <canvas ref={canvasRef} width={600} height={200} className="forecast-canvas" />
        </div>
    );
};
