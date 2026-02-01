/**
 * AgentPing Studio - Electron Main Process
 * 
 * This is the entry point for the Electron application.
 * It manages window creation, IPC communication, and the Claude Code CLI bridge.
 */

import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';


// In CommonJS, __dirname is already available.

import { ClaudeCodeBridge } from './bridge/ClaudeCodeBridge.js';
import { TerminalBridge } from './bridge/TerminalBridge.js';
import { SettingsBridge, StudioSettings } from './bridge/SettingsBridge.js';

// Disable hardware acceleration if issues arise on some systems
// app.disableHardwareAcceleration();

let mainWindow: BrowserWindow | null = null;
let claudeBridge: ClaudeCodeBridge | null = null;
let terminalBridge: TerminalBridge | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1000,
        minWidth: 1200,
        minHeight: 800,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 16, y: 16 },
        backgroundColor: '#0a0a0f',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true, // Enable webview for Preview inspector
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // Load the app
    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();

    if (isDev) {
        mainWindow.loadURL('http://localhost:5180');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ... imports
import { FileService } from './FileService.js';

// ... existing code

import { AgentCoordinator } from './coordinator/AgentCoordinator.js';
import { StudioServer } from './server/StudioServer.js';
import { DashboardManager } from './dashboard-manager.js';

// ... existing code

let fileService: FileService | null = null;
let agentCoordinator: AgentCoordinator | null = null;
let studioServer: StudioServer | null = null;
let terminal: TerminalBridge | null = null;
let settingsBridge: SettingsBridge | null = null;
let dashboardManager: DashboardManager | null = null;

// ... setups

function setupIpcHandlers() {
    claudeBridge = new ClaudeCodeBridge();
    settingsBridge = new SettingsBridge();

    // Load settings on startup
    settingsBridge.load().then(() => {
        console.log('[Settings] Loaded settings:', settingsBridge?.getSettings());
    });

    if (mainWindow) {
        fileService = new FileService(mainWindow);
        agentCoordinator = new AgentCoordinator(claudeBridge, mainWindow);

        // Start Embedded Server
        studioServer = new StudioServer(mainWindow);
        studioServer.start().catch(err => console.error('Failed to start server:', err));

        terminal = new TerminalBridge(mainWindow);
    }

    // --- Terminal Handlers ---
    ipcMain.handle('terminal:spawn', async (_event, workingDir?: string) => {
        if (!terminal) return { success: false, error: 'Terminal bridge not initialized' };
        return terminal.spawn(workingDir);
    });

    ipcMain.on('terminal:input', (_event, data: string) => {
        terminal?.sendInput(data);
    });

    // --- Ping Response Handler ---
    ipcMain.handle('ping:respond', async (_event, pingId: string, response: any) => {
        if (!studioServer) return { error: 'Server not initialized' };
        try {
            await studioServer.respond(pingId, response);
            return { success: true };
        } catch (e) {
            return { success: false, error: (e as Error).message };
        }
    });

    // --- Claude Bridge Handlers ---
    ipcMain.handle('claude:spawn', async (_event, workingDir: string, initialPrompt?: string, chatId?: string) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.spawn(workingDir, initialPrompt, chatId);
    });

    ipcMain.handle('claude:execute', async (_event, sessionId: string, prompt: string) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.execute(sessionId, prompt);
    });

    // ... existing claude handlers ...

    ipcMain.handle('claude:send', async (_event, sessionId: string, message: string) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.send(sessionId, message);
    });

    ipcMain.handle('claude:terminate', async (_event, sessionId: string) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.terminate(sessionId);
    });

    ipcMain.handle('claude:terminateAll', async () => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        claudeBridge.terminateAll();
        return { success: true };
    });


    // Enhanced: resolveApproval now requires toolId for queue support
    ipcMain.handle('claude:resolveApproval', async (_event, sessionId: string, toolId: string, approved: boolean) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        claudeBridge.resolveApproval(sessionId, toolId, approved);
        return { success: true };
    });

    // NEW: Batch resolve all pending approvals
    ipcMain.handle('claude:resolveAllApprovals', async (_event, sessionId: string, approved: boolean) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        claudeBridge.resolveAllApprovals(sessionId, approved);
        return { success: true };
    });

    // NEW: Get current approval queue for a session
    ipcMain.handle('claude:getApprovalQueue', async (_event, sessionId: string) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.getApprovalQueue(sessionId);
    });

    ipcMain.handle('claude:runDiagnostics', async (_event, sessionId: string) => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.runDiagnostics(sessionId);
    });

    ipcMain.handle('claude:list', async () => {
        if (!claudeBridge) return { error: 'Bridge not initialized' };
        return claudeBridge.listSessions();
    });

    // --- Settings Handlers ---
    ipcMain.handle('settings:load', async () => {
        if (!settingsBridge) return { error: 'Settings bridge not initialized' };
        return settingsBridge.load();
    });

    ipcMain.handle('settings:save', async (_event, updates: Partial<StudioSettings>) => {
        if (!settingsBridge) return { error: 'Settings bridge not initialized' };
        await settingsBridge.save(updates);
        return { success: true };
    });

    ipcMain.handle('settings:get', async () => {
        if (!settingsBridge) return { error: 'Settings bridge not initialized' };
        return settingsBridge.getSettings();
    });

    claudeBridge.on('output', (sessionId: string, data: string, stream: 'stdout' | 'stderr') => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:output', { sessionId, data, stream });
        }
    });

    claudeBridge.on('chunk', (sessionId: string, chunk: any) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:chunk', { sessionId, chunk });
        }
    });

    claudeBridge.on('session_created', (sessionId: string, sdkSessionId: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:session_created', { sessionId, sdkSessionId });
        }
    });

    claudeBridge.on('done', (sessionId: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:done', { sessionId });
        }
    });

    claudeBridge.on('exit', (sessionId: string, code: number | null) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:exit', { sessionId, code });
        }
    });

    claudeBridge.on('request_approval', (sessionId: string, request: any) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:request_approval', { sessionId, request });
        }
    });

    // NEW: Approval queue events for batch approval UI
    claudeBridge.on('approval_queued', (sessionId: string, request: any) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:approval_queued', { sessionId, request });
        }
    });

    claudeBridge.on('approval_resolved', (sessionId: string, toolId: string, approved: boolean) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:approval_resolved', { sessionId, toolId, approved });
        }
    });

    claudeBridge.on('file_modified', (sessionId: string, path: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('claude:file_modified', { sessionId, path });
        }
    });

    // Route Claude's Bash commands to the interactive shell terminal for real-time output
    claudeBridge.on('run_in_terminal', async (_sessionId: string, command: string) => {
        if (terminal) {
            console.log(`[Main] Routing Claude command to terminal: ${command}`);

            // If PTY not running, spawn it first with session's working dir
            if (!terminal.isRunning()) {
                const session = claudeBridge?.getSession(_sessionId);
                const workingDir = session?.workingDir || process.cwd();
                console.log(`[Main] PTY not running, spawning in: ${workingDir}`);
                await terminal.spawn(workingDir);
                // Small delay to let shell initialize
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            terminal.sendInput(command + '\n');

            // Notify renderer to switch to Shell tab for visibility
            if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
                mainWindow.webContents.send('terminal:command_routed', { command });
            }
        }
    });


    // --- File Service Handlers ---
    ipcMain.handle('file:save', async (_event, content: string, filePath?: string) => {
        if (!fileService) return { error: 'File service not initialized' };
        return fileService.saveFile(content, filePath);
    });

    ipcMain.handle('file:open', async (_event) => {
        if (!fileService) return { error: 'File service not initialized' };
        return fileService.openFile();
    });

    ipcMain.handle('file:getWorkspace', async (_event) => {
        if (!fileService) return { error: 'File service not initialized' };
        return fileService.getWorkspace();
    });

    ipcMain.handle('file:readDir', async (_event, dirPath: string) => {
        if (!fileService) return { error: 'File service not initialized' };
        return fileService.readDir(dirPath);
    });

    // --- Agent Coordinator Handlers ---
    ipcMain.handle('coordinator:start', async (_event, workingDir: string, role: string) => {
        if (!agentCoordinator) return { error: 'Coordinator not initialized' };
        try {
            const id = await agentCoordinator.startAgent(workingDir, role);
            return { success: true, sessionId: id };
        } catch (e) {
            return { success: false, error: (e as Error).message };
        }
    });

    ipcMain.handle('coordinator:task', async (_event, description: string, targetFiles: string[]) => {
        if (!agentCoordinator) return { error: 'Coordinator not initialized' };
        const id = agentCoordinator.createTask(description, targetFiles);
        return { success: true, taskId: id };
    });

    // --- File Explorer Handlers ---
    ipcMain.handle('fs:readDir', async (_event, dirPath: string) => {
        try {
            const fs = await import('fs/promises');
            const pathModule = await import('path');
            const entries = await fs.readdir(dirPath, { withFileTypes: true });

            // Filter out hidden files/folders and node_modules
            const filtered = entries.filter(e => !e.name.startsWith('.') && e.name !== 'node_modules');

            return {
                success: true,
                items: filtered.map(e => ({
                    name: e.name,
                    path: pathModule.join(dirPath, e.name),
                    isDirectory: e.isDirectory(),
                })).sort((a, b) => {
                    // Directories first, then alphabetical
                    if (a.isDirectory && !b.isDirectory) return -1;
                    if (!a.isDirectory && b.isDirectory) return 1;
                    return a.name.localeCompare(b.name);
                })
            };
        } catch (err) {
            return { success: false, error: (err as Error).message };
        }
    });

    ipcMain.handle('fs:getWorkspace', async () => {
        // Return the current working directory or a default project path
        return { success: true, path: process.cwd() };
    });

    ipcMain.handle('fs:selectFolder', async () => {
        const result = await dialog.showOpenDialog(mainWindow!, {
            properties: ['openDirectory', 'createDirectory'],
            title: 'Select Project Folder',
            buttonLabel: 'Open',
        });

        if (result.canceled || result.filePaths.length === 0) {
            return { success: false, error: 'No folder selected' };
        }

        return { success: true, path: result.filePaths[0] };
    });

    // Read file contents
    ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
        try {
            const fs = await import('fs/promises');
            const pathModule = await import('path');
            const stat = await fs.stat(filePath);

            // Don't read files larger than 5MB
            if (stat.size > 5 * 1024 * 1024) {
                return { success: false, error: 'File too large (max 5MB)' };
            }

            const content = await fs.readFile(filePath, 'utf-8');
            const ext = pathModule.extname(filePath).slice(1).toLowerCase();

            return {
                success: true,
                content,
                fileName: pathModule.basename(filePath),
                extension: ext,
                size: stat.size,
                modifiedAt: stat.mtime.toISOString()
            };
        } catch (err) {
            return { success: false, error: (err as Error).message };
        }
    });

    // --- System Stats Handlers ---
    ipcMain.handle('stats:get', async () => {
        const os = await import('os');
        const cpuUsage = process.cpuUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();

        return {
            cpu: Math.round(cpuUsage.user / 1000000) % 100, // Better normalization
            memory: Math.round(((totalMem - freeMem) / totalMem) * 100),
            uptime: Math.floor(os.uptime()),
            platform: process.platform,
            arch: process.arch
        };
    });

    // --- Studio Control Handlers (Claude Code -> Renderer) ---
    // These forward control messages from the main process back to the renderer
    ipcMain.on('studio:setLayoutMode', (_event, mode: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('studio:setLayoutMode', mode);
        }
    });

    ipcMain.on('studio:openFile', (_event, filePath: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('studio:openFile', filePath);
        }
    });

    ipcMain.on('studio:runTerminalCommand', (_event, command: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('studio:runTerminalCommand', command);
        }
        // Also execute the command in the terminal
        terminal?.sendInput(command + '\n');
    });

    ipcMain.on('studio:refreshPreview', (_event) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('studio:refreshPreview');
        }
    });

    ipcMain.on('studio:setPreviewUrl', (_event, url: string) => {
        if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('studio:setPreviewUrl', url);
        }
    });

    // Open URL in system default browser
    ipcMain.handle('shell:openExternal', async (_event, url: string) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (err) {
            return { success: false, error: (err as Error).message };
        }
    });

    // --- Dashboard Manager Handlers ---
    ipcMain.handle('dashboard:restart', async (_event, dashboardId: string) => {
        if (!dashboardManager) return { error: 'Dashboard manager not initialized' };
        try {
            await dashboardManager.restart(dashboardId);
            return { success: true };
        } catch (err) {
            return { success: false, error: (err as Error).message };
        }
    });

    ipcMain.handle('dashboard:getStatus', async () => {
        if (!dashboardManager) return { error: 'Dashboard manager not initialized' };
        return dashboardManager.getAllStatus();
    });

    ipcMain.handle('studio:getCanvasState', async () => {
        // This will be handled by the renderer via a response pattern
        // For now, return null - the actual canvas state is managed client-side
        return null;
    });
}


