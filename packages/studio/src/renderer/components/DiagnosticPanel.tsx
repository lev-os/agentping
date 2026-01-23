import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import './DiagnosticPanel.css';

interface TestResult {
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
}

interface DiagnosticPanelProps {
    sessionId: string | null;
}

export function DiagnosticPanel({ sessionId }: DiagnosticPanelProps) {
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runTests = async () => {
        if (!sessionId) return;
        setIsRunning(true);
        setResults([]);

        try {
            const report = await window.claudeCode.runDiagnostics(sessionId);
            setResults(report);
        } catch (error: any) {
            setResults([{
                name: 'System Error',
                status: 'error',
                message: error.message || 'Failed to run diagnostics bridge'
            }]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="diagnostic-panel animate-in">
            <div className="diagnostic-header">
                <div className="diagnostic-title">
                    <Shield size={16} />
                    <span>Connectivity Diagnostic Suite</span>
                </div>
                <button
                    className="run-test-btn"
                    onClick={runTests}
                    disabled={isRunning || !sessionId}
                >
                    {isRunning ? <RefreshCw size={14} className="spinning" /> : <Activity size={14} />}
                    <span>{isRunning ? 'Analyzing...' : 'Initiate Self-Test'}</span>
                </button>
            </div>

            <div className="diagnostic-content">
                {!sessionId && (
                    <div className="diagnostic-empty">
                        <AlertTriangle size={24} />
                        <p>No active session found. Start a "New Specialist" to enable diagnostics.</p>
                    </div>
                )}

                {sessionId && results.length === 0 && !isRunning && (
                    <div className="diagnostic-empty">
                        <Activity size={24} />
                        <p>Ready to verify Claude Code connectivity. Click "Initiate Self-Test" above.</p>
                    </div>
                )}

                {results.map((res, i) => (
                    <div key={i} className={`test-row ${res.status}`}>
                        <div className="test-status">
                            {res.status === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        </div>
                        <div className="test-info">
                            <div className="test-name">{res.name}</div>
                            <div className="test-message">{res.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
