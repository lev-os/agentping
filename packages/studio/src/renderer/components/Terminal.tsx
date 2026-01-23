import { useEffect, useRef, useCallback } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
    isVisible: boolean;
    workingDir?: string;
}

export function Terminal({ isVisible, workingDir }: TerminalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const isInitializedRef = useRef(false);
    const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shellSpawnedRef = useRef(false);

    // Focus function - memoized
    const focusTerminal = useCallback(() => {
        if (xtermRef.current) {
            xtermRef.current.focus();
        }
    }, []);

    // Fit function - memoized  
    const fitTerminal = useCallback(() => {
        if (fitAddonRef.current && xtermRef.current && isInitializedRef.current) {
            try {
                fitAddonRef.current.fit();
            } catch (e) {
                // Ignore fit errors during resize
            }
        }
    }, []);

    // CRITICAL: IPC listeners should be set up INDEPENDENTLY of xterm initialization
    // This ensures data flows even if xterm is still initializing or was re-created
    useEffect(() => {
        if (!window.terminal) return;

        console.log('[Terminal] Setting up IPC listeners');

        const unsubData = window.terminal.onData((data) => {
            if (xtermRef.current) {
                xtermRef.current.write(data);
            } else {
                // Queue or log if xterm not ready (rare edge case)
                console.warn('[Terminal] Received data but xterm not ready');
            }
        });

        const unsubExit = window.terminal.onExit((code) => {
            console.log('[Terminal] Shell exited with code:', code);
            if (xtermRef.current) {
                xtermRef.current.write(`\r\n\x1b[31;1m[Process exited with code ${code}]\x1b[0m\r\n`);
            }
            shellSpawnedRef.current = false;
        });

        return () => {
            console.log('[Terminal] Cleaning up IPC listeners');
            unsubData();
            unsubExit();
        };
    }, []); // Empty deps - run once on mount

    // Spawn shell when workingDir is set and shell hasn't been spawned
    useEffect(() => {
        if (!window.terminal || !workingDir || shellSpawnedRef.current) return;

        console.log('[Terminal] Spawning shell in:', workingDir);
        shellSpawnedRef.current = true;

        window.terminal.spawn(workingDir).then(result => {
            if (!result.success) {
                console.error('[Terminal] Failed to spawn shell:', result.error);
                shellSpawnedRef.current = false;
                if (xtermRef.current) {
                    xtermRef.current.write(`\r\n\x1b[31;1mFailed to start shell: ${result.error}\x1b[0m\r\n`);
                }
            } else {
                console.log('[Terminal] Shell spawned successfully');
            }
        });
    }, [workingDir]);

    // Initialize xterm when visible
    useEffect(() => {
        // Early exit if not visible or already initialized
        if (!isVisible || !terminalRef.current || isInitializedRef.current) {
            return;
        }

        // Wait a frame for the container to have proper dimensions
        initTimeoutRef.current = setTimeout(() => {
            if (!terminalRef.current || isInitializedRef.current) return;

            const rect = terminalRef.current.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) {
                console.warn('[Terminal] Container too small, waiting...');
                return;
            }

            console.log('[Terminal] Initializing xterm with dimensions:', rect.width, rect.height);

            // Create xterm instance
            const term = new XTerm({
                cursorBlink: true,
                cursorStyle: 'bar',
                fontSize: 13,
                fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, monospace',
                theme: {
                    background: '#0a0a0f',
                    foreground: '#e0e0e0',
                    cursor: '#00ffaa',
                    cursorAccent: '#0a0a0f',
                    selectionBackground: 'rgba(0, 255, 170, 0.3)',
                    selectionForeground: '#ffffff',
                    black: '#0a0a0f',
                    red: '#ff6b6b',
                    green: '#00ffaa',
                    yellow: '#f1fa8c',
                    blue: '#00d4ff',
                    magenta: '#bd93f9',
                    cyan: '#8be9fd',
                    white: '#f8f8f2',
                    brightBlack: '#6272a4',
                    brightRed: '#ff5555',
                    brightGreen: '#50fa7b',
                    brightYellow: '#f1fa8c',
                    brightBlue: '#bd93f9',
                    brightMagenta: '#ff79c6',
                    brightCyan: '#8be9fd',
                    brightWhite: '#ffffff',
                },
                allowProposedApi: true,
                scrollback: 5000,
                convertEol: true,
                disableStdin: false,
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);

            try {
                term.open(terminalRef.current);
                isInitializedRef.current = true;
            } catch (e) {
                console.error('[Terminal] Failed to open xterm:', e);
                term.dispose();
                return;
            }

            xtermRef.current = term;
            fitAddonRef.current = fitAddon;

            // Fit after a short delay
            setTimeout(() => {
                try {
                    fitAddon.fit();
                    term.focus();
                } catch (e) {
                    // Ignore
                }
            }, 150);

            // Set up ResizeObserver
            if (containerRef.current) {
                resizeObserverRef.current = new ResizeObserver(() => {
                    setTimeout(() => fitTerminal(), 50);
                });
                resizeObserverRef.current.observe(containerRef.current);
            }

            // Handle terminal input - send to PTY
            term.onData((data) => {
                window.terminal.sendInput(data);
            });

        }, 100);

        return () => {
            if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
            }
        };
    }, [isVisible, fitTerminal]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (xtermRef.current) {
                xtermRef.current.dispose();
                xtermRef.current = null;
            }
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            isInitializedRef.current = false;
            shellSpawnedRef.current = false;
        };
    }, []);

    // Handle visibility changes - fit when becoming visible
    useEffect(() => {
        if (isVisible && isInitializedRef.current) {
            setTimeout(() => {
                fitTerminal();
                focusTerminal();
            }, 100);
        }
    }, [isVisible, fitTerminal, focusTerminal]);

    // Click handler to focus terminal
    const handleContainerClick = useCallback(() => {
        focusTerminal();
    }, [focusTerminal]);

    return (
        <div
            ref={containerRef}
            className="terminal-wrapper"
            onClick={handleContainerClick}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#0a0a0f',
                cursor: 'text',
            }}
        >
            <div
                ref={terminalRef}
                className="terminal-container"
                tabIndex={0}
                style={{
                    flex: 1,
                    width: '100%',
                    padding: '8px',
                    outline: 'none',
                    overflow: 'hidden',
                    minHeight: '150px',
                }}
            />
        </div>
    );
}
