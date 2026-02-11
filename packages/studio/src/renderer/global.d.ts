/**
 * Approval request data for diff display in approval UI
 */
export interface ApprovalRequest {
    toolCallId: string;
    name: string;
    input: Record<string, any>;
    originalContent?: string;   // File content BEFORE the change
    proposedContent?: string;   // Content that will be written
    filePath?: string;          // Resolved absolute path
    timestamp: Date;
}

export interface IClaudeCode {
    spawn: (workingDir: string, initialPrompt?: string, chatId?: string) => Promise<{ sessionId?: string; error?: string }>;
    send: (sessionId: string, message: string) => Promise<{ success: boolean; error?: string }>;
    execute: (sessionId: string, prompt: string) => Promise<{ success: boolean; error?: string }>;
    terminate: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
    terminateAll: () => Promise<void>;
    list: () => Promise<any[]>;

    // Approval methods (enhanced with queue support)
    resolveApproval: (sessionId: string, toolId: string, approved: boolean) => Promise<{ success: boolean; error?: string }>;
    resolveAllApprovals: (sessionId: string, approved: boolean) => Promise<{ success: boolean; error?: string }>;
    getApprovalQueue: (sessionId: string) => Promise<ApprovalRequest[]>;

    // Event listeners
    onOutput: (callback: (data: { sessionId: string; data: string; stream: 'stdout' | 'stderr' }) => void) => () => void;
    onChunk: (callback: (data: { sessionId: string; chunk: any }) => void) => () => void;
    onSessionCreated: (callback: (data: { sessionId: string; sdkSessionId: string }) => void) => () => void;
    onDone: (callback: (data: { sessionId: string }) => void) => () => void;
    onExit: (callback: (data: { sessionId: string; code: number | null }) => void) => () => void;
    onRequestApproval: (callback: (data: { sessionId: string; request: ApprovalRequest }) => void) => () => void;
    onApprovalQueued: (callback: (data: { sessionId: string; request: ApprovalRequest }) => void) => () => void;
    onApprovalResolved: (callback: (data: { sessionId: string; toolId: string; approved: boolean }) => void) => () => void;
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
    onCommandRouted: (callback: (data: { command: string }) => void) => () => void;
}

export interface IStudioControl {
    setLayoutMode: (mode: 'design' | 'dashboard' | 'code' | 'preview') => void;
    openFile: (filePath: string) => void;
    runTerminalCommand: (command: string) => void;
    getCanvasState: () => Promise<any>;
    refreshPreview: () => void;
    setPreviewUrl: (url: string) => void;
    openExternal: (url: string) => void;
    onLayoutModeChange: (callback: (mode: string) => void) => () => void;
    onOpenFile: (callback: (filePath: string) => void) => () => void;
    onRunTerminalCommand: (callback: (command: string) => void) => () => void;
    onRefreshPreview: (callback: () => void) => () => void;
    onPreviewUrlChange: (callback: (url: string) => void) => () => void;
}

export interface ICanvas {
    onAddAutomated: (callback: (data: { provider: 'sofia'; widgetId: string; name?: string; variant?: string; data?: Record<string, unknown> }) => void) => () => void;
    onRequestSelection: (callback: (data: { requestId: string; instruction: string }) => void) => () => void;
    respondToSelection: (requestId: string, selectionData: any) => void;
}

export interface StudioSettings {
    model: 'sonnet' | 'opus' | 'haiku';
    maxTurns: number;
    allowedTools: string[];
    autoApprove: boolean;
}

export interface ISettings {
    load: () => Promise<StudioSettings>;
    save: (updates: Partial<StudioSettings>) => Promise<{ success: boolean }>;
    get: () => Promise<StudioSettings>;
}

export interface IDashboardManager {
    restart: (dashboardId: string) => Promise<{ success?: boolean; error?: string }>;
    getStatus: () => Promise<Record<string, any>>;
    onProcessStarted: (callback: (data: any) => void) => () => void;
    onProcessCrashed: (callback: (data: any) => void) => () => void;
    onRestartSuccess: (callback: (data: any) => void) => () => void;
    onRestartFailed: (callback: (data: any) => void) => () => void;
    onHealthCheckFailed: (callback: (data: any) => void) => () => void;
    onPortChanged: (callback: (data: any) => void) => () => void;
}

// Electron webview element interface
interface WebviewElement extends HTMLElement {
    src: string;
    executeJavaScript: (script: string) => Promise<any>;
    reload: () => void;
    goBack: () => void;
    goForward: () => void;
    canGoBack: () => boolean;
    canGoForward: () => boolean;
    getURL: () => string;
    getTitle: () => string;
    isLoading: () => boolean;
    stop: () => void;
    openDevTools: () => void;
    closeDevTools: () => void;
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
        settings: ISettings;
        dashboardManager?: IDashboardManager;
        electronAPI?: any; // Electron API presence indicator
        platform: {
            isMac: boolean;
            isWindows: boolean;
            isLinux: boolean;
        };
        process?: {
            type?: string;
        };
    }

    // JSX support for webview element
    namespace JSX {
        interface IntrinsicElements {
            webview: React.DetailedHTMLProps<
                React.HTMLAttributes<WebviewElement> & {
                    src?: string;
                    allowpopups?: string;
                    webpreferences?: string;
                    preload?: string;
                    partition?: string;
                    nodeintegration?: string;
                },
                WebviewElement
            >;
        }
    }
}
