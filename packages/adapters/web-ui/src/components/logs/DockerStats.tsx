
import React from 'react';
import './DockerStats.css';

interface ContainerStats {
    id: string;
    name: string;
    image: string;
    status: 'running' | 'stopped' | 'restarting';
    cpu: number; // percentage
    memory: number; // percentage
    netIo: string;
    blockIo: string;
}

interface DockerStatsProps {
    containers: ContainerStats[];
    title?: string;
}

export const DockerStats: React.FC<DockerStatsProps> = ({ containers, title }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return '#00ff00';
            case 'stopped': return '#ff0000';
            case 'restarting': return '#ffa500';
            default: return '#888';
        }
    };

    const renderBar = (value: number, color: string) => (
        <div className="stat-bar-track">
            <div
                className="stat-bar-fill"
                style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
            ></div>
        </div>
    );

    return (
        <div className="docker-stats">
            <div className="docker-header">
                <h3 className="docker-title">{title || 'CONTAINER STATS'}</h3>
                <div className="docker-count">{containers.length} CONTAINERS</div>
            </div>
            <div className="docker-list">
                {containers.map((container) => (
                    <div key={container.id} className="container-card">
                        <div className="container-header">
                            <div className="container-name-section">
                                <span
                                    className="status-dot"
                                    style={{ backgroundColor: getStatusColor(container.status) }}
                                ></span>
                                <span className="container-name">{container.name}</span>
                                <span className="container-id">({container.id.substring(0, 12)})</span>
                            </div>
                            <div className="container-image">{container.image}</div>
                        </div>

                        <div className="container-metrics">
                            <div className="metric-row">
                                <span className="metric-label">CPU</span>
                                <div className="metric-bar">{renderBar(container.cpu, 'var(--accent-primary)')}</div>
                                <span className="metric-value">{container.cpu.toFixed(2)}%</span>
                            </div>
                            <div className="metric-row">
                                <span className="metric-label">MEM</span>
                                <div className="metric-bar">{renderBar(container.memory, '#dcdcaa')}</div>
                                <span className="metric-value">{container.memory.toFixed(2)}%</span>
                            </div>
                            <div className="io-stats">
                                <span className="io-stat">NET: {container.netIo}</span>
                                <span className="io-stat">BLK: {container.blockIo}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
