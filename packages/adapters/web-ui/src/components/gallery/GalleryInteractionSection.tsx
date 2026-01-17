import React, { useState } from 'react';
import {
    ContextMenu,
    HoverCard,
    DraggableList,
    StepChecklist,
    DirectionPicker,
    SelectionList,
    ApprovalButtons,
    QuestionInput,
    NotificationBanner
} from '../index';

interface GalleryInteractionSectionProps {
    setSidebarOpen: (open: boolean) => void;
    setModalOpen: (open: boolean) => void;
    setCmdOpen: (open: boolean) => void;
}

export const GalleryInteractionSection: React.FC<GalleryInteractionSectionProps> = ({
    setSidebarOpen,
    setModalOpen,
    setCmdOpen
}) => {
    // Demo State
    const [questionValue, setQuestionValue] = useState('');
    const [selectedDirections, setSelectedDirections] = useState<Set<string>>(new Set());
    const [checklistItems, setChecklistItems] = useState([
        { id: '1', description: 'Review Security Logs', risk: 'low' as const, reversible: true, checked: true },
        { id: '2', description: 'Deploy to Production', risk: 'high' as const, reversible: false, checked: false, details: 'Requires admin approval' },
        { id: '3', description: 'Clear Cache', risk: 'medium' as const, reversible: true, checked: false },
    ]);

    const handleDirectionToggle = (id: string) => {
        const next = new Set(selectedDirections);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedDirections(next);
    };

    // Demo state for checklist
    const [checklistState, setChecklistState] = useState<Set<string>>(new Set(['1']));

    const handleChecklistToggle = (id: string) => {
        const next = new Set(checklistState);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setChecklistState(next);
    };

    return (
        <div className="app-grid">
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>ContextMenu</h3>
                    <p>Right-click interactions</p>
                </div>
                <div className="app-card-body">
                    <ContextMenu
                        items={[
                            { id: '1', label: 'View Details', shortcut: '⌘I' },
                            { id: '2', label: 'Edit', shortcut: '⌘E', action: () => alert('Edit clicked') },
                            { id: 'sep1', label: '', separator: true },
                            { id: '3', label: 'Delete', shortcut: '⌫', disabled: true },
                        ]}
                        className="context-menu-demo-area"
                    >
                        <div style={{
                            padding: '40px',
                            border: '1px dashed var(--border-color)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.02)',
                            cursor: 'context-menu'
                        }}>
                            Right-click here to see custom context menu
                        </div>
                    </ContextMenu>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>HoverCard</h3>
                    <p>Progressive disclosure</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', gap: 24, alignItems: 'center', height: '100px' }}>
                    <HoverCard
                        trigger={<span className="hover-card-trigger">@agent-007</span>}
                    >
                        <div className="hover-card-header">
                            <div className="hover-card-avatar" />
                            <div className="hover-card-info">
                                <h4>James Bond</h4>
                                <span>Elite Agent</span>
                            </div>
                        </div>
                        <div className="hover-card-body">
                            Active in <b>London</b>. Last seen 2 minutes ago.
                        </div>
                    </HoverCard>

                    <HoverCard
                        trigger={<span className="hover-card-trigger">Status: Online</span>}
                        delayMs={0}
                    >
                        <div className="hover-card-body">
                            System is fully operational.
                            <br />
                            <span style={{ color: 'var(--accent-success)' }}>● 99.9% Uptime</span>
                        </div>
                    </HoverCard>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>DraggableList</h3>
                    <p>Sortable items</p>
                </div>
                <div className="app-card-body">
                    <DraggableList
                        items={[
                            { id: '1', content: <span>High Priority Task</span> },
                            { id: '2', content: <span>Medium Priority Task</span> },
                            { id: '3', content: <span>Low Priority Task</span> },
                        ]}
                        onReorder={(items) => console.log('Reordered:', items)}
                    />
                </div>
            </div>

            {/* New Interaction Components */}
            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>StepChecklist</h3>
                    <p>Procedure verification</p>
                </div>
                <div className="app-card-body">
                    <StepChecklist
                        steps={checklistItems}
                        selectedSteps={checklistState}
                        onToggle={handleChecklistToggle}
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>DirectionPicker</h3>
                    <p>Strategic choice selection</p>
                </div>
                <div className="app-card-body">
                    <DirectionPicker
                        directions={[
                            { id: '1', direction: 'Optimize Cache', rationale: 'To improve latency by 50%', estimatedEffort: 'quick' },
                            { id: '2', direction: 'Refactor Auth', rationale: 'To support OAuth2 flows', estimatedEffort: 'medium' },
                            { id: '3', direction: 'Rewrite Engine', rationale: 'For long-term scalability', estimatedEffort: 'deep' },
                        ]}
                        selectedDirections={selectedDirections}
                        onToggle={handleDirectionToggle}
                    />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Approval Flow</h3>
                    <p>Decision gating</p>
                </div>
                <div className="app-card-body">
                    <ApprovalButtons
                        title="Deploy to Prod?"
                        details="v2.4.0 (SHA: 8a9f2b)"
                        risk="high"
                        onApprove={() => alert('Approved!')}
                        onDeny={() => alert('Denied!')}
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>QuestionInput</h3>
                    <p>Interactive dialog</p>
                </div>
                <div className="app-card-body">
                    <QuestionInput
                        question="What is the primary cause of the latency spike?"
                        context="Based on the logs above"
                        options={['Database Lock', 'Network Partition', 'CPU Saturation']}
                        value={questionValue}
                        onChange={setQuestionValue}
                        onSubmit={() => alert(`Submitted: ${questionValue}`)}
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>NotificationBanner</h3>
                    <p>System alerts</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <NotificationBanner
                        message="System update available (v2.5.0)"
                        level="info"
                        onDismiss={() => { }}
                    />
                    <NotificationBanner
                        message="Connection to primary shard lost"
                        level="error"
                        onDismiss={() => { }}
                    />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>Global Overlays</h3>
                    <p>Standard interaction patterns</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button className="nav-btn" onClick={() => setCmdOpen(true)}>
                        Open Command Palette (⌘K)
                    </button>

                    <button className="nav-btn" onClick={() => setSidebarOpen(true)}>
                        Open Sidebar
                    </button>

                    <button className="nav-btn" onClick={() => setModalOpen(true)}>
                        Open Modal
                    </button>
                </div>
            </div>
        </div>
    );
};
