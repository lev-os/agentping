import './TerminalView.css';

interface TerminalViewProps {
    lines: string[];
    prompt?: string;
    isTyping?: boolean;
}

export function TerminalView({ lines, prompt = '>', isTyping = false }: TerminalViewProps) {
    return (
        <div className="terminal-view">
            <div className="terminal-header">
                <div className="terminal-dot dot-red" />
                <div className="terminal-dot dot-yellow" />
                <div className="terminal-dot dot-green" />
            </div>
            <div className="terminal-body">
                {lines.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
                <div className="terminal-active-line">
                    <span className="terminal-prompt">{prompt}</span>
                    {isTyping && <span className="terminal-cursor">█</span>}
                </div>
            </div>
        </div>
    );
}
