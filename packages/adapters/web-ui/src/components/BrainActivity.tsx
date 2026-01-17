import React, { useEffect, useRef } from 'react';
import './BrainActivity.css';

interface BrainActivityProps {
    active?: boolean;
    frequency?: number;
    color?: string;
    height?: number;
    className?: string;
}

export function BrainActivity({
    active = true,
    frequency = 1,
    color = '#00e5ff',
    height = 60,
    className = ''
}: BrainActivityProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        // Resize handling
        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = height;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            if (!active) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            const amplitude = canvas.height / 3;
            const centerY = canvas.height / 2;
            const speed = 0.05 * frequency;

            for (let x = 0; x < canvas.width; x++) {
                // Combine sine waves for organic brain-wave look
                const y = centerY +
                    Math.sin(x * 0.02 + time) * amplitude * Math.sin(time * 0.5) +
                    Math.sin(x * 0.05 + time * 2) * (amplitude * 0.5);

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            // Glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.stroke();
            ctx.shadowBlur = 0;

            time += speed;
            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [active, frequency, color, height]);

    return (
        <div className={`brain-activity ${className}`}>
            <canvas ref={canvasRef} style={{ width: '100%', height }} />
        </div>
    );
}
