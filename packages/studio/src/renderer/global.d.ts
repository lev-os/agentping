export interface IClaudeCode {
    spawn: (workingDir: string, initialPrompt?: string, chatId?: string) => Promise<{ sessionId?: string; error?: string }>;
    send: (sessionId: string, message: string) => Promise<{ success: boolean; error?: string }>;
    execute: (sessionId: string, prompt: string) => Promise<{ success: boolean; error?: string }>;
    terminate: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
    terminateAll: () => Promise<void>;
    list: () => Promise<any[]>;
    resolveApproval: (sessionId: string, approved: boolean) => Promise<{ success: boolean; error?: string }>;
    onOutput: (callback: (data: { sessionId: string; data: string; stream: 'stdout' | 'stderr' }) => void) => () => void;
    onChunk: (callback: (data: { sessionId: string; chunk: any }) => void) => () => void;
    onSessionCreated: (callback: (data: { sessionId: string; sdkSessionId: string }) => void) => () => void;
    onDone: (callback: (data: { sessionId: string }) => void) => () => void;
    onExit: (callback: (data: { sessionId: string; code: number | null }) => void) => () => void;
    onRequestApproval: (callback: (data: { sessionId: string; request: any }) => void) => () => void;
    onFileModified: (callback: (data: { sessionId: string; path: string }) => void) => () => void;
    runDiagnostics: (sessionId: string) => Promise<any[]>;
}

export interface IFileSystem {
    saveFile: (content: string, filePath?: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
    openFile: () => Promise<{ success: boolean; content?: string; filePath?: string; error?: string }>;
    getWorkspace: () => Promise<{ success: boolean; path?: string; error?: string }>;
    readDir: (dirPath: string) => Promise<{ success: boolean; entries?: any[]; error?: string }>;
    selectFolder: () => Promise<{ success: boolean; path?: string; error?: string }>;
    readFile: (filePath: string) => Promise<{
        success: boolean;
        content?: string;
        fileName?: string;
        extension?: string;
        size?: number;
        modifiedAt?: string;
        error?: string
    }>;
}

export interface ICoordinator {
    startAgent: (workingDir: string, role?: string) => Promise<{ success: boolean; sessionId?: string; error?: string }>;
    getState: () => Promise<any>;
    createTask: (description: string, targetFiles: string[]) => Promise<{ success: boolean; taskId?: string }>;
    onUpdate: (callback: (state: any) => void) => () => void;
}

export interface IAgentPing {
    onPing: (callback: (ping: any) => void) => () => void;
    respond: (pingId: string, response: any) => Promise<{ success: boolean; error?: string }>;
    getSystemStats: () => Promise<any>;
}

export interface ITerminal {
    spawn: (workingDir?: string) => Promise<{ success: boolean; error?: string }>;
    sendInput: (data: string) => void;
    onData: (callback: (data: string) => void) => () => void;
    onExit: (callback: (code: number | null) => void) => () => void;
}

export interface IStudioControl {
    setLayoutMode: (mode: 'design' | 'dashboard' | 'code' | 'preview') => void;
    openFile: (filePath: string) => void;
    runTerminalCommand: (command: string) => void;
    getCanvasState: () => Promise<any>;
    refreshPreview: () => void;
    onLayoutModeChange: (callback: (mode: string) => void) => () => void;
    onOpenFile: (callback: (filePath: string) => void) => () => void;
    onRunTerminalCommand: (callback: (command: string) => void) => () => void;
    onRefreshPreview: (callback: () => void) => () => void;
}

export interface ICanvas {
    onAddAutomated: (callback: (data: { type: string; name: string; props?: any }) => void) => () => void;
    onRequestSelection: (callback: (data: { requestId: string; instruction: string }) => void) => () => void;
    respondToSelection: (requestId: string, selectionData: any) => void;
}

declare global {
    interface Window {
        claudeCode: IClaudeCode;
        fileSystem: IFileSystem;
        coordinator: ICoordinator;
        agentPing: IAgentPing;
        terminal: ITerminal;
        canvas: ICanvas;
        studioControl: IStudioControl;
        platform: {
            isMac: boolean;
            isWindows: boolean;
            isLinux: boolean;
        };
    }
}
