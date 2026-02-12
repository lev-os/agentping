import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './components/ui/ui.css';
import { initializeTheme } from './styles/themeConfig';

type FatalBootErrorProps = {
    title: string;
    error: Error;
    details?: string;
    showResetTheme?: boolean;
};

function FatalBootError({ title, error, details, showResetTheme = false }: FatalBootErrorProps) {
    const handleResetTheme = () => {
        try {
            localStorage.removeItem('agentping-theme');
            localStorage.removeItem('agentping-theme-mode');
        } catch {
            // Ignore localStorage write issues.
        }
        window.location.reload();
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                background: '#05070d',
                color: '#d7e9ff',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                padding: 24,
            }}
        >
            <div
                style={{
                    width: 'min(920px, 96vw)',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                    borderRadius: 12,
                    background: 'rgba(9, 16, 24, 0.95)',
                    boxShadow: '0 0 24px rgba(0, 229, 255, 0.18)',
                    padding: 20,
                }}
            >
                <h1 style={{ margin: '0 0 12px', fontSize: 18, color: '#00e5ff' }}>{title}</h1>
                <p style={{ margin: '0 0 10px', color: '#ff9aa2' }}>{error.message}</p>
                {details ? (
                    <pre
                        style={{
                            margin: 0,
                            padding: 12,
                            borderRadius: 8,
                            background: 'rgba(0, 0, 0, 0.42)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            color: '#9fd3ff',
                        }}
                    >
                        {details}
                    </pre>
                ) : null}
                {showResetTheme ? (
                    <button
                        type="button"
                        onClick={handleResetTheme}
                        style={{
                            marginTop: 14,
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid rgba(0, 229, 255, 0.45)',
                            background: 'rgba(0, 229, 255, 0.12)',
                            color: '#d7f6ff',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Reset theme config and reload
                    </button>
                ) : null}
            </div>
        </div>
    );
}

class StudioErrorBoundary extends React.Component<
    React.PropsWithChildren,
    { error: Error | null }
> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error) {
        console.error('[Studio] Renderer crashed:', error);
    }

    render() {
        if (this.state.error) {
            return (
                <FatalBootError
                    title="AgentPing Studio runtime error"
                    error={this.state.error}
                />
            );
        }
        return this.props.children;
    }
}

let bootError: Error | null = null;
let bootDetails = '';

// Initialize theme system before rendering.
// Fail-fast remains enabled; this just makes failure explicit in the UI.
try {
    initializeTheme();
} catch (error) {
    bootError = error instanceof Error ? error : new Error(String(error));
    let storedTheme = 'unreadable';
    let storedMode = 'unreadable';
    try {
        storedTheme = localStorage.getItem('agentping-theme') ?? 'null';
        storedMode = localStorage.getItem('agentping-theme-mode') ?? 'null';
    } catch {
        // Ignore localStorage access issues in diagnostic capture.
    }
    bootDetails = `localStorage.agentping-theme=${storedTheme}\nlocalStorage.agentping-theme-mode=${storedMode}\n\nExpected theme: agentping | skynet | syslog\nExpected mode: dark | light`;
    console.error('[Studio] Theme initialization failed:', bootError);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {bootError ? (
            <FatalBootError
                title="AgentPing Studio failed to start"
                error={bootError}
                details={bootDetails}
                showResetTheme
            />
        ) : (
            <StudioErrorBoundary>
                <App />
            </StudioErrorBoundary>
        )}
    </React.StrictMode>
);
