/**
 * Footer Panel Component
 * 
 * Bottom panel with tabs for Terminal (Claude CLI output) and Tasks.
 */

import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ListChecks, ChevronUp, ChevronDown, Shield } from 'lucide-react';
import { TaskChecklist } from './TaskChecklist';
import { DiagnosticPanel } from './DiagnosticPanel';
import { Terminal } from './Terminal';
import './FooterPanel.css';

interface TerminalLine {
    id: string;
    content: string;
    type: 'stdout' | 'stderr' | 'system';
    timestamp: Date;
}

interface FooterPanelProps {
    isExpanded: boolean;
    onToggleExpand: (expanded: boolean) => void;
    activeSessionId: string | null;
    workspacePath?: string | null;
}

export function FooterPanel({ isExpanded, onToggleExpand, activeSessionId, workspacePath }: FooterPanelProps) {
    const [activeTab, setActiveTab] = useState<'shell' | 'logs' | 'tasks' | 'diagnostics'>('shell');
    const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    // Listen for Claude CLI output
    useEffect(() => {
        if (!window.claudeCode) return;

        const unsubOutput = window.claudeCode.onOutput(({ sessionId, data, stream }) => {
            // Add each line to terminal
            const lines = data.split('\n').filter(line => line.trim());
            const newLines: TerminalLine[] = lines.map((line, i) => ({
                id: `${Date.now()}-${i}`,
                content: line,
                type: stream,
                timestamp: new Date(),
            }));

            if (newLines.length > 0) {
                setTerminalLines(prev => [...prev.slice(-500), ...newLines]); // Keep last 500 lines
            }
        });

        const unsubExit = window.claudeCode.onExit(({ sessionId, code }) => {
            setTerminalLines(prev => [...prev, {
                id: `exit-${Date.now()}`,
                content: `[Process exited with code ${code}]`,
                type: 'system',
                timestamp: new Date(),
            }]);
        });

        return () => {
            unsubOutput();
            unsubExit();
        };
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (activeTab === 'logs') {
            terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [terminalLines, activeTab]);

    return (
        <div className={`footer-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="footer-header">
                <div className="footer-tabs">
                    <button
                        className={`footer-tab ${activeTab === 'shell' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shell')}
                    >
                        <TerminalIcon size={14} />
                        <span>Shell</span>
                    </button>
                    <button
                        className={`footer-tab ${activeTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <ListChecks size={14} />
                        <span>Logs</span>
                        {terminalLines.length > 0 && (
                            <span className="tab-badge">{terminalLines.length}</span>
                        )}
                    </button>
                    <button
                        className={`footer-tab ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        <ListChecks size={14} />
                        <span>Tasks</span>
                    </button>
                    <button
                        className={`footer-tab ${activeTab === 'diagnostics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('diagnostics')}
                    >
                        <Shield size={14} />
                        <span>Diagnostics</span>
                    </button>
                </div>

                <button
                    className="expand-toggle"
                    onClick={() => onToggleExpand(!isExpanded)}
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
            </div>

            {isExpanded && (
                <div className="footer-content">
                    {activeTab === 'shell' ? (
                        <Terminal isVisible={isExpanded && activeTab === 'shell'} workingDir={workspacePath || undefined} />
                    ) : activeTab === 'logs' ? (
                        <div className="terminal-logs">
                            {terminalLines.length === 0 ? (
                                <div style={{
                                    padding: '20px',
                                    color: 'var(--text-muted)',
                                    fontSize: '14px',
                                    textAlign: 'center'
                                }}>
                                    No logs yet. Claude&apos;s Bash command outputs will appear here.
                                </div>
                            ) : (
                                terminalLines.map(line => (
                                    <div key={line.id} className={`terminal-line terminal-line-${line.type}`}>
                                        <span className="line-time">{line.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        <span className="line-content">{line.content}</span>
                                    </div>
                                ))
                            )}
                            <div ref={terminalEndRef} />
                        </div>
                    ) : activeTab === 'tasks' ? (
                        <TaskChecklist />
                    ) : (
                        <DiagnosticPanel sessionId={activeSessionId} />
                    )}
                </div>
            )}
        </div>


    );
}
