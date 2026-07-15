/**
 * Settings Bridge - Manages Claude Code settings for Studio
 *
 */

import * as fs from 'fs/promises';
import { dirname, join } from 'path';
import { homedir } from 'os';

export interface StudioSettings {
    model: 'sonnet' | 'opus' | 'haiku';
    maxTurns: number;
    allowedTools: string[];
    autoApprove: boolean;
}

function isNotFoundError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

export class SettingsBridge {
    private settingsPath: string;
    private legacySettingsPath: string;
    private settings: StudioSettings;

    constructor() {
        this.settingsPath = join(
            process.env.XDG_CONFIG_HOME || join(homedir(), '.config'),
            'agentping',
            'studio-settings.json',
        );
        this.legacySettingsPath = join(homedir(), '.claude/studio-settings.json');
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
        const currentContent = await this.readSettingsIfPresent(this.settingsPath);
        if (currentContent !== null) {
            this.settings = this.parseSettings(currentContent) ?? this.getDefaults();
            return this.settings;
        }

        const legacyContent = await this.readSettingsIfPresent(this.legacySettingsPath);
        if (legacyContent === null) {
            this.settings = this.getDefaults();
            return this.settings;
        }

        await fs.mkdir(dirname(this.settingsPath), { recursive: true });
        await fs.writeFile(this.settingsPath, legacyContent, 'utf-8');
        this.settings = this.parseSettings(legacyContent) ?? this.getDefaults();
        return this.settings;
    }

    async save(updates: Partial<StudioSettings>): Promise<void> {
        this.settings = { ...this.settings, ...updates };

        const dir = dirname(this.settingsPath);
        await fs.mkdir(dir, { recursive: true });

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

    private async readSettingsIfPresent(settingsPath: string): Promise<string | null> {
        try {
            return await fs.readFile(settingsPath, 'utf-8');
        } catch (error) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }

    private parseSettings(content: string): StudioSettings | null {
        try {
            const loaded = JSON.parse(content);
            return { ...this.getDefaults(), ...loaded };
        } catch (error) {
            if (error instanceof SyntaxError) {
                return null;
            }
            throw error;
        }
    }
}
