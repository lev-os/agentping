/**
 * AgentPing Web UI - Main App Component
 */

import { useState, useCallback } from 'react';
import type { Ping, Directive } from '@agentping/core';
import { usePings, useWebSocket, useKeyboard, usePingResponse } from './hooks';
import { useAgentPing } from './hooks/useAgentPing';
import { respondToPing, dismissPing, buildStepApprovalResponse, buildSelectionResponse, buildApprovalResponse, buildAnswerResponse, buildTaskWorkflowResponse, buildLeaseResponse } from './api';
import {
    type Alert as ProofAlert,
    type LeaseApprovalProps,
    type PendingApproval,
    type StatItem,
    type Task,
    type TaskStep,
} from '@kingly/ui/components';
import {
    PingCard,
    StepChecklist,
    SelectionList,
    ApprovalButtons,
    QuestionInput,
    SecretInput,
    DirectionPicker,
    NotificationBanner,
    EnrichmentPanel,
    QuickActionBar,
    TaskWorkflow,
    PrimitivesGallery,
    HistoryView,
    LandingPage,
    LeaseApproval
} from './components';
import { CanvasRenderer } from './components/canvas/CanvasRenderer';
import { PolymorphPlayground } from './components/canvas/PolymorphPlayground';
import { componentRegistry } from './renderers';
import './components/Layout.css';
import './App.css';

type AppView = 'queue' | 'history' | 'gallery' | 'studio' | 'landing' | 'proof';

const VALID_VIEWS: AppView[] = ['queue', 'history', 'gallery', 'studio', 'landing', 'proof'];

const FALLBACK_APPROVALS: PendingApproval[] = [
    {
        id: 'proof-ap-1',
        toolName: 'Deploy',
        description: 'Approve canary deploy for api-gateway v3.8.1',
        input: { service: 'api-gateway', version: '3.8.1', env: 'production' },
        timestamp: new Date('2026-03-10T02:00:00Z'),
        diff: '+ canary: 10%\n+ rollout_strategy: progressive',
    },
    {
        id: 'proof-ap-2',
        toolName: 'Edit',
        description: 'Review proposed worker-pool scaling change',
        input: { file: '/etc/agentping/workers.yaml', change: 'replicas 8 -> 16' },
        timestamp: new Date('2026-03-10T02:03:00Z'),
    },
];

const FALLBACK_TASKS: Task[] = [
    { id: 'proof-task-1', title: 'Approve production canary rollout', status: 'running', priority: 9 },
    { id: 'proof-task-2', title: 'Rotate staging secrets', status: 'queued', priority: 7 },
    { id: 'proof-task-3', title: 'Publish dashboard health digest', status: 'queued', priority: 5 },
];

const FALLBACK_STEPS: TaskStep[] = [
    { id: 'proof-step-1', title: 'Validate deployment manifest', status: 'complete', agent: 'Deploy Agent' },
    { id: 'proof-step-2', title: 'Run canary health checks', status: 'waiting_approval', agent: 'QA Validator' },
    { id: 'proof-step-3', title: 'Promote canary to full production', status: 'pending', agent: 'Deploy Agent' },
];

const FALLBACK_ALERTS: ProofAlert[] = [
    {
        id: 'proof-alert-1',
        severity: 'high',
        title: 'Seeded proof dataset',
        message: 'No live pending pings yet, showing the approval surface with seeded scenario data.',
        timestamp: 'now',
        source: 'proof-surface',
    },
];

const FALLBACK_LEASES: LeaseApprovalProps[] = [
    {
        id: 'proof-lease-1',
        agent: 'Research Bot',
        resource: 'browser',
        status: 'pending',
        requestedAt: 'now',
        expiresAt: '2026-03-10T03:15:00Z',
        reason: 'Inspect release notes before rollout',
    },
];

function getInitialView(): AppView {
    const queryValue = new URLSearchParams(window.location.search).get('view');
    return VALID_VIEWS.includes(queryValue as AppView) ? (queryValue as AppView) : 'landing';
}

function getInitialGallerySection(): string | undefined {
    const section = new URLSearchParams(window.location.search).get('section');
    return section ?? undefined;
}

