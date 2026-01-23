/**
 * File Service
 * 
 * Handles file system operations for .apen files.
 */

import { dialog, BrowserWindow } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import { ApenDocument } from '../shared/ApenFormat.js';

export class FileService {
    private mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    async saveFile(content: string, filePath?: string): Promise<{ success: boolean; filePath?: string; error?: string }> {
        try {
            let targetPath = filePath;

            if (!targetPath) {
                const { canceled, filePath: selectedPath } = await dialog.showSaveDialog(this.mainWindow, {
                    title: 'Save Design',
                    defaultPath: 'Untitled.apen',
                    filters: [{ name: 'AgentPing Design', extensions: ['apen'] }],
                });

                if (canceled || !selectedPath) {
                    return { success: false };
                }

                targetPath = selectedPath;
            }

            await fs.writeFile(targetPath, content, 'utf-8');
            return { success: true, filePath: targetPath };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error saving file' };
        }
    }

    async openFile(): Promise<{ success: boolean; content?: string; filePath?: string; error?: string }> {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog(this.mainWindow, {
                title: 'Open Design',
                filters: [{ name: 'AgentPing Design', extensions: ['apen', 'json'] }],
                properties: ['openFile'],
            });

            if (canceled || filePaths.length === 0) {
                return { success: false };
            }

            const filePath = filePaths[0];
            const content = await fs.readFile(filePath, 'utf-8');

            return { success: true, content, filePath };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error opening file' };
        }
    }

    async getWorkspace(): Promise<{ success: boolean; path?: string; error?: string }> {
        try {
            // Default to home directory or documents
            const workspacePath = path.join(process.env.HOME || '', 'Documents');
            return { success: true, path: workspacePath };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    }

    async readDir(dirPath: string): Promise<{ success: boolean; entries?: Array<{ name: string; isDirectory: boolean }>; error?: string }> {
        try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            return {
                success: true,
                entries: entries.map(entry => ({
                    name: entry.name,
                    isDirectory: entry.isDirectory(),
                })).filter(e => !e.name.startsWith('.')), // Hide hidden files
            };
        } catch (error) {
            return { success: false, error: (error as Error).message };
        }
    }
}