app.whenReady().then(async () => {
    createWindow();
    setupIpcHandlers(); // Moved after createWindow to access mainWindow

    // Start dashboard manager
    console.log('[Main] Starting dashboard manager...');
    dashboardManager = new DashboardManager();
    try {
        await dashboardManager.start();
        console.log('[Main] Dashboard manager started successfully');
    } catch (err) {
        console.error('[Main] Failed to start dashboard manager:', err);
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            // Re-init service if window recreated
            if (mainWindow) {
                fileService = new FileService(mainWindow);
                agentCoordinator = new AgentCoordinator(claudeBridge!, mainWindow);
                if (studioServer) studioServer = new StudioServer(mainWindow);
                terminal = new TerminalBridge(mainWindow);
            }

        }
    });
});

app.on('window-all-closed', () => {
    // Terminate all Claude sessions on quit
    claudeBridge?.terminateAll();
    studioServer?.stop();
    terminal?.terminate();
    dashboardManager?.stop();

    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', async () => {
    claudeBridge?.terminateAll();
    studioServer?.stop();
    terminal?.terminate();

    // Stop dashboard manager gracefully
    if (dashboardManager) {
        console.log('[Main] Stopping dashboard manager...');
        await dashboardManager.stop();
        console.log('[Main] Dashboard manager stopped');
    }
});
