import React, { useEffect, useState, useRef } from 'react';
import './TerminalConsole.css';

export const TerminalConsole: React.FC = () => {
    const [lines, setLines] = useState<string[]>(['> SYSTEM_INIT...']);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const logs = [
            'Loading modules...',
            'Verifying cryptographic signatures...',
            '[OK] Kernel loaded',
            'Connecting to satellite uplink...',
            'Connection established (Latency: 12ms)',
            'Rotating security keys...',
            'Monitoring traffic...',
            'Detected anomaly in sector 7G',
            'Applying patch...',
            '[SUCCESS] System stable'
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < logs.length) {
                const log = logs[index];
                setLines(prev => [...prev.slice(-10), `> ${log}`]); // Keep last 10 lines
                index++;
            } else {
                index = 0; // Loop
                setLines(prev => [...prev.slice(-10), '> -- RESTART MONITOR --']);
            }
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="terminal-console">
            <div className="terminal-header">
                <div className="terminal-buttons">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                </div>
                <span>/bin/zsh - agent_monitor</span>
            </div>
            <div className="terminal-body" ref={scrollRef}>
                {lines.map((line, i) => (
                    <div key={i} className="terminal-line">{line}</div>
                ))}
                <div className="terminal-prompt">
                    <span className="prompt-char">$</span> <span className="cursor">_</span>
                </div>
            </div>
        </div>
    );
};
