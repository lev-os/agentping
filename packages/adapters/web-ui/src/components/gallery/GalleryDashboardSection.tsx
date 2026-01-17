import React from 'react';
import {
    StatsGrid,
    TaskQueue,
    StatusCard,
    MetricChart,
    LoadingProgress,
    LogStream,
    ResourceGauge,
    QuickActions,
    ActivityFeed,
    TeamRoster,
    ProgressTimeline,
    WorldClock,
    WeatherCard
} from '../index';

export const GalleryDashboardSection = () => {
    return (
        <div className="app-grid">
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>StatsGrid</h3>
                    <p>High-density metrics</p>
                </div>
                <div className="app-card-body">
                    <StatsGrid stats={[
                        { label: 'Total Requests', value: '1.2M', trend: 'up', trendValue: '+12%', history: [20, 30, 40, 35, 50, 60, 80, 70, 90, 100] },
                        { label: 'Error Rate', value: '0.05%', trend: 'down', trendValue: '-2%', history: [10, 5, 2, 1, 0, 1, 0, 0, 1, 0] },
                        { label: 'Active Agents', value: '24', trend: 'neutral', history: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24] },
                        { label: 'Avg Latency', value: '45ms', trend: 'up', trendValue: '+5ms', history: [40, 42, 45, 43, 48, 45, 46, 44, 45, 45] },
                    ]} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>TaskQueue</h3>
                    <p>Background jobs</p>
                </div>
                <div className="app-card-body">
                    <TaskQueue tasks={[
                        { id: '1', name: 'Data Migration', priority: 'high', progress: 45, status: 'processing', eta: '5m' },
                        { id: '2', name: 'Image Optimization', priority: 'medium', progress: 12, status: 'processing', eta: '12m' },
                        { id: '3', name: 'Weekly Report', priority: 'low', progress: 0, status: 'queued' },
                        { id: '4', name: 'Cache Warmup', priority: 'high', progress: 100, status: 'completed' }
                    ]} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>StatusCard</h3>
                    <p>Compact health monitoring</p>
                </div>
                <div className="app-card-body">
                    <StatusCard
                        title="Training Model v3"
                        status="running"
                        progress={45}
                        eta="12m 30s"
                        metrics={[
                            { label: 'Loss', value: '0.023' },
                            { label: 'Epoch', value: '12/50' }
                        ]}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>MetricChart</h3>
                    <p>Performance visualization</p>
                </div>
                <div className="app-card-body">
                    <MetricChart
                        title="Requests / Sec"
                        data={[
                            { label: '10:00', value: 50 },
                            { label: '10:01', value: 80 },
                            { label: '10:02', value: 45 },
                            { label: '10:03', value: 90 },
                        ]}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>LoadingProgress</h3>
                    <p>Feedback delays</p>
                </div>
                <div className="app-card-body">
                    <LoadingProgress
                        stages={[
                            { id: '1', label: 'Initializing', status: 'complete' },
                            { id: '2', label: 'Processing', status: 'active' },
                        ]}
                        currentStage="2"
                    />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>LogStream</h3>
                    <p>Real-time system events</p>
                </div>
                <div className="app-card-body" style={{ padding: 0 }}>
                    <LogStream logs={[
                        { id: '1', timestamp: '10:42:01', level: 'info', message: 'System initialization started...' },
                        { id: '2', timestamp: '10:42:02', level: 'debug', message: 'Loading core modules: [auth, db, api]' },
                        { id: '3', timestamp: '10:42:05', level: 'warn', message: 'Connection latency detected (150ms)' },
                        { id: '4', timestamp: '10:42:08', level: 'info', message: 'Service "Agent-01" ready' },
                        { id: '5', timestamp: '10:42:15', level: 'error', message: 'Failed to sync background job #4492' },
                        { id: '6', timestamp: '10:43:00', level: 'info', message: 'Retrying job #4492...' },
                    ]} height={200} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>ResourceGauge</h3>
                    <p>System load</p>
                </div>
                <div className="app-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <ResourceGauge value={72} label="CPU Usage" size={100} />
                        <ResourceGauge value={45} label="Memory" color="var(--accent-success)" size={100} />
                    </div>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>QuickActions</h3>
                    <p>Command shortcuts</p>
                </div>
                <div className="app-card-body">
                    <QuickActions actions={[
                        { id: '1', label: 'Deploy Agent', icon: '🚀', onClick: () => alert('Deploying...') },
                        { id: '2', label: 'Clear Cache', icon: '🧹', onClick: () => alert('Cache Cleared') },
                        { id: '3', label: 'Stop Services', icon: '🛑', onClick: () => alert('Stopping...') },
                        { id: '4', label: 'View Reports', icon: '📊', onClick: () => alert('Opening Reports') },
                    ]} />
                </div>
            </div>


            {/* Duplicate TaskQueue removed */}

            <div className="app-card" style={{ gridRow: 'span 2' }}>
                <div className="app-card-header">
                    <h3>ActivityFeed</h3>
                    <p>Recent audit logs</p>
                </div>
                <div className="app-card-body">
                    <ActivityFeed activities={[
                        { id: '1', user: 'System', action: 'auto-deployed', target: 'v2.4.0', timestamp: '2m ago', type: 'deploy' },
                        { id: '2', user: 'AlertBot', action: 'triggered', target: 'High CPU', timestamp: '5m ago', type: 'alert' },
                        { id: '3', user: 'admin', action: 'updated', target: 'Permissions', timestamp: '15m ago', type: 'info' },
                        { id: '4', user: 'System', action: 'failed', target: 'Backup', timestamp: '1h ago', type: 'error' },
                        { id: '5', user: 'System', action: 'restored', target: 'Service A', timestamp: '2h ago', type: 'success' },
                    ]} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>TeamRoster</h3>
                    <p>Active personnel</p>
                </div>
                <div className="app-card-body">
                    <TeamRoster members={[
                        { id: '1', name: 'Sarah Connor', role: 'Security', status: 'online', location: 'HQ' },
                        { id: '2', name: 'John Doe', role: 'DevOps', status: 'busy', location: 'Remote' },
                        { id: '3', name: 'Jane Smith', role: 'Product', status: 'away', location: 'Meeting' },
                        { id: '4', name: 'Agent-007', role: 'AI Unit', status: 'online', location: 'Server 1' },
                    ]} />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>ProgressTimeline</h3>
                    <p>Release Status</p>
                </div>
                <div className="app-card-body">
                    <ProgressTimeline steps={[
                        { id: '1', label: 'Code Review', status: 'complete', timestamp: '10:00 AM' },
                        { id: '2', label: 'Unit Tests', status: 'complete', timestamp: '10:15 AM' },
                        { id: '3', label: 'Integration', status: 'current', description: 'Running suite...' },
                        { id: '4', label: 'Deploy', status: 'pending' },
                    ]} />
                </div>
            </div>
        </div >
    );
};
