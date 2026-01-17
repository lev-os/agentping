import React from 'react';
import './SystemHealthGauge.css';

interface RingProps {
    radius: number;
    stroke: number;
    progress: number;
    color: string;
    label: string;
}

const Ring: React.FC<RingProps> = ({ radius, stroke, progress, color, label }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="health-ring-wrapper">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="health-ring-svg"
            >
                <circle
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={stroke}
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    fill="transparent"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="health-ring-progress"
                />
            </svg>
            <div className="health-ring-label" style={{ top: radius, width: radius * 2, color }}>
                {label} {progress}%
            </div>
        </div>
    );
};


export const SystemHealthGauge: React.FC = () => {
    return (
        <div className="system-health-gauge">
            <div className="gauge-header">CORE_METRICS</div>
            <div className="rings-container">
                <Ring radius={60} stroke={6} progress={78} color="#00e5ff" label="CPU" />
                <Ring radius={45} stroke={6} progress={42} color="#00ff9d" label="MEM" />
                <Ring radius={30} stroke={6} progress={25} color="#ff0055" label="GPU" />
            </div>
            <div className="gauge-footer">
                THERMAL: <span className="temp-ok">45°C</span>
            </div>
        </div>
    );
};
