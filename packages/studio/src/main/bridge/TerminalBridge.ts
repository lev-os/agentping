import * as pty from 'node-pty';
import { EventEmitter } from 'events';
import { BrowserWindow } from 'electron';

export class TerminalBridge extends EventEmitter {
    private ptyProcess: pty.IPty | null = null;
    private mainWindow: BrowserWindow | null = null;
    private currentWorkingDir: string | null = null;
    private dataDisposable: { dispose: () => void } | null = null;
    private exitDisposable: { dispose: () => void } | null = null;

    constructor(mainWindow: BrowserWindow) {
        super();
        this.mainWindow = mainWindow;
    }

    /**
     * Update the main window reference (call when window is recreated)
     */
    updateMainWindow(newWindow: BrowserWindow): void {
        console.log('[TerminalBridge] Updating mainWindow reference');
        this.mainWindow = newWindow;
        // Re-attach listeners if PTY is running
        if (this.ptyProcess) {
            this.attachListeners();
        }
    }

    /**
     * Attach data and exit listeners to current PTY process
     */
    private attachListeners(): void {
        if (!this.ptyProcess) return;

        // Dispose old listeners if any
        if (this.dataDisposable) {
            this.dataDisposable.dispose();
            this.dataDisposable = null;
        }
        if (this.exitDisposable) {
            this.exitDisposable.dispose();
            this.exitDisposable = null;
        }

        console.log('[TerminalBridge] Attaching PTY listeners');

        this.dataDisposable = this.ptyProcess.onData((data) => {
            try {
                if (this.mainWindow && !this.mainWindow.isDestroyed() && !this.mainWindow.webContents.isDestroyed()) {
                    this.mainWindow.webContents.send('terminal:data', data);
                }
            } catch (err) {
                console.warn('[TerminalBridge] Failed to send terminal data:', err);
            }
        });

        this.exitDisposable = this.ptyProcess.onExit(({ exitCode }) => {
            try {
                if (this.mainWindow && !this.mainWindow.isDestroyed() && !this.mainWindow.webContents.isDestroyed()) {
                    this.mainWindow.webContents.send('terminal:exit', exitCode);
                }
            } catch (err) {
                console.warn('[TerminalBridge] Failed to send exit code:', err);
            }
            this.ptyProcess = null;
            this.currentWorkingDir = null;
            this.dataDisposable = null;
            this.exitDisposable = null;
        });
    }

    /**
     * Spawn an interactive shell using node-pty
     */
    async spawn(workingDir: string = process.cwd()): Promise<{ success: boolean; error?: string }> {
        // If PTY already running in the same directory, re-attach listeners and return
        if (this.ptyProcess && this.currentWorkingDir === workingDir) {
            console.log('[TerminalBridge] PTY already running in same directory, re-attaching listeners');
            this.attachListeners();
            return { success: true };
        }

        // If running in different directory, terminate first
        if (this.ptyProcess) {
            console.log('[TerminalBridge] PTY running in different directory, terminating...');
            this.terminate();
        }

        // Validate working directory
        try {
            const fs = require('fs');
            if (!fs.existsSync(workingDir)) {
                console.warn(`[TerminalBridge] Working directory doesn't exist: ${workingDir}, using home`);
                workingDir = process.env.HOME || '/';
            }
        } catch (e) {
            workingDir = process.env.HOME || '/';
        }

        // Determine shell - prefer explicit paths for more reliability
        let shell = process.env.SHELL || '/bin/zsh';
        if (process.platform === 'win32') {
            shell = 'powershell.exe';
        } else {
            // Try common shells if SHELL env var is not set or invalid
            const fs = require('fs');
            const shells = ['/bin/zsh', '/bin/bash', '/bin/sh'];
            if (!fs.existsSync(shell)) {
                for (const s of shells) {
                    if (fs.existsSync(s)) {
                        shell = s;
                        break;
                    }
                }
            }
        }

        console.log(`[TerminalBridge] Spawning shell: ${shell} in ${workingDir}`);

        try {
            // Use login shell args to ensure proper environment loading
            const shellArgs = process.platform === 'win32' ? [] : ['--login', '-i'];

            // Create a clean environment with essential paths
            const shellEnv: { [key: string]: string } = {
                ...process.env as { [key: string]: string },
                TERM: 'xterm-256color',
                COLORTERM: 'truecolor',
                // Ensure PATH includes common locations
                PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
            };

            console.log(`[TerminalBridge] Spawning shell: ${shell} ${shellArgs.join(' ')} in ${workingDir}`);

            this.ptyProcess = pty.spawn(shell, shellArgs, {
                name: 'xterm-256color',
                cols: 80,
                rows: 24,
                cwd: workingDir,
                env: shellEnv,
            });

            // Attach data and exit listeners
            this.attachListeners();

            this.currentWorkingDir = workingDir;
            return { success: true };
        } catch (err) {
            console.error('[TerminalBridge] Failed to spawn PTY:', err);
            return { success: false, error: (err as Error).message };
        }
    }

    /**
     * Send input to the shell
     */
    sendInput(data: string): void {
        if (this.ptyProcess) {
            console.log(`[TerminalBridge] Writing to PTY: ${JSON.stringify(data.slice(0, 50))}`);
            this.ptyProcess.write(data);
        } else {
            console.warn('[TerminalBridge] Cannot send input - PTY not spawned');
        }
    }

    /**
     * Check if PTY is running
     */
    isRunning(): boolean {
        return this.ptyProcess !== null;
    }

    /**
     * Resize the terminal
     */
    resize(cols: number, rows: number): void {
        if (this.ptyProcess) {
            this.ptyProcess.resize(cols, rows);
        }
    }

    /**
     * Terminate the shell
     */
    terminate(): void {
        // Dispose listeners first
        if (this.dataDisposable) {
            this.dataDisposable.dispose();
            this.dataDisposable = null;
        }
        if (this.exitDisposable) {
            this.exitDisposable.dispose();
            this.exitDisposable = null;
        }

        if (this.ptyProcess) {
            this.ptyProcess.kill();
            this.ptyProcess = null;
            this.currentWorkingDir = null;
        }
    }
}
