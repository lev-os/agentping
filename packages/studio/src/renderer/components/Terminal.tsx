/**
 * Terminal Component
 *
 * Full-featured terminal emulator with xterm.js.
 * Supports URL detection, search, multiple tabs, and accessibility.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { SearchAddon } from 'xterm-addon-search';
import {
    Terminal as TerminalIcon, Plus, X, Search, Copy, Trash2,
    ZoomIn, ZoomOut, ChevronUp, ChevronDown, ExternalLink, Eye,
    RefreshCw, Folder, Check, AlertCircle
} from 'lucide-react';
import { TerminalLinkPopup } from './TerminalLinkPopup';
import { IconButton, Kbd } from './ui';
import 'xterm/css/xterm.css';
import './Terminal.css';

interface TerminalProps {
    isVisible: boolean;
    workingDir?: string;
    onOpenPreviewUrl?: (url: string) => void;
}

interface LinkPopupState {
    url: string;
    position: { x: number; y: number };
}

interface TerminalTab {
    id: string;
    name: string;
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
}

const DEFAULT_FONT_SIZE = 13;
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 20;

const TERMINAL_THEME = {
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
};

export function Terminal({ isVisible, workingDir, onOpenPreviewUrl }: TerminalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const searchAddonRef = useRef<SearchAddon | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const isInitializedRef = useRef(false);
    const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shellSpawnedRef = useRef(false);

    // State
    const [linkPopup, setLinkPopup] = useState<LinkPopupState | null>(null);
    const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [copied, setCopied] = useState(false);
    const [tabs, setTabs] = useState<TerminalTab[]>([{ id: '1', name: 'Terminal', status: 'disconnected' }]);
    const [activeTabId, setActiveTabId] = useState('1');

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus terminal
    const focusTerminal = useCallback(() => {
        if (xtermRef.current) {
            xtermRef.current.focus();
        }
    }, []);

    // Fit terminal
    const fitTerminal = useCallback(() => {
        if (fitAddonRef.current && xtermRef.current && isInitializedRef.current) {
            try {
                fitAddonRef.current.fit();
            } catch {
                // Ignore fit errors during resize
            }
        }
    }, []);

    // Change font size
    const changeFontSize = useCallback((delta: number) => {
        setFontSize(prev => {
            const newSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, prev + delta));
            if (xtermRef.current) {
                xtermRef.current.options.fontSize = newSize;
                setTimeout(fitTerminal, 50);
            }
            return newSize;
        });
    }, [fitTerminal]);

    // Clear terminal
    const clearTerminal = useCallback(() => {
        if (xtermRef.current) {
            xtermRef.current.clear();
            xtermRef.current.write('\x1bc'); // Reset terminal
        }
    }, []);

    // Copy all terminal content
    const copyAllContent = useCallback(async () => {
        if (!xtermRef.current) return;

        const buffer = xtermRef.current.buffer.active;
        let content = '';

        for (let i = 0; i < buffer.length; i++) {
            const line = buffer.getLine(i);
            if (line) {
                content += line.translateToString(true) + '\n';
            }
        }

        try {
            await navigator.clipboard.writeText(content.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);

    // Search functions
    const searchNext = useCallback(() => {
        if (searchAddonRef.current && searchQuery) {
            searchAddonRef.current.findNext(searchQuery);
        }
    }, [searchQuery]);

    const searchPrev = useCallback(() => {
        if (searchAddonRef.current && searchQuery) {
            searchAddonRef.current.findPrevious(searchQuery);
        }
    }, [searchQuery]);

    // Handle URL actions
    const handleOpenExternal = useCallback((url: string) => {
        if (window.studioControl) {
            window.studioControl.openExternal(url);
        } else {
            window.open(url, '_blank');
        }
        setLinkPopup(null);
    }, []);

    const handleOpenPreview = useCallback((url: string) => {
        if (onOpenPreviewUrl) {
            onOpenPreviewUrl(url);
        } else if (window.studioControl) {
            window.studioControl.setPreviewUrl(url);
            window.studioControl.setLayoutMode('preview');
        }
        setLinkPopup(null);
    }, [onOpenPreviewUrl]);

    // Retry connection
    const retryConnection = useCallback(() => {
        if (!window.terminal || !workingDir) return;

        setConnectionStatus('connecting');
        shellSpawnedRef.current = false;

        window.terminal.spawn(workingDir).then(result => {
            if (!result.success) {
                setConnectionStatus('error');
                if (xtermRef.current) {
                    xtermRef.current.write(`\r\n\x1b[31;1mFailed to start shell: ${result.error}\x1b[0m\r\n`);
                }
            } else {
                setConnectionStatus('connected');
                shellSpawnedRef.current = true;
            }
        });
    }, [workingDir]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!isVisible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const isMod = e.metaKey || e.ctrlKey;

            // Toggle search
            if (isMod && e.key === 'f') {
                e.preventDefault();
                setIsSearchOpen(prev => !prev);
                setTimeout(() => searchInputRef.current?.focus(), 50);
            }

            // Clear terminal
            if (isMod && e.key === 'k') {
                e.preventDefault();
                clearTerminal();
            }

            // Zoom in/out
            if (isMod && e.key === '=') {
                e.preventDefault();
                changeFontSize(1);
            }
            if (isMod && e.key === '-') {
                e.preventDefault();
                changeFontSize(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, clearTerminal, changeFontSize]);

    // IPC listeners
    useEffect(() => {
        if (!window.terminal) return;

        const unsubData = window.terminal.onData((data) => {
            if (xtermRef.current) {
                xtermRef.current.write(data);
            }
        });

        const unsubExit = window.terminal.onExit((code) => {
            setConnectionStatus('disconnected');
            if (xtermRef.current) {
                xtermRef.current.write(`\r\n\x1b[31;1m[Process exited with code ${code}]\x1b[0m\r\n`);
            }
            shellSpawnedRef.current = false;
        });

        return () => {
            unsubData();
            unsubExit();
        };
    }, []);

    // Spawn shell when visible (use workingDir if provided, otherwise use default)
    useEffect(() => {
        if (!window.terminal || !isVisible || shellSpawnedRef.current) return;

        setConnectionStatus('connecting');
        shellSpawnedRef.current = true;

        // Use provided workingDir, or spawn without one (will use home dir)
        window.terminal.spawn(workingDir).then(result => {
            if (!result.success) {
                setConnectionStatus('error');
                shellSpawnedRef.current = false;
                if (xtermRef.current) {
                    xtermRef.current.write(`\r\n\x1b[31;1mFailed to start shell: ${result.error}\x1b[0m\r\n`);
                }
            } else {
                setConnectionStatus('connected');
            }
        });
    }, [isVisible, workingDir]);

    // Initialize xterm
    useEffect(() => {
        if (!isVisible || !terminalRef.current || isInitializedRef.current) {
            return;
        }

        initTimeoutRef.current = setTimeout(() => {
            if (!terminalRef.current || isInitializedRef.current) return;

            const rect = terminalRef.current.getBoundingClientRect();
            if (rect.width < 10 || rect.height < 10) {
                return;
            }

            const term = new XTerm({
                cursorBlink: true,
                cursorStyle: 'bar',
                fontSize,
                fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, monospace',
                theme: TERMINAL_THEME,
                allowProposedApi: true,
                scrollback: 10000,
                convertEol: true,
                disableStdin: false,
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);

            const searchAddon = new SearchAddon();
            term.loadAddon(searchAddon);

            const webLinksAddon = new WebLinksAddon((event, url) => {
                event.preventDefault();
                const mouseEvent = event as MouseEvent;
                setLinkPopup({
                    url,
                    position: {
                        x: mouseEvent.clientX,
                        y: mouseEvent.clientY + 10,
                    },
                });
            });
            term.loadAddon(webLinksAddon);

            try {
                term.open(terminalRef.current);
                isInitializedRef.current = true;
            } catch (e) {
                term.dispose();
                return;
            }

            xtermRef.current = term;
            fitAddonRef.current = fitAddon;
            searchAddonRef.current = searchAddon;

            setTimeout(() => {
                try {
                    fitAddon.fit();
                    term.focus();
                } catch {
                    // Ignore
                }
            }, 150);

            if (containerRef.current) {
                resizeObserverRef.current = new ResizeObserver(() => {
                    setTimeout(() => fitTerminal(), 50);
                });
                resizeObserverRef.current.observe(containerRef.current);
            }

            term.onData((data) => {
                window.terminal.sendInput(data);
            });

        }, 100);

        return () => {
            if (initTimeoutRef.current) {
                clearTimeout(initTimeoutRef.current);
            }
        };
    }, [isVisible, fontSize, fitTerminal]);

    // Cleanup
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

    // Handle visibility changes
    useEffect(() => {
        if (isVisible && isInitializedRef.current) {
            setTimeout(() => {
                fitTerminal();
                focusTerminal();
            }, 100);
        }
    }, [isVisible, fitTerminal, focusTerminal]);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'var(--status-success)';
            case 'connecting': return 'var(--status-warning)';
            case 'error': return 'var(--status-error)';
            default: return 'var(--text-muted)';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Connected';
            case 'connecting': return 'Connecting...';
            case 'error': return 'Error';
            default: return 'Disconnected';
        }
    };

    return (
        <div className="terminal-panel" ref={containerRef}>
            {/* Terminal Header */}
            <header className="terminal-header">
                <div className="terminal-header-left">
                    <TerminalIcon size={14} />
                    <span className="terminal-title">Terminal</span>

                    {/* Connection Status */}
                    <div className="terminal-status" title={getStatusText()}>
                        <span
                            className="status-dot"
                            style={{ background: getStatusColor() }}
                        />
                        <span className="status-text">{getStatusText()}</span>
                    </div>

                    {/* Working Directory */}
                    {workingDir && (
                        <div className="terminal-cwd" title={workingDir}>
                            <Folder size={12} />
                            <span>{workingDir.split('/').pop()}</span>
                        </div>
                    )}
                </div>

                <div className="terminal-header-right">
                    {/* Font Size Controls */}
                    <div className="terminal-zoom">
                        <IconButton
                            icon={<ZoomOut size={14} />}
                            label="Decrease font size"
                            onClick={() => changeFontSize(-1)}
                            disabled={fontSize <= MIN_FONT_SIZE}
                        />
                        <span className="zoom-level">{fontSize}px</span>
                        <IconButton
                            icon={<ZoomIn size={14} />}
                            label="Increase font size"
                            onClick={() => changeFontSize(1)}
                            disabled={fontSize >= MAX_FONT_SIZE}
                        />
                    </div>

                    {/* Actions */}
                    <IconButton
                        icon={<Search size={14} />}
                        label="Search"
                        shortcut="Mod+F"
                        onClick={() => {
                            setIsSearchOpen(!isSearchOpen);
                            setTimeout(() => searchInputRef.current?.focus(), 50);
                        }}
                        className={isSearchOpen ? 'active' : ''}
                    />

                    <IconButton
                        icon={copied ? <Check size={14} /> : <Copy size={14} />}
                        label={copied ? 'Copied!' : 'Copy all'}
                        onClick={copyAllContent}
                    />

                    <IconButton
                        icon={<Trash2 size={14} />}
                        label="Clear"
                        shortcut="Mod+K"
                        onClick={clearTerminal}
                    />

                    {connectionStatus !== 'connected' && (
                        <IconButton
                            icon={<RefreshCw size={14} />}
                            label="Reconnect"
                            onClick={retryConnection}
                            className={connectionStatus === 'connecting' ? 'spinning' : ''}
                        />
                    )}
                </div>
            </header>

            {/* Search Bar */}
            {isSearchOpen && (
                <div className="terminal-search">
                    <Search size={14} className="search-icon" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search in terminal..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (e.shiftKey) {
                                    searchPrev();
                                } else {
                                    searchNext();
                                }
                            }
                            if (e.key === 'Escape') {
                                setIsSearchOpen(false);
                                focusTerminal();
                            }
                        }}
                    />
                    <div className="search-nav">
                        <button onClick={searchPrev} title="Previous (Shift+Enter)">
                            <ChevronUp size={14} />
                        </button>
                        <button onClick={searchNext} title="Next (Enter)">
                            <ChevronDown size={14} />
                        </button>
                    </div>
                    <button
                        className="search-close"
                        onClick={() => {
                            setIsSearchOpen(false);
                            focusTerminal();
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Terminal Container */}
            <div
                ref={terminalRef}
                className="terminal-container"
                tabIndex={0}
                onClick={focusTerminal}
            />

            {/* Keyboard Shortcuts Help */}
            <div className="terminal-shortcuts">
                <Kbd keys="Mod+K" /> Clear
                <Kbd keys="Mod+F" /> Search
                <Kbd keys="Mod+C" /> Copy
            </div>

            {/* URL Link Popup */}
            {linkPopup && (
                <TerminalLinkPopup
                    url={linkPopup.url}
                    position={linkPopup.position}
                    onOpenExternal={() => handleOpenExternal(linkPopup.url)}
                    onOpenPreview={() => handleOpenPreview(linkPopup.url)}
                    onClose={() => setLinkPopup(null)}
                />
            )}
        </div>
    );
}
