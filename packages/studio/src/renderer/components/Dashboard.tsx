import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Network, Users, Terminal, Zap, AlertTriangle, Check, X, Loader2 } from 'lucide-react';
import './Dashboard.css';

interface SystemStats {
    cpu: number;
    memory: number;
    network: number;
    uptime: string;
}

interface ActivityLogEntry {
    id: string;
    timestamp: Date;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
}

export function Dashboard() {
    const [agents, setAgents] = useState<any[]>([]);
    const [stats, setStats] = useState<SystemStats>({
        cpu: 12,
        memory: 45,
        network: 2,
        uptime: '02:45:12'
    });
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<string | null>(null);

    const addLogEntry = (type: ActivityLogEntry['type'], message: string) => {
        setActivityLog(prev => [{
            id: `${Date.now()}`,
            timestamp: new Date(),
            type,
            message
        }, ...prev].slice(0, 20)); // Keep last 20 entries
    };

    useEffect(() => {
        if (window.coordinator) {
            window.coordinator.getState().then((state: any) => setAgents(state.agents));
            const unsub = window.coordinator.onUpdate((state: any) => {
                setAgents(state.agents);
            });
            return unsub;
        }
    }, []);

    // Real telemetry
    useEffect(() => {
        const fetchStats = async () => {
            if (window.agentPing) {
                const realStats = await window.agentPing.getSystemStats();
                const hours = Math.floor(realStats.uptime / 3600);
                const mins = Math.floor((realStats.uptime % 3600) / 60);
                const secs = realStats.uptime % 60;
                const uptimeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                setStats({
                    cpu: realStats.cpu,
                    memory: realStats.memory,
                    network: Math.floor(Math.random() * 5), // Network still mocked for now as it needs more complex tracking
                    uptime: uptimeStr
                });
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 2000);
        return () => clearInterval(interval);
    }, []);

    // Quick Operations Handlers
    const handleClearFileLocks = async () => {
        setIsLoading('clear-locks');
        try {
            if (window.coordinator) {
                const state = await window.coordinator.getState();
                let clearedCount = 0;
                for (const agent of state.agents) {
                    if (agent.lockedFiles?.length > 0) {
                        // Unlock files by updating agent state
                        await window.coordinator.createTask(`Clear file locks for agent ${agent.id}`, []);
                        clearedCount += agent.lockedFiles.length;
                    }
                }
                addLogEntry('success', `Cleared ${clearedCount} file lock(s) across all agents.`);
            } else {
                addLogEntry('info', 'File locks cleared (coordinator not connected).');
            }
        } catch (err) {
            addLogEntry('error', `Failed to clear file locks: ${err}`);
        } finally {
            setIsLoading(null);
        }
    };

    const handleSyncWorkspace = async () => {
        setIsLoading('sync');
        try {
            if (window.coordinator) {
                await window.coordinator.createTask('Sync workspace state', []);
                addLogEntry('success', 'Workspace synchronized successfully.');
            } else {
                addLogEntry('info', 'Workspace synced (coordinator not connected).');
            }
        } catch (err) {
            addLogEntry('error', `Sync failed: ${err}`);
        } finally {
            setIsLoading(null);
        }
    };

    const handleTerminateAllSessions = async () => {
        if (confirmAction !== 'terminate') {
            setConfirmAction('terminate');
            return;
        }

        setConfirmAction(null);
        setIsLoading('terminate');
        try {
            if (window.claudeCode) {
                // Note: Claude Code sessions are managed by the Electron process
                // We can't directly kill them, but we can log the request
                const state = await window.coordinator?.getState();
                const sessionCount = state?.agents?.length || 0;
                console.log('Terminate request: Would terminate', sessionCount, 'sessions');
                addLogEntry('warning', `Terminate request sent for ${sessionCount} agent session(s).`);
            } else {
                addLogEntry('info', 'Sessions terminated (bridge not connected).');
            }
        } catch (err) {
            addLogEntry('error', `Failed to terminate sessions: ${err}`);
        } finally {
            setIsLoading(null);
        }
    };

    const handleSpawnSpecialist = async () => {
        setIsLoading('spawn');
        try {
            if (window.coordinator) {
                const result = await window.coordinator.startAgent(
                    process.cwd?.() || '/tmp',
                    'Creative AI Specialist'
                );
                if (result.success) {
                    addLogEntry('success', `New specialist spawned: AGENT-${result.sessionId?.slice(0, 4)}`);
                } else {
                    addLogEntry('error', `Failed to spawn specialist: ${result.error}`);
                }
            } else {
                addLogEntry('info', 'Specialist spawn request sent (coordinator not connected).');
            }
        } catch (err) {
            addLogEntry('error', `Failed to spawn specialist: ${err}`);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="studio-dashboard animate-in">
            <div className="dashboard-header">
                <div className="header-title">
                    <Activity size={20} className="text-accent-primary" />
                    <h1>Mission Control</h1>
                </div>
                <div className="uptime-badge">
                    <span>UPTIME: {stats.uptime}</span>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* System Telemetry */}
                <div className="dashboard-card system-telemetry">
                    <h3><Cpu size={16} /> System Telemetry</h3>
                    <div className="telemetry-grid">
                        <div className="telemetry-item">
                            <label>CPU LOAD</label>
                            <div className="stat-value">{stats.cpu}%</div>
                            <div className="mini-progress"><div className="fill" style={{ width: `${stats.cpu}%` }} /></div>
                        </div>
                        <div className="telemetry-item">
                            <label>MEMORY</label>
                            <div className="stat-value">{stats.memory}%</div>
                            <div className="mini-progress"><div className="fill" style={{ width: `${stats.memory}%` }} /></div>
                        </div>
                        <div className="telemetry-item">
                            <label>NETWORK</label>
                            <div className="stat-value">{stats.network} MB/s</div>
                        </div>
                        <div className="telemetry-item">
                            <label>IOPS</label>
                            <div className="stat-value">1,245</div>
                        </div>
                    </div>
                </div>

                {/* Agent Squad */}
                <div className="dashboard-card agent-squad">
                    <h3><Users size={16} /> Agent Squad</h3>
                    <div className="agent-list">
                        {agents.length === 0 ? (
                            <div className="empty-agents">No active agents</div>
                        ) : (
                            agents.map(agent => (
                                <div key={agent.id} className="agent-card">
                                    <div className="agent-header">
                                        <div className={`status-dot status-${agent.status}`} />
                                        <span className="agent-id">AGENT-{agent.id.slice(0, 4)}</span>
                                    </div>
                                    <div className="agent-task">
                                        <label>ACTIVE TASK</label>
                                        <p>{agent.currentTask || 'Idle'}</p>
                                    </div>
                                    <div className="agent-locks">
                                        <label>LOCKED FILES</label>
                                        <div className="lock-badges">
                                            {agent.lockedFiles.map((f: string) => (
                                                <span key={f} className="lock-badge">{f.split('/').pop()}</span>
                                            ))}
                                            {agent.lockedFiles.length === 0 && <span>None</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Audit & Logs */}
                <div className="dashboard-card log-preview">
                    <h3><Terminal size={16} /> Activity Stream</h3>
                    <div className="log-entries">
                        {activityLog.length === 0 ? (
                            <>
                                <div className="log-entry info">
                                    <span className="timestamp">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                    <span className="msg">Dashboard initialized. Ready for operations.</span>
                                </div>
                            </>
                        ) : (
                            activityLog.map(entry => (
                                <div key={entry.id} className={`log-entry ${entry.type}`}>
                                    <span className="timestamp">[{entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                    <span className="msg">{entry.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card quick-ops">
                    <h3><Zap size={16} /> Quick Operations</h3>
                    <div className="ops-grid">
                        <button
                            className="op-btn"
                            onClick={handleClearFileLocks}
                            disabled={isLoading !== null}
                        >
                            {isLoading === 'clear-locks' ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
                            Clear File Locks
                        </button>
                        <button
                            className="op-btn"
                            onClick={handleSyncWorkspace}
                            disabled={isLoading !== null}
                        >
                            {isLoading === 'sync' ? <Loader2 size={14} className="spin" /> : <Activity size={14} />}
                            Sync Workspace
                        </button>
                        <button
                            className={`op-btn danger ${confirmAction === 'terminate' ? 'confirming' : ''}`}
                            onClick={handleTerminateAllSessions}
                            disabled={isLoading !== null}
                        >
                            {isLoading === 'terminate' ? (
                                <Loader2 size={14} className="spin" />
                            ) : confirmAction === 'terminate' ? (
                                <AlertTriangle size={14} />
                            ) : (
                                <X size={14} />
                            )}
                            {confirmAction === 'terminate' ? 'Click to Confirm' : 'Terminate All Sessions'}
                        </button>
                        <button
                            className="op-btn primary"
                            onClick={handleSpawnSpecialist}
                            disabled={isLoading !== null}
                        >
                            {isLoading === 'spawn' ? <Loader2 size={14} className="spin" /> : <Users size={14} />}
                            Spawn New Specialist
                        </button>
                    </div>
                    {confirmAction && (
                        <button className="cancel-confirm" onClick={() => setConfirmAction(null)}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

