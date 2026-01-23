/**
 * Task Checklist Component
 * 
 * Bottom panel showing AgentPing step approvals and task workflows.
 */

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, AlertTriangle, Clock } from 'lucide-react';
import './TaskChecklist.css';

interface TaskStep {
    id: string;
    description: string;
    status: 'pending' | 'approved' | 'denied' | 'in_progress';
    risk?: 'low' | 'medium' | 'high';
}

export function TaskChecklist() {
    const [steps, setSteps] = useState<TaskStep[]>([]);

    // Connect to live data
    useEffect(() => {
        // @ts-ignore
        if (!window.coordinator || !window.agentPing) return;

        // 1. Sync from Coordinator (High-level tasks)
        // @ts-ignore
        const unsubCoord = window.coordinator.onUpdate((state) => {
            const taskSteps: TaskStep[] = state.tasks.map((t: any) => ({
                id: t.id,
                description: t.description,
                status: t.status === 'completed' ? 'approved' :
                    t.status === 'active' ? 'in_progress' : 'pending',
                risk: 'medium'
            }));

            setSteps(prev => {
                // Merge pings and coordinator tasks, prioritizing pings for interactivity
                const pingSteps = prev.filter(s => s.id.startsWith('ping-'));
                return [...taskSteps, ...pingSteps];
            });
        });

        // 2. Listen for MCP Pings (Checklists/Steps)
        const cleanupPing = window.agentPing.onPing(async (ping) => {
            if (ping.type === 'checklist' || ping.type === 'step') {
                const newStep: TaskStep = {
                    id: `ping-${ping.id}`,
                    description: ping.payload.description || ping.payload.title || 'Agent Action',
                    status: 'pending',
                    risk: ping.payload.risk || 'low'
                };

                setSteps(prev => [...prev, newStep]);
            }
        });

        return () => {
            unsubCoord();
            cleanupPing();
        };
    }, []);

    const toggleStep = async (id: string, currentStatus: TaskStep['status']) => {
        if (!id.startsWith('ping-')) return; // High-level tasks are read-only for now

        const pingId = id.replace('ping-', '');
        const nextStatus = currentStatus === 'pending' ? 'approved' :
            currentStatus === 'approved' ? 'denied' : 'pending';

        // Update local UI immediately
        setSteps(prev => prev.map(step =>
            step.id === id ? { ...step, status: nextStatus } : step
        ));

        // Respond to agent if approved/denied
        if (nextStatus === 'approved' || nextStatus === 'denied') {
            await window.agentPing?.respond(pingId, {
                action: nextStatus === 'approved' ? 'approve' : 'deny',
                data: { confirmed: nextStatus === 'approved' }
            });
        }
    };

    const getStatusIcon = (status: TaskStep['status']) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="status-icon status-approved" />;
            case 'denied': return <AlertTriangle size={16} className="status-icon status-denied" />;
            case 'in_progress': return <Clock size={16} className="status-icon status-progress" />;
            default: return <Circle size={16} className="status-icon status-pending" />;
        }
    };

    const getRiskBadge = (risk?: TaskStep['risk']) => {
        if (!risk) return null;
        return <span className={`risk-badge risk-${risk}`}>{risk}</span>;
    };

    const activeSteps = steps.filter(s => s.status === 'in_progress');
    const pendingSteps = steps.filter(s => s.status === 'pending');
    const completedSteps = steps.filter(s => s.status === 'approved' || s.status === 'denied');

    const approvedCount = steps.filter(s => s.status === 'approved').length;
    const totalCount = steps.length;

    return (
        <div className="task-checklist">
            <div className="checklist-header">
                <div className="header-left">
                    <div className="pulse-icon"><div className="dot" /></div>
                    <h2>Mission Progress</h2>
                </div>
                <div className="checklist-stats">
                    <span className="stat-count">SYSTEM READY • {approvedCount}/{totalCount} COMPLETE</span>
                    <div className="stat-bar">
                        <div
                            className="stat-fill"
                            style={{ width: `${totalCount > 0 ? (approvedCount / totalCount) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="checklist-scroller">
                <div className="checklist-grid">
                    {/* Active Tasks */}
                    {activeSteps.length > 0 && (
                        <div className="checklist-section">
                            <div className="section-title">ACTIVE TASKS ({activeSteps.length})</div>
                            <div className="section-items">
                                {activeSteps.map(step => (
                                    <div key={step.id} className="checklist-item status-in_progress active-pulse">
                                        {getStatusIcon(step.status)}
                                        <div className="item-content">
                                            <span className="item-description">{step.description}</span>
                                            {getRiskBadge(step.risk)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Actions */}
                    {pendingSteps.length > 0 && (
                        <div className="checklist-section">
                            <div className="section-title">WAITING FOR APPROVAL ({pendingSteps.length})</div>
                            <div className="section-items">
                                {pendingSteps.map(step => (
                                    <div
                                        key={step.id}
                                        className="checklist-item status-pending interactive"
                                        onClick={() => toggleStep(step.id, step.status)}
                                    >
                                        {getStatusIcon(step.status)}
                                        <div className="item-content">
                                            <span className="item-description">{step.description}</span>
                                            {getRiskBadge(step.risk)}
                                        </div>
                                        <div className="item-hint">CLICK TO APPROVE</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed */}
                    {completedSteps.length > 0 && (
                        <div className="checklist-section">
                            <div className="section-title">DELEGATED & COMPLETE ({completedSteps.length})</div>
                            <div className="section-items">
                                {completedSteps.map(step => (
                                    <div key={step.id} className={`checklist-item status-${step.status}`}>
                                        {getStatusIcon(step.status)}
                                        <div className="item-content">
                                            <span className="item-description">{step.description}</span>
                                            {getRiskBadge(step.risk)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {steps.length === 0 && (
                        <div className="checklist-empty">
                            <Clock size={32} className="text-muted" />
                            <p>WAITING FOR AGENT TASK EMISSION...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
