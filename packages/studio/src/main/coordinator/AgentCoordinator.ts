/**
 * Agent Coordinator
 * 
 * Manages parallel agent sessions, task distribution, and file locking.
 */

import { ClaudeCodeBridge } from '../bridge/ClaudeCodeBridge.js';
import { BrowserWindow, ipcMain } from 'electron';
import { nanoid } from 'nanoid';

export interface AgentTask {
    id: string;
    type: 'design' | 'refactor' | 'review';
    description: string;
    targetFiles: string[];
    assignedAgentId?: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
}

export interface AgentState {
    id: string;
    status: 'idle' | 'busy' | 'error';
    currentTask?: string;
    lockedFiles: string[];
    workingDir: string;
}

export class AgentCoordinator {
    private bridge: ClaudeCodeBridge;
    private agents: Map<string, AgentState> = new Map();
    private tasks: Map<string, AgentTask> = new Map();
    private fileLocks: Map<string, string> = new Map(); // FilePath -> AgentID
    private mainWindow: BrowserWindow;

    constructor(bridge: ClaudeCodeBridge, mainWindow: BrowserWindow) {
        this.bridge = bridge;
        this.mainWindow = mainWindow;
        this.setupHandlers();
    }

    private setupHandlers() {
        ipcMain.handle('coordinator:getState', () => this.getState());
    }

    /**
     * Start a new agent session
     */
    async startAgent(workingDir: string, role: string = 'general'): Promise<string> {
        const result = await this.bridge.spawn(workingDir, `You are a ${role} specialist.`);

        if (result.success) {
            this.agents.set(result.sessionId, {
                id: result.sessionId,
                status: 'idle',
                lockedFiles: [],
                workingDir
            });
            this.broadcastStatus();
            return result.sessionId;
        }

        throw new Error(result.error);
    }

    /**
     * Assign a task to an agent
     */
    async assignTask(taskId: string, agentId: string): Promise<boolean> {
        const task = this.tasks.get(taskId);
        const agent = this.agents.get(agentId);

        if (!task || !agent) return false;
        if (agent.status === 'busy') return false;

        // Check file locks
        const conflictingLocks = task.targetFiles.filter(file => {
            const lockOwner = this.fileLocks.get(file);
            return lockOwner && lockOwner !== agentId;
        });

        if (conflictingLocks.length > 0) {
            console.warn(`Cannot assign task ${taskId}: Files locked by other agents: ${conflictingLocks.join(', ')}`);
            return false;
        }

        // Acquire locks
        task.targetFiles.forEach(file => this.fileLocks.set(file, agentId));

        // Update state
        agent.status = 'busy';
        agent.currentTask = taskId;
        agent.lockedFiles = [...task.targetFiles];
        task.assignedAgentId = agentId;
        task.status = 'active';

        // Send instructions to agent
        await this.bridge.send(agentId, `Your task: ${task.description}`);

        this.broadcastStatus();
        return true;
    }

    /**
     * Complete a task and release locks
     */
    completeTask(agentId: string): void {
        const agent = this.agents.get(agentId);
        if (!agent || !agent.currentTask) return;

        const task = this.tasks.get(agent.currentTask);
        if (task) {
            task.status = 'completed';
        }

        // Release locks
        agent.lockedFiles.forEach(file => this.fileLocks.delete(file));

        // Reset agent
        agent.status = 'idle';
        agent.currentTask = undefined;
        agent.lockedFiles = [];

        this.broadcastStatus();
    }

    /**
     * Get current state
     */
    getState() {
        return {
            agents: Array.from(this.agents.values()),
            tasks: Array.from(this.tasks.values()),
            locks: Object.fromEntries(this.fileLocks)
        };
    }

    /**
     * Broadcast status to UI
     */
    private broadcastStatus() {
        try {
            if (this.mainWindow && !this.mainWindow.isDestroyed() && !this.mainWindow.webContents.isDestroyed()) {
                this.mainWindow.webContents.send('coordinator:update', this.getState());
            }
        } catch (err) {
            // Window may have been destroyed due to HMR or reload
            console.warn('[AgentCoordinator] Failed to broadcast status:', err);
        }
    }



    // --- Task Management ---

    createTask(description: string, targetFiles: string[] = []): string {
        const id = nanoid(10);
        this.tasks.set(id, {
            id,
            type: 'design',
            description,
            targetFiles,
            status: 'pending'
        });
        this.broadcastStatus();
        return id;
    }
}
