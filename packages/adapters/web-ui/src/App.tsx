/**
 * AgentPing Web UI - Main App Component
 */

import { useState, useCallback } from 'react';
import type { Ping, Directive } from '@agentping/core';
import { usePings, useWebSocket, useKeyboard, usePingResponse } from './hooks';
import { respondToPing, dismissPing, buildStepApprovalResponse, buildSelectionResponse, buildApprovalResponse, buildAnswerResponse, buildTaskWorkflowResponse } from './api';
import {
    PingCard,
    StepChecklist,
    SelectionList,
    ApprovalButtons,
    QuestionInput,
    DirectionPicker,
    NotificationBanner,
    EnrichmentPanel,
    QuickActionBar,
    TaskWorkflow,
    PrimitivesGallery,
    HistoryView,
    LandingPage
} from './components';
import { componentRegistry } from './renderers';
import './components/Layout.css';
import './App.css';

export default function App() {
    const { pings, loading, error, refresh } = usePings();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [view, setView] = useState<'queue' | 'history' | 'gallery' | 'landing'>('landing');

    const selectedPing = pings[selectedIndex] || null;
    const responseState = usePingResponse(selectedPing);

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
        <div className="app app-layout">
            {/* Header */}
            <header className="header">
                <div className="header-left">
                    <h1 className="logo" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>⚡ AgentPing</h1>
                    <nav className="nav">
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
                    </nav>
                </div>
                <div className="header-right">
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
                        <PrimitivesGallery />
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
                        <aside className="app-sidebar">
                            <div className="app-sidebar-header">
                                <h2>Pending Items</h2>
                                <span className="badge">{pings.length}</span>
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
