/**
 * Session Tabs Component
 *
 * Horizontal tabs for managing multiple chat sessions.
 */

import { Plus, X } from 'lucide-react';

export interface Agent {
    id: string;
    status: 'starting' | 'running' | 'stopped';
}

export interface SessionTabsProps {
    agents: Agent[];
    activeSession: string | null;
    sessionNames: Record<string, string>;
    onSelectSession: (sessionId: string) => void;
    onCloseSession: (sessionId: string) => void;
    onNewSession: () => void;
    isLoading?: boolean;
    isBridgeReady?: boolean;
}

export function SessionTabs({
    agents,
    activeSession,
    sessionNames,
    onSelectSession,
    onCloseSession,
    onNewSession,
    isLoading = false,
    isBridgeReady = false
}: SessionTabsProps) {
    const handleCloseClick = (e: React.MouseEvent, agentId: string) => {
        e.stopPropagation();
        onCloseSession(agentId);
    };

    return (
        <div className="session-tabs" role="tablist" aria-label="Chat sessions">
            <div className="tabs-scroll">
                {agents.map(agent => {
                    const isActive = activeSession === agent.id;
                    const displayName = sessionNames[agent.id] || agent.id.slice(0, 4);

                    return (
                        <div
                            key={agent.id}
                            className={`session-tab ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectSession(agent.id)}
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Session: ${displayName}`}
                            tabIndex={isActive ? 0 : -1}
                        >
                            <div
                                className={`status-dot status-${agent.status}`}
                                aria-label={`Status: ${agent.status}`}
                            />
                            <span title={sessionNames[agent.id] || agent.id}>
                                {displayName}
                            </span>
                            <button
                                className="tab-close-btn"
                                onClick={(e) => handleCloseClick(e, agent.id)}
                                title="Close session"
                                aria-label={`Close session ${displayName}`}
                            >
                                <X size={10} />
                            </button>
                        </div>
                    );
                })}

                <button
                    className="tab-add-btn"
                    onClick={onNewSession}
                    disabled={isLoading || !isBridgeReady}
                    title="New chat"
                    aria-label="Start new chat session"
                >
                    <Plus size={12} />
                </button>
            </div>
        </div>
    );
}
