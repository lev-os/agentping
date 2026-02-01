/**
 * Electron Preload Script
 * 
 * Exposes a safe API to the renderer process via contextBridge.
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose Claude Code Bridge API
contextBridge.exposeInMainWorld('claudeCode', {
    spawn: (workingDir: string, initialPrompt?: string, chatId?: string) =>
        ipcRenderer.invoke('claude:spawn', workingDir, initialPrompt, chatId),

    send: (sessionId: string, message: string) =>
        ipcRenderer.invoke('claude:send', sessionId, message),

    execute: (sessionId: string, prompt: string) =>
        ipcRenderer.invoke('claude:execute', sessionId, prompt),

    terminate: (sessionId: string) =>
        ipcRenderer.invoke('claude:terminate', sessionId),

    terminateAll: () =>
        ipcRenderer.invoke('claude:terminateAll'),

    list: () =>
        ipcRenderer.invoke('claude:list'),


    onOutput: (callback: (data: { sessionId: string; data: string; stream: 'stdout' | 'stderr' }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:output', handler);
        return () => { ipcRenderer.removeListener('claude:output', handler); };
    },

    onChunk: (callback: (data: { sessionId: string; chunk: any }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:chunk', handler);
        return () => { ipcRenderer.removeListener('claude:chunk', handler); };
    },

    onSessionCreated: (callback: (data: { sessionId: string; sdkSessionId: string }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:session_created', handler);
        return () => { ipcRenderer.removeListener('claude:session_created', handler); };
    },

    onDone: (callback: (data: { sessionId: string }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:done', handler);
        return () => { ipcRenderer.removeListener('claude:done', handler); };
    },

    onExit: (callback: (data: { sessionId: string; code: number | null }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:exit', handler);
        return () => { ipcRenderer.removeListener('claude:exit', handler); };
    },

    // Enhanced: resolveApproval now requires toolId for queue support
    resolveApproval: (sessionId: string, toolId: string, approved: boolean) =>
        ipcRenderer.invoke('claude:resolveApproval', sessionId, toolId, approved),

    // NEW: Batch resolve all pending approvals
    resolveAllApprovals: (sessionId: string, approved: boolean) =>
        ipcRenderer.invoke('claude:resolveAllApprovals', sessionId, approved),

    // NEW: Get current approval queue for a session
    getApprovalQueue: (sessionId: string) =>
        ipcRenderer.invoke('claude:getApprovalQueue', sessionId),

    runDiagnostics: (sessionId: string) =>
        ipcRenderer.invoke('claude:runDiagnostics', sessionId),

    onRequestApproval: (callback: (data: { sessionId: string; request: any }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:request_approval', handler);
        return () => { ipcRenderer.removeListener('claude:request_approval', handler); };
    },

    // NEW: Listen for approval queue additions
    onApprovalQueued: (callback: (data: { sessionId: string; request: any }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:approval_queued', handler);
        return () => { ipcRenderer.removeListener('claude:approval_queued', handler); };
    },

    // NEW: Listen for approval resolutions
    onApprovalResolved: (callback: (data: { sessionId: string; toolId: string; approved: boolean }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:approval_resolved', handler);
        return () => { ipcRenderer.removeListener('claude:approval_resolved', handler); };
    },

    onFileModified: (callback: (data: { sessionId: string; path: string }) => void) => {
        const handler = (_event: any, data: any) => callback(data);
        ipcRenderer.on('claude:file_modified', handler);
        return () => { ipcRenderer.removeListener('claude:file_modified', handler); };
    },
});

// Expose platform info
contextBridge.exposeInMainWorld('platform', {
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    isLinux: process.platform === 'linux',
});

// Expose File System API
contextBridge.exposeInMainWorld('fileSystem', {
    saveFile: (content: string, filePath?: string) =>
        ipcRenderer.invoke('file:save', content, filePath),
    openFile: () =>
        ipcRenderer.invoke('file:open'),
    getWorkspace: () =>
        ipcRenderer.invoke('file:getWorkspace'),
    readDir: (dirPath: string) =>
        ipcRenderer.invoke('file:readDir', dirPath),
    selectFolder: () =>
        ipcRenderer.invoke('fs:selectFolder'),
    readFile: (filePath: string) =>
        ipcRenderer.invoke('fs:readFile', filePath),
});

// Expose Coordinator API
contextBridge.exposeInMainWorld('coordinator', {
    startAgent: (workingDir: string, role: string) =>
        ipcRenderer.invoke('coordinator:start', workingDir, role),
    getState: () =>
        ipcRenderer.invoke('coordinator:getState'),
    createTask: (description: string, targetFiles: string[]) =>
        ipcRenderer.invoke('coordinator:task', description, targetFiles),
    onUpdate: (callback: (state: any) => void) => {
        const handler = (_: any, state: any) => callback(state);
        ipcRenderer.on('coordinator:update', handler);
        return () => ipcRenderer.removeListener('coordinator:update', handler);
    }
});

// Expose AgentPing API
contextBridge.exposeInMainWorld('agentPing', {
    onPing: (callback: (ping: any) => void) => {
        const handler = (_: any, ping: any) => callback(ping);
        ipcRenderer.on('ping:received', handler);
        return () => ipcRenderer.removeListener('ping:received', handler);
    },
    respond: (pingId: string, response: any) =>
        ipcRenderer.invoke('ping:respond', pingId, response),
    getSystemStats: () =>
        ipcRenderer.invoke('stats:get'),
});

// Expose Interactive Terminal API
contextBridge.exposeInMainWorld('terminal', {
    spawn: (workingDir?: string) =>
        ipcRenderer.invoke('terminal:spawn', workingDir),
    sendInput: (data: string) =>
        ipcRenderer.send('terminal:input', data),
    onData: (callback: (data: string) => void) => {
        const handler = (_: any, data: string) => callback(data);
        ipcRenderer.on('terminal:data', handler);
        return () => ipcRenderer.removeListener('terminal:data', handler);
    },
    onExit: (callback: (code: number | null) => void) => {
        const handler = (_: any, code: number | null) => callback(code);
        ipcRenderer.on('terminal:exit', handler);
        return () => ipcRenderer.removeListener('terminal:exit', handler);
    },
    onCommandRouted: (callback: (data: { command: string }) => void) => {
        const handler = (_: any, data: { command: string }) => callback(data);
        ipcRenderer.on('terminal:command_routed', handler);
        return () => ipcRenderer.removeListener('terminal:command_routed', handler);
    }
});

// Expose Canvas Automated Action API (MCP)
contextBridge.exposeInMainWorld('canvas', {
    onAddAutomated: (callback: (data: { type: string; name: string; props?: any }) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('canvas:add_automated', handler);
        return () => ipcRenderer.removeListener('canvas:add_automated', handler);
    },
    onRequestSelection: (callback: (data: { requestId: string; instruction: string }) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('canvas:request_selection', handler);
        return () => ipcRenderer.removeListener('canvas:request_selection', handler);
    },
    respondToSelection: (requestId: string, selectionData: any) =>
        ipcRenderer.send(`canvas:selection_result:${requestId}`, selectionData)
});

// Expose Studio Control API (for Claude Code to control UI)
contextBridge.exposeInMainWorld('studioControl', {
    setLayoutMode: (mode: 'design' | 'dashboard' | 'code' | 'preview') =>
        ipcRenderer.send('studio:setLayoutMode', mode),
    openFile: (filePath: string) =>
        ipcRenderer.send('studio:openFile', filePath),
    runTerminalCommand: (command: string) =>
        ipcRenderer.send('studio:runTerminalCommand', command),
    getCanvasState: () =>
        ipcRenderer.invoke('studio:getCanvasState'),
    refreshPreview: () =>
        ipcRenderer.send('studio:refreshPreview'),
    setPreviewUrl: (url: string) =>
        ipcRenderer.send('studio:setPreviewUrl', url),
    openExternal: (url: string) =>
        ipcRenderer.invoke('shell:openExternal', url),
    onLayoutModeChange: (callback: (mode: string) => void) => {
        const handler = (_: any, mode: string) => callback(mode);
        ipcRenderer.on('studio:setLayoutMode', handler);
        return () => ipcRenderer.removeListener('studio:setLayoutMode', handler);
    },
    onOpenFile: (callback: (filePath: string) => void) => {
        const handler = (_: any, filePath: string) => callback(filePath);
        ipcRenderer.on('studio:openFile', handler);
        return () => ipcRenderer.removeListener('studio:openFile', handler);
    },
    onRunTerminalCommand: (callback: (command: string) => void) => {
        const handler = (_: any, command: string) => callback(command);
        ipcRenderer.on('studio:runTerminalCommand', handler);
        return () => ipcRenderer.removeListener('studio:runTerminalCommand', handler);
    },
    onRefreshPreview: (callback: () => void) => {
        const handler = () => callback();
        ipcRenderer.on('studio:refreshPreview', handler);
        return () => ipcRenderer.removeListener('studio:refreshPreview', handler);
    },
    onPreviewUrlChange: (callback: (url: string) => void) => {
        const handler = (_: any, url: string) => callback(url);
        ipcRenderer.on('studio:setPreviewUrl', handler);
        return () => ipcRenderer.removeListener('studio:setPreviewUrl', handler);
    }
});

// Expose Settings API
contextBridge.exposeInMainWorld('settings', {
    load: () => ipcRenderer.invoke('settings:load'),
    save: (updates: any) => ipcRenderer.invoke('settings:save', updates),
    get: () => ipcRenderer.invoke('settings:get')
});

// Expose Dashboard Manager API
contextBridge.exposeInMainWorld('dashboardManager', {
    restart: (dashboardId: string) =>
        ipcRenderer.invoke('dashboard:restart', dashboardId),
    getStatus: () =>
        ipcRenderer.invoke('dashboard:getStatus'),
    onProcessStarted: (callback: (data: any) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('dashboard:process_started', handler);
        return () => ipcRenderer.removeListener('dashboard:process_started', handler);
    },
    onProcessCrashed: (callback: (data: any) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('dashboard:process_crashed', handler);
        return () => ipcRenderer.removeListener('dashboard:process_crashed', handler);
    },
    onRestartSuccess: (callback: (data: any) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('dashboard:restart_success', handler);
        return () => ipcRenderer.removeListener('dashboard:restart_success', handler);
    },
    onRestartFailed: (callback: (data: any) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('dashboard:restart_failed', handler);
        return () => ipcRenderer.removeListener('dashboard:restart_failed', handler);
    },
    onHealthCheckFailed: (callback: (data: any) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('dashboard:health_check_failed', handler);
        return () => ipcRenderer.removeListener('dashboard:health_check_failed', handler);
    },
    onPortChanged: (callback: (data: any) => void) => {
        const handler = (_: any, data: any) => callback(data);
        ipcRenderer.on('dashboard:port_changed', handler);
        return () => ipcRenderer.removeListener('dashboard:port_changed', handler);
    }
});
