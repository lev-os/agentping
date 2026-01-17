import React from 'react';
import { GeoMap } from '../visuals/GeoMap';
import { GlobeWireframe } from '../visuals/GlobeWireframe';
import { HolographicCard } from '../visuals/HolographicCard';
import { HexGridBackground } from '../visuals/HexGridBackground';
import { RadarSweep } from '../visuals/RadarSweep';
import { VoiceVisualizer } from '../visuals/VoiceVisualizer';
import { ParticleStream } from '../visuals/ParticleStream';
import { SonarDisplay } from '../visuals/SonarDisplay';
import { CircuitPattern } from '../visuals/CircuitPattern';
import { StarField } from '../visuals/StarField';

export const GalleryVisualsSection: React.FC = () => {
    return (
        <div className="app-grid">
            <div className="app-card col-span-2" style={{ height: '240px' }}>
                <div className="app-card-header">
                    <h3>GeoMap</h3>
                    <p>Dot-matrix geospatial view</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <GeoMap />
                </div>
            </div>

            <div className="app-card" style={{ height: '300px' }}>
                <div className="app-card-header">
                    <h3>Globe Wireframe</h3>
                    <p>3D Orbital View</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <GlobeWireframe />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Holographic</h3>
                    <p>Interactive 3D Card</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <HolographicCard />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Voice AI</h3>
                    <p>Audio Spectrum</p>
                </div>
                <div className="app-card-body">
                    <VoiceVisualizer />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Radar</h3>
                    <p>Active Scanning</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <RadarSweep />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Particle Stream</h3>
                    <p>Data Flow</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <ParticleStream />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Sonar</h3>
                    <p>Depth Sensor</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <SonarDisplay />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Circuit</h3>
                    <p>PCB Layout</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <CircuitPattern />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Star Field</h3>
                    <p>Deep Space Parallax</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <StarField />
                </div>
            </div>

            <div className="app-card col-span-2" style={{ height: '200px' }}>
                <div className="app-card-header">
                    <h3>Hex Grid</h3>
                    <p>Background Pattern</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <HexGridBackground />
                </div>
            </div>
        </div>
    );
};
