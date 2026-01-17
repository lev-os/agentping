import React from 'react';
import './ProcessTable.css';

interface Process {
    pid: number;
    name: string;
    user: string;
    cpu: number;
    mem: number;
    status: 'running' | 'sleeping' | 'zombie';
}

const PROCESSES: Process[] = [
    { pid: 1042, name: 'kernel_task', user: 'root', cpu: 12.5, mem: 4.2, status: 'running' },
    { pid: 2109, name: 'agent_core', user: 'system', cpu: 45.2, mem: 15.8, status: 'running' },
    { pid: 3044, name: 'data_stream', user: 'admin', cpu: 22.1, mem: 8.4, status: 'running' },
    { pid: 4112, name: 'ui_renderer', user: 'user', cpu: 5.4, mem: 12.1, status: 'sleeping' },
    { pid: 5991, name: 'bg_worker', user: 'system', cpu: 1.2, mem: 2.5, status: 'sleeping' },
];

export const ProcessTable: React.FC = () => {
    return (
        <div className="process-table-container">
            <div className="process-header">
                <div>PID</div>
                <div>NAME</div>
                <div>CPU</div>
                <div>MEM</div>
            </div>
            <div className="process-list">
                {PROCESSES.map((proc) => (
                    <div key={proc.pid} className="process-row">
                        <div className="col-pid">{proc.pid}</div>
                        <div className="col-name">{proc.name}</div>
                        <div className="col-cpu">
                            <div className="bar-container">
                                <div className="bar-fill" style={{ width: `${proc.cpu}%`, background: proc.cpu > 40 ? 'var(--accent-warning)' : 'var(--accent-primary)' }}></div>
                            </div>
                        </div>
                        <div className="col-mem">
                            <div className="bar-container">
                                <div className="bar-fill" style={{ width: `${proc.mem}%`, background: 'var(--accent-success)' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
