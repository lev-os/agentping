import React, { useEffect, useRef, useState } from 'react';
import './NetworkGraph.css';

interface Node {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    type: 'server' | 'client' | 'database';
}

interface Connection {
    source: number;
    target: number;
    active: boolean;
}

export const NetworkGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodeCount, setNodeCount] = useState(15);
    const nodes = useRef<Node[]>([]);
    const connections = useRef<Connection[]>([]);
    const frameRef = useRef<number>(0);

    // Initialize nodes
    useEffect(() => {
        const initNodes = () => {
            const newNodes: Node[] = [];
            for (let i = 0; i < nodeCount; i++) {
                newNodes.push({
                    id: i,
                    x: Math.random() * 300,
                    y: Math.random() * 200,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: i === 0 ? 6 : 3, // Node 0 is "hub"
                    type: i === 0 ? 'server' : (Math.random() > 0.7 ? 'database' : 'client')
                });
            }
            nodes.current = newNodes;

            // Create connections
            const newConnections: Connection[] = [];
            for (let i = 1; i < nodeCount; i++) {
                // Connect everything to hub
                newConnections.push({ source: 0, target: i, active: Math.random() > 0.5 });
                // Random extra connections
                if (Math.random() > 0.8) {
                    newConnections.push({
                        source: i,
                        target: Math.floor(Math.random() * nodeCount),
                        active: false
                    });
                }
            }
            connections.current = newConnections;
        };

        initNodes();
    }, [nodeCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const render = () => {
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.clearRect(0, 0, width, height);

            // Update positions
            nodes.current.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                // Bounce
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;
            });

            // Draw Connections
            connections.current.forEach(conn => {
                const source = nodes.current.find(n => n.id === conn.source);
                const target = nodes.current.find(n => n.id === conn.target);
                if (!source || !target) return;

                const dist = Math.hypot(source.x - target.x, source.y - target.y);
                const opacity = Math.max(0, 1 - dist / 150);

                ctx.beginPath();
                ctx.moveTo(source.x, source.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = conn.active
                    ? `rgba(0, 229, 255, ${opacity})`
                    : `rgba(255, 255, 255, ${opacity * 0.1})`;
                ctx.lineWidth = conn.active ? 1.5 : 0.5;
                ctx.stroke();

                // Draw Packet if active
                if (conn.active) {
                    const time = Date.now() / 1000;
                    const speed = 2; // px per frame approx, actually time based
                    const progress = (time * speed) % 1;
                    const px = source.x + (target.x - source.x) * progress;
                    const py = source.y + (target.y - source.y) * progress;

                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
            });

            // Draw Nodes
            nodes.current.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

                if (node.type === 'server') {
                    ctx.fillStyle = '#00e5ff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00e5ff';
                } else if (node.type === 'database') {
                    ctx.fillStyle = '#ff0055';
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#ff0055';
                } else {
                    ctx.fillStyle = '#aaa';
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                ctx.shadowBlur = 0; // Reset
            });

            frameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(frameRef.current);
    }, []);

    return (
        <div className="network-graph-container">
            <div className="network-header">
                <span className="network-title">TOPOLOGY</span>
                <span className="network-status">LIVE</span>
            </div>
            <canvas
                ref={canvasRef}
                width={320}
                height={200}
                className="network-canvas"
            />
            <div className="network-stats">
                <div>NODES: {nodes.current.length}</div>
                <div>LINKS: {connections.current.length}</div>
            </div>
        </div>
    );
};
