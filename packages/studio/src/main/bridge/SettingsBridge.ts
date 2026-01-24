/**
 * Settings Bridge - Manages Claude Code settings for Studio
 *
 * Stores settings in ~/.claude/studio-settings.json
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export interface StudioSettings {
    model: 'sonnet' | 'opus' | 'haiku';
    maxTurns: number;
    allowedTools: string[];
    autoApprove: boolean;
}

export class SettingsBridge {
    private settingsPath: string;
    private settings: StudioSettings;

    constructor() {
        this.settingsPath = path.join(os.homedir(), '.claude', 'studio-settings.json');
        this.settings = this.getDefaults();
    }

    private getDefaults(): StudioSettings {
        return {
            model: 'sonnet',
            maxTurns: 20,
            allowedTools: [
                'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
                'WebSearch', 'WebFetch', 'Task', 'LS',
                'TodoWrite', 'TodoRead', 'NotebookEdit', 'NotebookRead'
            ],
            autoApprove: false
        };
    }

    async load(): Promise<StudioSettings> {
        try {
            const content = await fs.readFile(this.settingsPath, 'utf-8');
            const loaded = JSON.parse(content);
            this.settings = { ...this.getDefaults(), ...loaded };
        } catch (error) {
            // File doesn't exist or is invalid, use defaults
            this.settings = this.getDefaults();
        }
        return this.settings;
    }

    async save(updates: Partial<StudioSettings>): Promise<void> {
        this.settings = { ...this.settings, ...updates };

        // Ensure .claude directory exists
        const dir = path.dirname(this.settingsPath);
        try {
            await fs.mkdir(dir, { recursive: true });
        } catch {
            // Directory already exists
        }

        await fs.writeFile(
            this.settingsPath,
            JSON.stringify(this.settings, null, 2),
            'utf-8'
        );
    }

    getSettings(): StudioSettings {
        return { ...this.settings };
    }

    getModel(): string {
        return this.settings.model;
    }

    getMaxTurns(): number {
        return this.settings.maxTurns;
    }

    getAllowedTools(): string[] {
        return [...this.settings.allowedTools];
    }

    isAutoApproveEnabled(): boolean {
        return this.settings.autoApprove;
    }
}
