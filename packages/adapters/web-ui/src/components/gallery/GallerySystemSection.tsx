import React from 'react';
import { NetworkGraph } from '../system/NetworkGraph';
import { EncryptionStatus } from '../system/EncryptionStatus';
import { SignalMonitor } from '../system/SignalMonitor';
import { SystemHealthGauge } from '../system/SystemHealthGauge';
import { ProcessTable } from '../system/ProcessTable';
import { TerminalConsole } from '../system/TerminalConsole';
import { PacketInspector } from '../system/PacketInspector';
import { ServerRackStatus } from '../system/ServerRackStatus';
import { AccessPad } from '../system/AccessPad';
import { FirewallRules } from '../system/FirewallRules';

export const GallerySystemSection: React.FC = () => {
    return (
        <div className="app-grid">
            {/* Row 1: High level viz */}
            <div className="app-card col-span-2" style={{ height: '300px' }}>
                <div className="app-card-header">
                    <h3>Network Topography</h3>
                    <p>Live node visualization</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <NetworkGraph />
                </div>
            </div>

            <div className="app-card" style={{ height: '300px' }}>
                <div className="app-card-header">
                    <h3>Terminal</h3>
                    <p>System Console</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <TerminalConsole />
                </div>
            </div>

            {/* Row 2: Status & Security */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>Encryption</h3>
                    <p>AES-256 Stream</p>
                </div>
                <div className="app-card-body">
                    <EncryptionStatus />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Signal</h3>
                    <p>RF Analysis</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <SignalMonitor />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>System Health</h3>
                    <p>Core Metrics</p>
                </div>
                <div className="app-card-body">
                    <SystemHealthGauge />
                </div>
            </div>

            {/* Row 3: Data & Ops */}
            <div className="app-card" style={{ gridRow: 'span 2' }}>
                <div className="app-card-header">
                    <h3>Processes</h3>
                    <p>Active Tasks</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <ProcessTable />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Packet Inspector</h3>
                    <p>Deep Packet Inspection</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <PacketInspector />
                </div>
            </div>

            {/* Row 4: Physical & Access */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>Access Control</h3>
                    <p>Biometric Entry</p>
                </div>
                <div className="app-card-body">
                    <AccessPad />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Firewall</h3>
                    <p>Active Rules</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <FirewallRules />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Hardware</h3>
                    <p>Rack Status</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <ServerRackStatus />
                </div>
            </div>
        </div>
    );
};
