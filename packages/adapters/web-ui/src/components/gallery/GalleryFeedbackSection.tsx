import React from 'react';
import {
    AlertBanner,
    Badge,
    CircularProgress,
    Skeleton,
    ToastManager,
    ProgressBar,
    Spinner,
    StatusIndicator,
    StepTracker,
    LiveBadge,
    ConnectionSignal,
    BatteryMeter,
    TypingIndicator,
    EmptyState,
    ErrorBoundary
} from '../index';

export const GalleryFeedbackSection = () => {
    return (
        <div className="app-grid">
            <div className="app-card">
                <div className="app-card-header">
                    <h3>AlertBanner</h3>
                    <p>Inline notifications</p>
                </div>
                <div className="app-card-body">
                    <AlertBanner title="Update Available" message="A new version of the agent model is available." type="info" />
                    <AlertBanner message="Connection lost to server." type="error" className="mt-2" />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Badge</h3>
                    <p>Status indicators</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Badge label="Success" type="success" />
                    <Badge label="Warning" type="warning" />
                    <Badge label="Error" type="error" />
                    <Badge label="Info" type="info" />
                    <Badge label="Outline" type="outline" />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>CircularProgress</h3>
                    <p>Ring indicators</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', gap: 16 }}>
                    <CircularProgress value={75} showLabel />
                    <CircularProgress value={30} color="var(--accent-warning)" />
                    <CircularProgress value={90} size={60} showLabel label="90%" />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Skeleton</h3>
                    <p>Loading states</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <Skeleton variant="circle" width={40} height={40} />
                        <div style={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="90%" />
                        </div>
                    </div>
                    <Skeleton variant="rect" height={100} />
                </div>
            </div>

            <div className="app-card col-span-2">
                <div className="app-card-header">
                    <h3>ToastManager</h3>
                    <p>Notification simulation</p>
                </div>
                <div className="app-card-body">
                    <div style={{ marginBottom: 16 }}>
                        This component is usually positioned fixed on screen.
                        <br />
                        <button className="btn-secondary" onClick={() => alert('Trigger toast via state management (demo only)')}>
                            Trigger Test Toast
                        </button>
                    </div>
                    {/* Demo static rendering */}
                    <div style={{ position: 'relative', height: 200, border: '1px dashed var(--border-color)', background: '#111' }}>
                        <ToastManager
                            className="!absolute !bottom-4 !right-4"
                            toasts={[
                                { id: '1', title: 'Action Success', message: 'Agent deployed successfully', type: 'success' },
                                { id: '2', message: 'Background sync in progress...', type: 'info' }
                            ]}
                            onDismiss={() => { }}
                        />
                    </div>
                </div>
            </div>

            {/* New Components Batch */}
            <div className="app-card">
                <div className="app-card-header">
                    <h3>ProgressBar</h3>
                    <p>Linear indicators</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <ProgressBar value={75} showLabel />
                    <ProgressBar value={40} color="var(--accent-warning)" striped />
                    <ProgressBar value={90} color="var(--accent-success)" height={4} showLabel />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Spinner & Loaders</h3>
                    <p>Techno wait states</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <Spinner variant="ring" />
                    <Spinner variant="dots" color="var(--accent-secondary)" />
                    <Spinner variant="pulse" size={32} />
                    <TypingIndicator />
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>Status & Signals</h3>
                    <p>System telemetry</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <StatusIndicator status="online" />
                        <StatusIndicator status="busy" />
                        <LiveBadge />
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <ConnectionSignal strength={4} />
                        <ConnectionSignal strength={2} />
                        <BatteryMeter level={85} charging />
                        <BatteryMeter level={15} />
                    </div>
                </div>
            </div>

            <div className="app-card">
                <div className="app-card-header">
                    <h3>StepTracker</h3>
                    <p>Progress piping</p>
                </div>
                <div className="app-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <StepTracker steps={5} currentStep={3} />
                    <StepTracker steps={4} currentStep={4} />
                </div>
            </div>

            <div className="app-card" style={{ gridColumn: 'span 2' }}>
                <div className="app-card-header">
                    <h3>Empty & Error States</h3>
                    <p>Placeholder handling</p>
                </div>
                <div className="app-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <EmptyState
                        title="No Data Found"
                        description="Try adjusting your filter parameters to see results."
                        action={<button className="btn-primary">Clear Filters</button>}
                    />
                    <ErrorBoundary
                        title="Connection Failure"
                        message="Unable to establish secure uplink to the neural core."
                        onRetry={() => alert('Retrying...')}
                    />
                </div>
            </div>
        </div>
    );
};
