
import React from 'react';
import { LiveLogStream } from '../logs/LiveLogStream';
import { StackTraceProfiler } from '../logs/StackTraceProfiler';
import { HttpInspector } from '../logs/HttpInspector';
import { EventTimeline } from '../logs/EventTimeline';
import { AuditLogTable } from '../logs/AuditLogTable';
import { BuildStatusLogs } from '../logs/BuildStatusLogs';
import { DockerStats } from '../logs/DockerStats';
import { DistributedTrace } from '../logs/DistributedTrace';
import { LogSearchQuery } from '../logs/LogSearchQuery';
import { AlertFeed } from '../logs/AlertFeed';
import './GalleryLogsSection.css';

export const GalleryLogsSection: React.FC = () => {
    return (
        <div className="gallery-section logs-section">
            <div className="gallery-grid">
                <div className="gallery-item large">
                    <LiveLogStream
                        title="SYSTEM_TAIL_F"
                    />
                </div>

                <div className="gallery-item">
                    <LogSearchQuery
                        onSearch={(q) => console.log('Searching:', q)}
                        results={[
                            { line: 452, content: '2026-01-16 12:00:01 [INFO] Service started', matches: [] },
                            { line: 453, content: '2026-01-16 12:00:02 [ERROR] Connection refused', matches: [] },
                            { line: 454, content: '2026-01-16 12:00:02 [INFO] Retrying...', matches: [] }
                        ]}
                    />
                </div>

                <div className="gallery-item">
                    <AlertFeed
                        alerts={[
                            { id: '1', severity: 'critical', title: 'Database Down', message: 'Primary shard unreachable', timestamp: '12:05:00', source: 'db-cluster' },
                            { id: '2', severity: 'high', title: 'High Latency', message: 'API response > 2s', timestamp: '12:04:30', source: 'api-gateway' },
                            { id: '3', severity: 'medium', title: 'Disk Usage', message: 'Volume /data at 85%', timestamp: '12:01:15', source: 'host-01' }
                        ]}
                    />
                </div>

                <div className="gallery-item large">
                    <StackTraceProfiler
                        exception="NullPointerException"
                        message="Cannot read property 'id' of undefined"
                        frames={[
                            { method: 'UserService.getUser', file: 'src/services/user.ts', line: 42, column: 15 },
                            { method: 'AuthController.login', file: 'src/controllers/auth.ts', line: 120, column: 8 },
                            { method: 'Express.handleRequest', file: 'node_modules/express/lib/router/layer.js', line: 95, column: 5, isInternal: true },
                            { method: 'process.nextTick', file: 'internal/process/task_queues.js', line: 79, column: 21, isInternal: true }
                        ]}
                    />
                </div>

                <div className="gallery-item large">
                    <EventTimeline
                        title="REQUEST_LIFECYCLE"
                        totalDurationMs={150}
                        events={[
                            { id: '1', label: 'DNS Lookup', start: 0, width: 10, color: '#00bfff', metadata: '15ms' },
                            { id: '2', label: 'TCP Connect', start: 10, width: 20, color: '#00bfff', metadata: '30ms' },
                            { id: '3', label: 'TLS Handshake', start: 30, width: 30, color: '#ffa500', metadata: '45ms' },
                            { id: '4', label: 'TTFB', start: 60, width: 20, color: '#00ff00', metadata: '30ms' },
                            { id: '5', label: 'Download', start: 80, width: 20, color: '#00ff00', metadata: '30ms' }
                        ]}
                    />
                </div>

                <div className="gallery-item wide">
                    <DistributedTrace
                        traceId="8b6e2f10-9c3d-4a5b"
                        totalDuration={450}
                        spans={[
                            { id: 's1', name: 'GET /api/v1/orders', service: 'api-gateway', startTime: 0, duration: 450, status: 'ok' },
                            { id: 's2', name: 'authenticate', service: 'auth-service', startTime: 10, duration: 50, status: 'ok' },
                            { id: 's3', name: 'fetch_orders', service: 'order-service', startTime: 70, duration: 300, status: 'ok' },
                            { id: 's4', name: 'SELECT * FROM orders', service: 'db-postgres', startTime: 90, duration: 250, status: 'ok' },
                            { id: 's5', name: 'cache_set', service: 'redis', startTime: 350, duration: 10, status: 'error' }
                        ]}
                    />
                </div>

                <div className="gallery-item large">
                    <AuditLogTable
                        logs={[
                            { id: 'a1', timestamp: '2026-01-16 10:00:00', actor: 'alice@corp.com', action: 'CREATE_USER', resource: 'user:bob', result: 'success', ip: '10.0.0.5' },
                            { id: 'a2', timestamp: '2026-01-16 10:05:22', actor: 'system', action: 'BACKUP_DB', resource: 'db:main', result: 'success', ip: 'localhost' },
                            { id: 'a3', timestamp: '2026-01-16 10:12:45', actor: 'eve@hack.com', action: 'DELETE_TABLE', resource: 'users', result: 'denied', ip: '192.168.1.66' },
                            { id: 'a4', timestamp: '2026-01-16 10:30:10', actor: 'bob@corp.com', action: 'LOGIN', resource: 'portal', result: 'failure', ip: '10.0.0.8' }
                        ]}
                    />
                </div>

                <div className="gallery-item">
                    <DockerStats
                        containers={[
                            { id: 'a1b2c3d4e5f6', name: 'api-server', image: 'nginx:alpine', status: 'running', cpu: 12.5, memory: 45.2, netIo: '1.2MB/s', blockIo: '0B/s' },
                            { id: '1234567890ab', name: 'db-primary', image: 'postgres:14', status: 'running', cpu: 25.8, memory: 82.1, netIo: '5.6MB/s', blockIo: '12MB/s' },
                            { id: 'c3d4e5f6a1b2', name: 'worker-01', image: 'python:3.9', status: 'stopped', cpu: 0, memory: 0, netIo: '0B/s', blockIo: '0B/s' }
                        ]}
                    />
                </div>

                <div className="gallery-item large">
                    <BuildStatusLogs
                        buildId="8492"
                        steps={[
                            { name: 'Checkout', status: 'success', duration: '2s', logs: ['git clone https://repo.git', 'Checkout 5f3a2b1'] },
                            { name: 'Install Deps', status: 'success', duration: '45s', logs: ['npm install', 'Added 1240 packages'] },
                            { name: 'Lint', status: 'success', duration: '12s', logs: ['eslint .', 'No errors found'] },
                            { name: 'Test', status: 'failed', duration: '5s', logs: ['npm test', 'FAIL: UserSpec.ts', 'Expected 200 but got 404'] },
                            { name: 'Build', status: 'pending', logs: [] }
                        ]}
                    />
                </div>

                <div className="gallery-item">
                    <HttpInspector
                        request={{
                            method: 'POST',
                            url: 'https://api.example.com/v1/users',
                            headers: [{ key: 'Content-Type', value: 'application/json' }, { key: 'Authorization', value: 'Bearer token...' }],
                            body: '{\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                        }}
                        response={{
                            status: 201,
                            statusText: 'Created',
                            timing: 145,
                            headers: [{ key: 'Content-Type', value: 'application/json' }, { key: 'X-RateLimit', value: '1000' }],
                            body: '{\n  "id": "u_123",\n  "created_at": "2026-01-16T12:00:00Z"\n}'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
