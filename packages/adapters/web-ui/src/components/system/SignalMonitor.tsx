import React, { useEffect, useRef } from 'react';
import './SignalMonitor.css';

export const SignalMonitor: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let offset = 0;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear / Trail
            ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let x = 0; x < width; x++) {
                // Combine sine waves
                const y1 = Math.sin((x + offset) * 0.05) * 20;
                const y2 = Math.sin((x - offset * 2) * 0.02) * 15;
                const noise = (Math.random() - 0.5) * 4;

                const y = (height / 2) + y1 + y2 + noise;

                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            // Gradient Stroke
            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
            gradient.addColorStop(0.5, 'rgba(0, 229, 255, 1)');
            gradient.addColorStop(1, 'rgba(0, 229, 255, 0.2)');

            ctx.strokeStyle = gradient;
            ctx.stroke();

            offset += 2;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="signal-monitor">
            <div className="signal-header">
                <span>SIGNAL_RF_V4</span>
                <span className="signal-value">-42 dBm</span>
            </div>
            <canvas ref={canvasRef} width={300} height={100} className="signal-canvas" />
            <div className="signal-footer">
                <div className="signal-freq">2.45 GHz</div>
                <div className="signal-mode">WIDEBAND</div>
            </div>
        </div>
    );
};
