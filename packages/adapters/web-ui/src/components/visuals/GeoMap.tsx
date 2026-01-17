import React, { useEffect, useRef } from 'react';
import './GeoMap.css';

export const GeoMap: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frameId: number;

        // Simple dot matrix world map approximation
        // In a real app we'd use GeoJSON or a texture, but we'll generate noise that "looks" like continents for the vibe
        // or just a grid of dots
        const dots: { x: number, y: number, active: boolean, alpha: number }[] = [];
        const width = 300;
        const height = 150;

        // Generate grid
        for (let y = 0; y < height; y += 6) {
            for (let x = 0; x < width; x += 6) {
                // Mock "continents" using simple noise-like logic (sine waves)
                const n = Math.sin(x * 0.02) + Math.cos(y * 0.05) + Math.sin(x * y * 0.0001);
                if (n > 0.2) {
                    dots.push({
                        x,
                        y,
                        active: Math.random() > 0.99, // Some blinking
                        alpha: Math.random() * 0.5 + 0.1
                    });
                }
            }
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            dots.forEach(dot => {
                if (Math.random() > 0.995) dot.active = !dot.active;

                ctx.fillStyle = dot.active
                    ? `rgba(0, 229, 255, 1)`
                    : `rgba(0, 229, 255, ${dot.alpha})`;

                const size = dot.active ? 2 : 1.5;
                ctx.fillRect(dot.x, dot.y, size, size);

                // Ping effect
                if (dot.active && Math.random() > 0.8) {
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, 6, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${Math.random()})`;
                    ctx.stroke();
                }
            });

            frameId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="geomap-container">
            <div className="geomap-overlay">
                <span className="geo-coord">LAT: 34.0522 N</span>
                <span className="geo-coord">LON: 118.2437 W</span>
            </div>
            <canvas ref={canvasRef} width={300} height={150} className="geomap-canvas" />
            <div className="geomap-grid-overlay"></div>
        </div>
    );
};