function getPingTitle(ping: Ping): string {
    const payload = ping.payload as any;

    switch (ping.payload.type) {
        case 'approval':
        case 'step_approval':
        case 'selection':
        case 'research_request':
        case 'review_request':
        case 'task_workflow':
        case 'secret':
            return payload.title ?? payload.question ?? ping.type;
        case 'notification':
            return payload.message ?? ping.type;
        case 'lease_request':
            return `${payload.scope} lease request`;
        case 'canvas_interaction':
            return payload.componentName ?? payload.props?.widgetId ?? 'Canvas interaction';
        case 'question':
            return payload.question ?? 'Question';
        default:
            return ping.type;
    }
}

function toQueueStatus(ping: Ping): Task['status'] {
    if (ping.status === 'responded') return 'done';
    if (ping.status === 'dismissed' || ping.status === 'expired') return 'failed';
    if (ping.type === 'approval' || ping.type === 'step_approval' || ping.type === 'lease_request') return 'running';
    return 'queued';
}

export default function App() {
    const { pings, loading, error, refresh } = usePings();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [view, setView] = useState<AppView>(() => getInitialView());
    const [initialGallerySection] = useState<string | undefined>(() => getInitialGallerySection());
    const [expanded, setExpanded] = useState(false);
    const [sidebarManuallyCollapsed, setSidebarManuallyCollapsed] = useState(false);
    const { pings: canvasPings, respond: respondToCanvasPing } = useAgentPing(view === 'studio');

    const selectedPing = pings[selectedIndex] || null;
    const responseState = usePingResponse(selectedPing);
    const pendingPings = pings.filter((ping) => ping.status === 'pending');
    const usingProofFallback = pendingPings.length === 0;

    const proofApprovals: Array<PendingApproval & { pingId?: string; pingType?: Ping['type']; stepIds?: string[] }> = usingProofFallback
        ? FALLBACK_APPROVALS
        : pendingPings
            .filter((ping) => ping.payload.type === 'approval' || ping.payload.type === 'step_approval')
            .map((ping) => {
                if (ping.payload.type === 'step_approval') {
                    const payload = ping.payload as any;
                    return {
                        id: ping.id,
                        pingId: ping.id,
                        pingType: ping.payload.type,
                        toolName: 'Step Approval',
                        description: payload.context ?? payload.title,
                        input: {
                            title: payload.title,
                            allowPartial: payload.allowPartial,
                            totalSteps: payload.steps.length,
                        },
                        timestamp: new Date(ping.createdAt),
                        stepIds: payload.steps.map((step: any) => step.id),
                    };
                }

                const payload = ping.payload as any;
                return {
                    id: ping.id,
                    pingId: ping.id,
                    pingType: ping.payload.type,
                    toolName: payload.action ?? 'Approval',
                    description: payload.details ?? payload.title,
                    input: {
                        title: payload.title,
                        risk: payload.risk ?? 'unknown',
                    },
                    timestamp: new Date(ping.createdAt),
                };
            });

    const activeStepPing = pendingPings.find((ping) => ping.payload.type === 'step_approval');
    const proofSteps: TaskStep[] = usingProofFallback
        ? FALLBACK_STEPS
        : activeStepPing
            ? (activeStepPing.payload as any).steps.map((step: any) => ({
                id: step.id,
                title: step.description,
                description: step.details ?? step.estimatedImpact,
                status: 'waiting_approval' as const,
                agent: activeStepPing.agentName,
            }))
            : [];

    const proofLeases: Array<LeaseApprovalProps & { pingId?: string }> = usingProofFallback
        ? FALLBACK_LEASES
        : pendingPings
            .filter((ping) => ping.payload.type === 'lease_request')
            .map((ping) => {
                const payload = ping.payload as any;
                return {
                    pingId: ping.id,
                    agentId: ping.agentId,
                    agentName: ping.agentName,
                    resource: payload.scope,
                    status: 'pending' as const,
                    requestedAt: new Date(ping.createdAt).toLocaleTimeString(),
                    expiresAt: ping.expiresAt ? new Date(ping.expiresAt) : undefined,
                    reason: payload.reason,
                };
            });

    const proofTasks: Task[] = usingProofFallback
        ? FALLBACK_TASKS
        : pendingPings.slice(0, 8).map((ping, index) => ({
            id: ping.id,
            title: getPingTitle(ping),
            status: toQueueStatus(ping),
            priority: Math.max(3, 9 - index),
        }));

    const proofAlerts: ProofAlert[] = usingProofFallback
        ? FALLBACK_ALERTS
        : [
            ...(error ? [{
                id: 'proof-alert-error',
                severity: 'critical' as const,
                title: 'Web UI fetch issue',
                message: error,
                timestamp: 'now',
                source: 'web-ui',
            }] : []),
            ...pendingPings
                .filter((ping) => ping.payload.type === 'approval' && (ping.payload as any).risk === 'high')
                .map((ping) => ({
                    id: `proof-alert-${ping.id}`,
                    severity: 'high' as const,
                    title: getPingTitle(ping),
                    message: (ping.payload as any).details ?? 'High-risk approval pending human action.',
                    timestamp: new Date(ping.createdAt).toLocaleTimeString(),
                    source: ping.agentName,
                })),
        ];

    const proofStats: StatItem[] = [
        { label: 'Pending Pings', value: pendingPings.length },
        { label: 'Approvals', value: proofApprovals.length },
        { label: 'Leases', value: proofLeases.length },
        { label: 'Fallback', value: usingProofFallback ? 'Seeded' : 'Live' },
    ];

    // Toggle Expand Mode
    const toggleExpand = useCallback(() => {
        setExpanded(prev => !prev);
    }, []);

    // Toggle Sidebar
    const toggleSidebar = useCallback(() => {
        setSidebarManuallyCollapsed(prev => !prev);
    }, []);

    // WebSocket for real-time updates
    useWebSocket(useCallback((data) => {
        if (data.type === 'ping:created' || data.type === 'ping:responded') {
            refresh();
        }
    }, [refresh]));

    // Keyboard navigation
    useKeyboard({
        onPrevious: () => setSelectedIndex(i => Math.max(0, i - 1)),
        onNext: () => setSelectedIndex(i => Math.min(pings.length - 1, i + 1)),
        onApproveAll: () => handleApproveAll(),
        onDenyAll: () => handleDenyAll(),
        onDismiss: () => handleDismiss(),
        onExpandToggle: () => toggleExpand(),
    });

    // Response handlers
    const handleApproveAll = async () => {
        if (!selectedPing) return;

        try {
            if (selectedPing.payload.type === 'step_approval') {
                const payload = selectedPing.payload as any;
                const allIds = payload.steps.map((s: any) => s.id);
                await respondToPing(
                    selectedPing.id,
                    buildStepApprovalResponse(allIds, [], {
                        directives: responseState.directives,
                        notes: responseState.notes || undefined,
                    })
                );
            } else {
                await respondToPing(selectedPing.id, buildApprovalResponse(true));
            }
            refresh();
        } catch (e) {
            console.error('Failed to approve:', e);
        }
    };

    const handleDenyAll = async () => {
        if (!selectedPing) return;

        try {
            if (selectedPing.payload.type === 'step_approval') {
                const payload = selectedPing.payload as any;
                const allIds = payload.steps.map((s: any) => s.id);
                await respondToPing(
                    selectedPing.id,
                    buildStepApprovalResponse([], allIds, {
                        directives: responseState.directives,
                        notes: responseState.notes || undefined,
                    })
                );
            } else {
                await respondToPing(selectedPing.id, buildApprovalResponse(false));
            }
            refresh();
        } catch (e) {
            console.error('Failed to deny:', e);
        }
    };

    const handleApproveSelected = async () => {
        if (!selectedPing || selectedPing.payload.type !== 'step_approval') return;

        const payload = selectedPing.payload as any;
        const allIds = payload.steps.map((s: any) => s.id);
        const approved = Array.from(responseState.selectedSteps);
        const denied = allIds.filter((id: string) => !responseState.selectedSteps.has(id));

        try {
            await respondToPing(
                selectedPing.id,
                buildStepApprovalResponse(approved, denied, {
                    directives: responseState.directives,
                    notes: responseState.notes || undefined,
                })
            );
            refresh();
        } catch (e) {
            console.error('Failed to approve selected:', e);
        }
    };

    const handleSelect = async () => {
        if (!selectedPing || selectedPing.payload.type !== 'selection') return;

        try {
            await respondToPing(
                selectedPing.id,
                buildSelectionResponse(Array.from(responseState.selectedOptions), undefined, {
                    directives: responseState.directives,
                    notes: responseState.notes || undefined,
                })
            );
            refresh();
        } catch (e) {
            console.error('Failed to select:', e);
        }
    };

    const handleAnswer = async () => {
        if (!selectedPing || !responseState.answerValue) return;

        try {
            await respondToPing(
                selectedPing.id,
                buildAnswerResponse(responseState.answerValue, {
                    directives: responseState.directives,
                    notes: responseState.notes || undefined,
                })
            );
            refresh();
        } catch (e) {
            console.error('Failed to answer:', e);
        }
    };

    const handleDismiss = async () => {
        if (!selectedPing) return;

        try {
            await dismissPing(selectedPing.id, {
                directives: responseState.directives,
                notes: responseState.notes || undefined,
            });
            refresh();
        } catch (e) {
            console.error('Failed to dismiss:', e);
        }
    };

    const handleProofApproval = async (
        approval: PendingApproval & { pingId?: string; pingType?: Ping['type']; stepIds?: string[] },
        approved: boolean,
    ) => {
        if (!approval.pingId || !approval.pingType) return;

        try {
            if (approval.pingType === 'approval') {
                await respondToPing(approval.pingId, buildApprovalResponse(approved));
            } else if (approval.pingType === 'step_approval') {
                await respondToPing(
                    approval.pingId,
                    buildStepApprovalResponse(
                        approved ? (approval.stepIds ?? []) : [],
                        approved ? [] : (approval.stepIds ?? []),
                    ),
                );
            }
            refresh();
        } catch (e) {
            console.error('Failed to respond to proof approval:', e);
        }
    };

    const handleProofLease = async (pingId: string | undefined, granted: boolean) => {
        if (!pingId) return;

        try {
            await respondToPing(pingId, buildLeaseResponse(granted));
            refresh();
        } catch (e) {
            console.error('Failed to respond to proof lease:', e);
        }
    };

    const handleProofStep = async (stepId: string, approved: boolean) => {
        if (!activeStepPing || activeStepPing.payload.type !== 'step_approval') return;

        try {
            await respondToPing(
                activeStepPing.id,
                buildStepApprovalResponse(
                    approved ? [stepId] : [],
                    approved ? [] : [stepId],
                ),
            );
            refresh();
        } catch (e) {
            console.error('Failed to respond to proof step:', e);
        }
    };

    const renderProofSurface = () => (
        <div className="app-canvas" style={{ height: 'calc(100vh - 57px)', padding: '24px', overflow: 'auto' }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <section className="app-card">
                    <div className="app-card-header">
                        <h3>Live Host Proof: Alerts, Queues & Approvals</h3>
                        <p>{usingProofFallback ? 'Seeded fallback dataset because the live queue is empty.' : `Derived from ${pendingPings.length} live pending ping(s).`}</p>
                    </div>
                    <div className="app-card-body">
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: 12,
                            }}
                        >
                            {proofStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    style={{
                                        border: '1px solid rgba(0, 229, 255, 0.16)',
                                        background: 'rgba(0, 0, 0, 0.35)',
                                        borderRadius: '10px',
                                        padding: '14px 16px',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '11px',
                                            color: 'var(--text-secondary)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 6,
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '24px',
                                            color: 'var(--accent-primary)',
                                            textShadow: '0 0 8px rgba(0, 229, 255, 0.24)',
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.1fr) minmax(420px, 1.8fr) minmax(280px, 1fr)', gap: 16 }}>
                    <section className="app-card">
                        <div className="app-card-header">
                            <h3>Queue & Alerts</h3>
                            <p>Standalone runtime work waiting on human confirmation.</p>
                        </div>
                        <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {proofTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        style={{
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '10px',
                                            padding: '12px 14px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                            <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{task.title}</strong>
                                            <span
                                                style={{
                                                    fontFamily: 'var(--font-mono)',
                                                    fontSize: 11,
                                                    color: task.status === 'running' ? 'var(--warning)' : task.status === 'queued' ? 'var(--text-secondary)' : 'var(--success)',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {task.status}
                                            </span>
                                        </div>
                                        <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                                            Priority {task.priority}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {proofAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        style={{
                                            borderLeft: `3px solid ${alert.severity === 'critical' ? 'var(--danger)' : alert.severity === 'high' ? 'var(--warning)' : 'var(--accent-primary)'}`,
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: '10px',
                                            padding: '12px 14px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                            <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{alert.title}</strong>
                                            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{alert.timestamp}</span>
                                        </div>
                                        <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 13 }}>{alert.message}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="app-card">
                        <div className="app-card-header">
                            <h3>Approval Center</h3>
                            <p>First rich-surface proof on the live AgentPing host path.</p>
                        </div>
                        <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                                <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>
                                    {proofApprovals.length} pending approval{proofApprovals.length === 1 ? '' : 's'}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => { void Promise.all(proofApprovals.map((approval) => handleProofApproval(approval, true))); }}
                                        style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0, 255, 157, 0.16)', color: 'rgb(190, 255, 220)', border: '1px solid rgba(0, 255, 157, 0.28)' }}
                                    >
                                        Approve All
                                    </button>
                                    <button
                                        onClick={() => { void Promise.all(proofApprovals.map((approval) => handleProofApproval(approval, false))); }}
                                        style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255, 42, 109, 0.16)', color: 'rgb(255, 199, 215)', border: '1px solid rgba(255, 42, 109, 0.28)' }}
                                    >
                                        Reject All
                                    </button>
                                </div>
                            </div>
                            {proofApprovals.map((approval) => (
                                <div
                                    key={approval.id}
                                    style={{
                                        border: '1px solid rgba(255, 184, 0, 0.22)',
                                        background: 'rgba(255, 184, 0, 0.08)',
                                        borderRadius: 10,
                                        padding: '14px 16px',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{approval.description}</div>
                                            <div style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{approval.toolName}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button
                                                onClick={() => { void handleProofApproval(approval, true); }}
                                                style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0, 255, 157, 0.16)', color: 'rgb(190, 255, 220)', border: '1px solid rgba(0, 255, 157, 0.28)' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => { void handleProofApproval(approval, false); }}
                                                style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255, 42, 109, 0.16)', color: 'rgb(255, 199, 215)', border: '1px solid rgba(255, 42, 109, 0.28)' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {proofSteps.map((step) => (
                                    <div
                                        key={step.id}
                                        style={{
                                            border: '1px solid var(--border-color)',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            borderRadius: 10,
                                            padding: '12px 14px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                                            <div>
                                                <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{step.title}</div>
                                                <div style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: 12 }}>{step.agent}</div>
                                            </div>
                                            <span style={{ color: step.status === 'complete' ? 'var(--success)' : step.status === 'waiting_approval' ? 'var(--warning)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase' }}>
                                                {step.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        {step.status === 'waiting_approval' && (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                                <button
                                                    onClick={() => { void handleProofStep(step.id, true); }}
                                                    style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0, 255, 157, 0.16)', color: 'rgb(190, 255, 220)', border: '1px solid rgba(0, 255, 157, 0.28)' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => { void handleProofStep(step.id, false); }}
                                                    style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255, 42, 109, 0.16)', color: 'rgb(255, 199, 215)', border: '1px solid rgba(255, 42, 109, 0.28)' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="app-card">
                        <div className="app-card-header">
                            <h3>Lease Queue</h3>
                            <p>Live lease approvals from the daemon-backed host path.</p>
                        </div>
                        <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {proofLeases.map((lease) => (
                                (() => {
                                    const expiresLabel =
                                        lease.expiresAt instanceof Date
                                            ? lease.expiresAt.toLocaleString()
                                            : lease.expiresAt ?? 'unknown';

                                    return (
                                <div
                                    key={lease.pingId ?? lease.id}
                                    style={{
                                        border: '1px solid rgba(0, 229, 255, 0.18)',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: 10,
                                        padding: '14px 16px',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                                        <div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{lease.agent}</div>
                                            <div style={{ marginTop: 4, color: 'var(--text-secondary)', fontSize: 12 }}>{lease.resource}</div>
                                        </div>
                                        <span style={{ color: 'var(--warning)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase' }}>
                                            {lease.status}
                                        </span>
                                    </div>
                                    {lease.reason && (
                                        <div style={{ marginTop: 10, color: 'var(--text-secondary)', fontSize: 13 }}>{lease.reason}</div>
                                    )}
                                    <div style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                                        Requested {lease.requestedAt} · Expires {expiresLabel}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                        <button
                                            onClick={() => { void handleProofLease(lease.pingId, true); }}
                                            style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0, 255, 157, 0.16)', color: 'rgb(190, 255, 220)', border: '1px solid rgba(0, 255, 157, 0.28)' }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => { void handleProofLease(lease.pingId, false); }}
                                            style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                        >
                                            Deny
                                        </button>
                                    </div>
                                </div>
                                    );
                                })()
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );

    // Render interaction based on ping type
    const renderInteraction = () => {
        if (!selectedPing) return null;

        switch (selectedPing.payload.type) {
            case 'step_approval': {
                const payload = selectedPing.payload as any;
                return (
                    <StepChecklist
                        steps={payload.steps}
                        selectedSteps={responseState.selectedSteps}
                        onToggle={responseState.toggleStep}
                        groupByRisk
                    />
                );
            }
            case 'selection': {
                const payload = selectedPing.payload as any;
                return (
                    <SelectionList
                        options={payload.options}
                        selectedOptions={responseState.selectedOptions}
                        onToggle={responseState.toggleOption}
                        allowMultiple={payload.allowMultiple}
                    />
                );
            }
            case 'approval': {
                const payload = selectedPing.payload as any;
                return (
                    <ApprovalButtons
                        title={payload.title}
                        details={payload.details}
                        risk={payload.risk}
                        onApprove={handleApproveAll}
                        onDeny={handleDenyAll}
                    />
                );
            }
            case 'question': {
                const payload = selectedPing.payload as any;
                return (
                    <QuestionInput
                        question={payload.question}
                        context={payload.context}
                        options={payload.options}
                        value={responseState.answerValue}
                        onChange={responseState.setAnswer}
                        onSubmit={handleAnswer}
                    />
                );
            }
            case 'research_request': {
                const payload = selectedPing.payload as any;
                return (
                    <DirectionPicker
                        directions={payload.proposedDirections}
                        selectedDirections={responseState.selectedOptions}
                        onToggle={responseState.toggleOption}
                        allowCustom={payload.allowCustomDirection}
                    />
                );
            }
            case 'notification': {
                const payload = selectedPing.payload as any;
                return (
                    <NotificationBanner
                        message={payload.message}
                        level={payload.level}
                        onDismiss={handleDismiss}
                    />
                );
            }
            case 'task_workflow': {
                const payload = selectedPing.payload as any;
                return (
                    <TaskWorkflow
                        title={payload.title}
                        description={payload.description}
                        steps={payload.steps}
                        allowNotes={payload.allowNotes ?? true}
                        onComplete={async (completedSteps, notes) => {
                            try {
                                await respondToPing(
                                    selectedPing.id,
                                    buildTaskWorkflowResponse(completedSteps, notes)
                                );
                                refresh();
                            } catch (e) {
                                console.error('Failed to complete workflow:', e);
                            }
                        }}
                        onDismiss={handleDismiss}
                    />
                );
            }
            case 'lease_request': {
                const payload = selectedPing.payload as any;
                return (
                    <LeaseApproval
                        agentId={selectedPing.agentId}
                        agentName={selectedPing.agentName}
                        scope={payload.scope}
                        ttl={payload.ttl}
                        reason={payload.reason}
                        constraints={payload.constraints}
                        status={selectedPing.status === 'responded'
                            ? (selectedPing.response?.action === 'approved' ? 'active' : 'denied')
                            : selectedPing.status === 'expired' ? 'expired' : 'pending'}
                        expiresAt={selectedPing.response?.action === 'approved' && selectedPing.expiresAt
                            ? new Date(selectedPing.expiresAt) : undefined}
                        onApprove={async () => {
                            try {
                                await respondToPing(selectedPing.id, buildLeaseResponse(true));
                                refresh();
                            } catch (e) {
                                console.error('Failed to grant lease:', e);
                            }
                        }}
                        onDeny={async () => {
                            try {
                                await respondToPing(selectedPing.id, buildLeaseResponse(false));
                                refresh();
                            } catch (e) {
                                console.error('Failed to deny lease:', e);
                            }
                        }}
                    />
                );
            }
            case 'secret': {
                const payload = selectedPing.payload as any;
                return (
                    <div className="flex flex-col gap-4 p-4">
                        <div className="text-red-400 font-bold">🔒 {payload.title}</div>
                        <div className="text-gray-400">{payload.question}</div>
                        <SecretInput
                            value={responseState.answerValue || ''}
                            onChange={responseState.setAnswer}
                            placeholder="Enter secret value..."
                        />
                        <button
                            className="cyber-button primary mt-4"
                            onClick={handleAnswer}
                        >
                            Submit Secret
                        </button>
                    </div>
                );
            }
            case 'custom': {
                const payload = selectedPing.payload as any;
                const Component = componentRegistry[payload.customType as keyof typeof componentRegistry];
                if (Component) {
                    // Dynamic rendering of any registry component
                    return <Component {...payload.data} />;
                }
                return (
                    <div className="generic-ping">
                        Unknown custom component: {payload.customType}
                        <pre>{JSON.stringify(payload.data, null, 2)}</pre>
                    </div>
                );
            }
            default:
                return <div className="generic-ping">Unknown ping type</div>;
        }
    };

    // Quick actions based on ping type
    const getQuickActions = () => {
        if (!selectedPing) return [];

        const actions = selectedPing.parsedInteraction?.quickActions || [];
        return actions.map(action => ({
            ...action,
            onClick: () => {
                switch (action.action.type) {
                    case 'approve_all':
                        handleApproveAll();
                        break;
                    case 'deny_all':
                        handleDenyAll();
                        break;
                    case 'approve_selected':
                        handleApproveSelected();
                        break;
                }
            },
        }));
    };

    return (
        <div className={`app app-layout ${expanded ? 'expanded' : ''}`}>
            {/* Header */}
            <header className="header">
                <div className="header-left">
                    <h1 className="logo" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>⚡ AgentPing</h1>
                    <nav className="nav">
                        <button
                            className={`nav-btn ${!sidebarManuallyCollapsed ? 'active' : ''}`}
                            onClick={toggleSidebar}
                            title={sidebarManuallyCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                        >
                            {sidebarManuallyCollapsed ? '◨' : '◧'}
                        </button>
                        <button
                            className={`nav-btn ${view === 'queue' ? 'active' : ''}`}
                            onClick={() => setView('queue')}
                        >
                            Queue {pings.length > 0 && <span className="badge">{pings.length}</span>}
                        </button>
                        <button
                            className={`nav-btn ${view === 'history' ? 'active' : ''}`}
                            onClick={() => setView('history')}
                        >
                            History
                        </button>
                        <button
                            className={`nav-btn ${view === 'gallery' ? 'active' : ''}`}
                            onClick={() => setView('gallery')}
                        >
                            Gallery
                        </button>
                        <button
                            className={`nav-btn ${view === 'studio' ? 'active' : ''}`}
                            onClick={() => setView('studio')}
                        >
                            Studio
                        </button>
                        <button
                            className={`nav-btn ${view === 'proof' ? 'active' : ''}`}
                            onClick={() => setView('proof')}
                        >
                            Proof
                        </button>
                    </nav>
                </div>
                <div className="header-right">
                    <button
                        className={`nav-btn ${expanded ? 'active' : ''}`}
                        onClick={toggleExpand}
                        title={expanded ? "Contract View (Cmd+.)" : "Expand View (Cmd+.)"}
                    >
                        {expanded ? '↙' : '↗'}
                    </button>
                    <div className="shortcuts-hint">
                        <span className="kbd">j</span>/<span className="kbd">k</span> navigate
                        <span className="kbd">a</span> approve
                        <span className="kbd">d</span> deny
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="main">
                {view === 'landing' ? (
                    <LandingPage onGetStarted={() => setView('queue')} />
                ) : view === 'gallery' ? (
                    <div style={{ height: 'calc(100vh - 57px)' }}>
                        <PrimitivesGallery initialSection={initialGallerySection} />
                    </div>
                ) : view === 'proof' ? (
                    renderProofSurface()
                ) : view === 'studio' ? (
                    <div className="app-canvas studio-view" style={{ height: 'calc(100vh - 57px)', padding: '32px' }}>
                        {canvasPings.length === 0 ? (
                            <PolymorphPlayground embedded />
                        ) : (
                            <div className="app-grid app-grid-full">
                                {canvasPings.map(ping => (
                                    <div key={ping.id} className="app-card mb-8">
                                         <div className="app-card-header">
                                            <h3>{ping.agentName}</h3>
                                            <p>{new Date(ping.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                        <div className="app-card-body">
                                            <CanvasRenderer 
                                                payload={ping.payload} 
                                                onRespond={(data) => respondToCanvasPing(ping.id, data)} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : view === 'history' ? (
                    <HistoryView
                        onSelectPing={(ping) => {
                            // Can implement detailed view or re-queue logic later
                            console.log('Selected history ping:', ping);
                        }}
                    />
                ) : loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : pings.length === 0 ? (
                    <div className="empty">
                        <div className="empty-icon">📭</div>
                        <h2>No pending pings</h2>
                        <p>Waiting for agents to request human input...</p>
                    </div>
                ) : (
                    <div className="app-layout" style={{ height: 'calc(100vh - 57px)' }}>
                        {/* Ping Queue (Sidebar) */}
                        <aside className={`app-sidebar ${sidebarManuallyCollapsed ? 'collapsed' : ''}`}>
                            <div className="app-sidebar-header">
                                <h2>Pending Items</h2>
                                <span className="badge">{pings.length}</span>
                                <button className="icon-btn" onClick={toggleSidebar} title="Collapse Sidebar">◀</button>
                            </div>
                            <div className="app-sidebar-nav">
                                {pings.map((ping, index) => (
                                    <PingCard
                                        key={ping.id}
                                        ping={ping}
                                        isSelected={index === selectedIndex}
                                        onClick={() => setSelectedIndex(index)}
                                    />
                                ))}
                            </div>
                        </aside>

                        {/* Selected Ping Detail (Content) */}
                        <main className="app-content">
                            <div className="app-canvas">
                                <section className="ping-detail">
                                    {selectedPing && (
                                        <>
                                            <div className="ping-header">
                                                <div className="ping-title">
                                                    <span className="ping-agent">{selectedPing.agentName}</span>
                                                    <h2>{(selectedPing.payload as any).title || 'Ping'}</h2>
                                                </div>
                                                <div className="ping-meta">
                                                    <span className="ping-type">{selectedPing.type}</span>
                                                    <span className="ping-time">
                                                        {new Date(selectedPing.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="ping-content">
                                                {renderInteraction()}
                                            </div>

                                            <EnrichmentPanel
                                                directives={responseState.directives}
                                                notes={responseState.notes}
                                                onAddDirective={responseState.addDirective}
                                                onRemoveDirective={responseState.removeDirective}
                                                onNotesChange={responseState.setNotes}
                                                attachments={responseState.attachments}
                                                onAddAttachment={responseState.addAttachment}
                                                onRemoveAttachment={responseState.removeAttachment}
                                                suggestedDirectives={
                                                    selectedPing.parsedInteraction?.uiHints?.suggestedDirectives as string[] || []
                                                }
                                                actions={getQuickActions()}
                                            />
                                        </>
                                    )}
                                </section>
                            </div>
                        </main>
                    </div>
                )}
            </div>
        </div>
    );
}
