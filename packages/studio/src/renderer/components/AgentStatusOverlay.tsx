/**
 * Agent Status Overlay
 * 
 * floating panel showing parallel agent statuses and tasks.
 */

import { useState, useEffect } from 'react';
import { Users, Lock, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import './AgentStatusOverlay.css';

interface AgentState {
    id: string;
    status: 'idle' | 'busy' | 'error';
    currentTask?: string;
    lockedFiles: string[];
}

interface AgentStatusOverlayProps {
    agents: AgentState[];
}

export function AgentStatusOverlay() {
    const [expanded, setExpanded] = useState(false);
    const [agents, setAgents] = useState<AgentState[]>([]);

    useEffect(() => {
        if (window.coordinator) {
            const unsub = window.coordinator.onUpdate((state) => {
                setAgents(state.agents);
            });

            // Initial sync
            window.coordinator.getState().then((state) => {
                setAgents(state.agents);
            });

            return unsub;
        }
    }, []);

    if (agents.length === 0) return null;

    return (
        <div className={`agent-status-overlay ${expanded ? 'expanded' : ''}`}>
            <div className="overlay-header" onClick={() => setExpanded(!expanded)}>
                <div className="header-left">
                    <Users size={16} className="text-accent-secondary" />
                    <span>{agents.length} Agent{agents.length !== 1 ? 's' : ''} Active</span>
                </div>
                {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>

            {expanded && (
                <div className="overlay-content">
                    {agents.map(agent => (
                        <div key={agent.id} className="agent-row">
                            <div className="agent-info">
                                <div className={`agent-status-dot status-${agent.status}`} />
                                <span className="agent-id">Agent {agent.id.slice(0, 4)}</span>
                            </div>
                            {agent.lockedFiles.length > 0 && (
                                <div className="agent-locks">
                                    <Lock size={12} />
                                    <span>{agent.lockedFiles.length} files locked</span>
                                </div>
                            )}
                            {agent.currentTask && (
                                <div className="agent-task">
                                    <Activity size={12} />
                                    <span>Processing task...</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
