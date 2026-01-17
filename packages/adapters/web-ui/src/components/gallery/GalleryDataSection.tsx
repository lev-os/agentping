
import React from 'react';
import { AdvancedDataGrid } from '../data/AdvancedDataGrid';
import { JsonTreeViewer } from '../data/JsonTreeViewer';
import { HexDumpView } from '../data/HexDumpView';
import { SqlResultTable } from '../data/SqlResultTable';
import { SchemaGraph } from '../data/SchemaGraph';
import { DataPipeline } from '../data/DataPipeline';
import { KeyValueStore } from '../data/KeyValueStore';
import { ObjectProperties } from '../data/ObjectProperties';
import { CsvPreview } from '../data/CsvPreview';
import { DataMetricsBoard } from '../data/DataMetricsBoard';
import './GalleryDataSection.css';

export const GalleryDataSection: React.FC = () => {
    return (
        <div className="gallery-section data-section">
            <div className="gallery-grid">
                <div className="gallery-item large">
                    <AdvancedDataGrid
                        title="USER_ACTIVITY_LOG"
                        columns={[
                            { key: 'id', label: 'ID', width: '60px', sortable: true },
                            { key: 'user', label: 'USER', width: '120px', sortable: true },
                            { key: 'action', label: 'ACTION', width: '150px' },
                            { key: 'timestamp', label: 'TIMESTAMP', width: '180px', sortable: true },
                            { key: 'ip', label: 'IP_ADDR', width: '120px' },
                            { key: 'status', label: 'STATUS', width: '80px' },
                        ]}
                        data={[
                            { id: '1001', user: 'admin', action: 'LOGIN_ATTEMPT', timestamp: '2026-01-16 10:42:01', ip: '192.168.1.5', status: 'SUCCESS' },
                            { id: '1002', user: 'system', action: 'CRON_EXEC', timestamp: '2026-01-16 10:45:00', ip: 'LOCALHOST', status: 'SUCCESS' },
                            { id: '1003', user: 'guest', action: 'FILE_ACCESS', timestamp: '2026-01-16 10:48:12', ip: '10.0.0.42', status: 'DENIED' },
                            { id: '1004', user: 'admin', action: 'CONFIG_UPDATE', timestamp: '2026-01-16 11:00:00', ip: '192.168.1.5', status: 'SUCCESS' },
                            { id: '1005', user: 'service', action: 'API_CALL', timestamp: '2026-01-16 11:05:33', ip: '10.0.0.12', status: 'WARN' },
                        ]}
                    />
                </div>

                <div className="gallery-item">
                    <JsonTreeViewer
                        title="CONFIG_DUMP.JSON"
                        data={{
                            system: {
                                version: '2.4.0',
                                environment: 'production',
                                features: {
                                    darkMode: true,
                                    betaAccess: false
                                }
                            },
                            network: {
                                ports: [80, 443, 8080],
                                allowed_ips: ['127.0.0.1', '192.168.1.0/24']
                            },
                            users: [
                                { id: 1, role: 'admin' },
                                { id: 2, role: 'viewer' }
                            ]
                        }}
                    />
                </div>

                <div className="gallery-item">
                    <HexDumpView
                        title="PACKET_CAPTURE"
                        data="Request-ID: 550e8400-e29b-41d4-a716-446655440000\nContent-Type: application/json\n\n{ 'status': 'ok' }"
                    />
                </div>

                <div className="gallery-item large">
                    <SqlResultTable
                        query="SELECT id, username, role, last_login FROM users WHERE status = 'active' ORDER BY last_login DESC LIMIT 5;"
                        executionTimeMs={42}
                        status="success"
                        columns={[
                            { key: 'id', label: 'ID' },
                            { key: 'username', label: 'USERNAME' },
                            { key: 'role', label: 'ROLE' },
                            { key: 'last_login', label: 'LAST_LOGIN' }
                        ]}
                        data={[
                            { id: 42, username: 'neo', role: 'root', last_login: '2026-01-15' },
                            { id: 101, username: 'trinity', role: 'admin', last_login: '2026-01-14' },
                            { id: 303, username: 'morpheus', role: 'captain', last_login: '2026-01-10' }
                        ]}
                    />
                </div>

                <div className="gallery-item large">
                    <SchemaGraph
                        tables={[
                            { id: 'users', title: 'users', x: 20, y: 20, fields: [{ name: 'id', type: 'uuid', isKey: true }, { name: 'email', type: 'varchar' }, { name: 'role_id', type: 'int' }] },
                            { id: 'roles', title: 'roles', x: 300, y: 50, fields: [{ name: 'id', type: 'int', isKey: true }, { name: 'name', type: 'varchar' }] },
                            { id: 'logs', title: 'activity_logs', x: 150, y: 200, fields: [{ name: 'id', type: 'uuid', isKey: true }, { name: 'user_id', type: 'uuid' }, { name: 'action', type: 'text' }] }
                        ]}
                        relationships={[
                            { from: 'users', to: 'roles', type: 'N:1' },
                            { from: 'logs', to: 'users', type: 'N:1' }
                        ]}
                    />
                </div>

                <div className="gallery-item wide">
                    <DataPipeline
                        stages={[
                            { id: '1', label: 'INGEST', status: 'completed', duration: '2.5s' },
                            { id: '2', label: 'VALIDATE', status: 'completed', duration: '0.8s' },
                            { id: '3', label: 'TRANSFORM', status: 'running', duration: '12s' },
                            { id: '4', label: 'ENRICH', status: 'pending' },
                            { id: '5', label: 'LOAD', status: 'pending' }
                        ]}
                    />
                </div>

                <div className="gallery-item">
                    <KeyValueStore
                        title="REDIS_CACHE"
                        items={[
                            { key: 'session:8392', value: 'active', ttl: 340, type: 'string' },
                            { key: 'user:config', value: '{...}', type: 'json' },
                            { key: 'rate_limit:ip', value: 45, ttl: 55, type: 'number' },
                            { key: 'feature:beta', value: true, type: 'boolean' }
                        ]}
                    />
                </div>

                <div className="gallery-item">
                    <ObjectProperties
                        title="NODE_INSPECTOR"
                        groups={[
                            {
                                name: 'Metadata',
                                properties: [
                                    { key: 'type', value: 'SequenceNode' },
                                    { key: 'uuid', value: 'a1-b2-c3-d4' },
                                    { key: 'created', value: '2024-10-12' }
                                ]
                            },
                            {
                                name: 'Configuration',
                                properties: [
                                    { key: 'retries', value: 3, editable: true },
                                    { key: 'timeout', value: '5000ms', editable: true },
                                    { key: 'async', value: true }
                                ]
                            }
                        ]}
                    />
                </div>

                <div className="gallery-item large">
                    <CsvPreview
                        title="IMPORT_PREVIEW.CSV"
                        csvData={`ID, Name, Department, Salary, Status
101, Sarah Connor, Defense, 85000, Active
102, John Smith, Accounting, 62000, On Leave
103, T-800, Security, 0, Decommissioned
104, Kyle Reese, Field Ops, 72000, Active
105, Miles Dyson, R&D, 120000, Active`}
                    />
                </div>

                <div className="gallery-item wide">
                    <DataMetricsBoard
                        metrics={[
                            { label: 'THROUGHPUT', value: '42.5k', change: 12.5, unit: 'req/s', trend: [10, 15, 12, 18, 25, 30, 28, 35, 40, 42] },
                            { label: 'LATENCY', value: '24', change: -5.2, unit: 'ms', trend: [40, 38, 35, 30, 28, 26, 25, 24, 24, 24] },
                            { label: 'ERROR RATE', value: '0.02', change: -0.1, unit: '%', trend: [0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.02] },
                            { label: 'CACHE HIT', value: '94.8', change: 2.1, unit: '%', trend: [80, 85, 88, 90, 92, 93, 94] }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};
