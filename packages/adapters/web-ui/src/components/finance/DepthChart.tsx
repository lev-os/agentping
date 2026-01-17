import React, { useEffect, useRef } from 'react';
import './DepthChart.css';

export const DepthChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Asks (Right side, Red)
        ctx.beginPath();
        ctx.moveTo(width / 2, height);
        // Simulate exponential growth of depth
        for (let x = width / 2; x < width; x += 10) {
            const progress = (x - width / 2) / (width / 2);
            const y = height - (Math.pow(progress, 2) * height * 0.8) - 20;
            // Add some noise
            const yNoise = y + (Math.random() * 10 - 5);
            ctx.lineTo(x, yNoise);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 42, 109, 0.2)'; // Cyber Pink
        ctx.fill();
        ctx.strokeStyle = '#ff2a6d';
        ctx.stroke();

        // Bids (Left side, Green/Blue)
        ctx.beginPath();
        ctx.moveTo(width / 2, height);
        for (let x = width / 2; x > 0; x -= 10) {
            const progress = (width / 2 - x) / (width / 2);
            const y = height - (Math.pow(progress, 2) * height * 0.8) - 20;
            const yNoise = y + (Math.random() * 10 - 5);
            ctx.lineTo(x, yNoise);
        }
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 229, 255, 0.2)'; // Cyber Cyan
        ctx.fill();
        ctx.strokeStyle = '#00e5ff';
        ctx.stroke();

        // Mid Price Line
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

    }, []);

    return (
        <div className="depth-container">
            <canvas ref={canvasRef} width={600} height={200} className="depth-canvas" />
            <div className="depth-tooltip" style={{ top: '40%', left: '50%' }}>
                MID: $42,135
            </div>
        </div>
    );
};
