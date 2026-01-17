import React, { useEffect, useRef } from 'react';
import './ParticleStream.css';

interface Particle {
    x: number;
    y: number;
    speed: number;
    size: number;
    color: string;
}

export const ParticleStream: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        particles.current = Array.from({ length: 50 }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: Math.random() * 2 + 1,
            size: Math.random() * 2,
            color: `rgba(0, 229, 255, ${Math.random()})`
        }));

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            particles.current.forEach(p => {
                p.x += p.speed;
                if (p.x > width) p.x = 0;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Trail
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.speed * 4, p.y);
                ctx.stroke();
            });

            requestAnimationFrame(render);
        };

        render();
    }, []);

    return (
        <div className="particle-container">
            <canvas ref={canvasRef} width={300} height={150} className="particle-canvas" />
            <div className="particle-label">DATA_STREAM_01</div>
        </div>
    );
};
