/**
 * Agent Dropdown - Header Component
 * 
 * Shows agent count and provides a dropdown to manage/terminate agents.
 */

import { useState, useEffect, useRef } from 'react';
import { Users, X, ChevronDown, Activity, AlertCircle } from 'lucide-react';
import './AgentDropdown.css';

interface AgentState {
    id: string;
    status: 'idle' | 'busy' | 'error' | 'running' | 'stopped';
    workingDir?: string;
    currentTask?: string;
    lockedFiles?: string[];
}

export function AgentDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [agents, setAgents] = useState<AgentState[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.coordinator) {
            const unsub = window.coordinator.onUpdate((state: any) => {
                setAgents(state.agents || []);
            });

            window.coordinator.getState().then((state: any) => {
                setAgents(state.agents || []);
            });

            return unsub;
        }
    }, []);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const terminateAgent = async (agentId: string) => {
        if (window.claudeCode) {
            try {
                await window.claudeCode.terminate(agentId);
                setAgents(prev => prev.filter(a => a.id !== agentId));
            } catch (err) {
                console.error('Failed to terminate agent:', err);
            }
        }
    };

    const terminateAll = async () => {
        if (window.claudeCode) {
            await window.claudeCode.terminateAll();
            setAgents([]);
            setIsOpen(false);
        }
    };


    const busyCount = agents.filter(a => a.status === 'busy' || a.status === 'running').length;

    return (
        <div className="agent-dropdown" ref={dropdownRef}>
            <button
                className={`agent-dropdown-trigger ${agents.length > 0 ? 'has-agents' : ''} ${busyCount > 0 ? 'has-busy' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Users size={14} />
                <span>{agents.length}</span>
                <ChevronDown size={12} className={isOpen ? 'rotated' : ''} />
            </button>

            {isOpen && (
                <div className="agent-dropdown-menu">
                    <div className="dropdown-header">
                        <span>Active Agents</span>
                        {agents.length > 0 && (
                            <button className="terminate-all-btn" onClick={terminateAll}>
                                <X size={12} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {agents.length === 0 ? (
                        <div className="dropdown-empty">
                            <AlertCircle size={16} />
                            <span>No active agents</span>
                        </div>
                    ) : (
                        <div className="dropdown-list">
                            {agents.map(agent => (
                                <div key={agent.id} className="agent-item">
                                    <div className="agent-item-left">
                                        <div className={`agent-dot status-${agent.status}`} />
                                        <div className="agent-item-info">
                                            <span className="agent-name">Agent {agent.id.slice(0, 6)}</span>
                                            {agent.workingDir && (
                                                <span className="agent-path">{agent.workingDir.split('/').pop()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        className="agent-terminate-btn"
                                        onClick={() => terminateAgent(agent.id)}
                                        title="Terminate Agent"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
