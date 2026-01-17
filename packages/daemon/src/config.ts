/**
 * Configuration Loader
 */

import { existsSync, readFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// ============================================================================
// Config Types
// ============================================================================

export interface DaemonConfig {
    port: number;
    database: {
        path: string;
    };
    webui?: {
        enabled: boolean;
        port: number;
    };
    slack?: {
        enabled: boolean;
        botToken?: string;
        channels?: Record<string, string>;
    };
    webhooks?: WebhookConfig[];
    parsers?: string[];
    cors?: {
        origins: string[];
    };
    logging?: {
        enabled: boolean;
        level: 'debug' | 'info' | 'warn' | 'error';
    };

    // Internal
    configPath?: string;
}

export interface WebhookConfig {
    url: string;
    events: string[];
    secret?: string;
    filters?: {
        types?: string[];
        agents?: string[];
    };
}

// ============================================================================
// Default Config
// ============================================================================

const DEFAULT_CONFIG: DaemonConfig = {
    port: 7890,
    database: {
        path: join(homedir(), '.agentping', 'agentping.db'),
    },
    webui: {
        enabled: true,
        port: 7891,
    },
    slack: {
        enabled: false,
    },
    webhooks: [],
    parsers: [],
    cors: {
        origins: ['*'],
    },
    logging: {
        enabled: true,
        level: 'info',
    },
};

// ============================================================================
// Config Loader
// ============================================================================

export async function loadConfig(): Promise<DaemonConfig> {
    const configDir = join(homedir(), '.agentping');
    const configPath = join(configDir, 'config.json');

    // Ensure config directory exists
    if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
    }

    // Load config file if exists
    let userConfig: Partial<DaemonConfig> = {};
    if (existsSync(configPath)) {
        try {
            const content = readFileSync(configPath, 'utf-8');
            userConfig = JSON.parse(content);
        } catch (err) {
            console.warn(`⚠️  Failed to parse config file: ${err}`);
        }
    }

    // Merge with defaults
    const config: DaemonConfig = {
        ...DEFAULT_CONFIG,
        ...userConfig,
        database: {
            ...DEFAULT_CONFIG.database,
            ...userConfig.database,
        },
        webui: {
            enabled: userConfig.webui?.enabled ?? DEFAULT_CONFIG.webui?.enabled ?? true,
            port: userConfig.webui?.port ?? DEFAULT_CONFIG.webui?.port ?? 7891,
        },
        logging: {
            enabled: userConfig.logging?.enabled ?? DEFAULT_CONFIG.logging?.enabled ?? true,
            level: userConfig.logging?.level ?? DEFAULT_CONFIG.logging?.level ?? 'info',
        },
        configPath: existsSync(configPath) ? configPath : undefined,
    };

    // Environment variable overrides
    if (process.env.AGENTPING_PORT) {
        config.port = parseInt(process.env.AGENTPING_PORT, 10);
    }
    if (process.env.AGENTPING_DB_PATH) {
        config.database.path = process.env.AGENTPING_DB_PATH;
    }

    return config;
}

/**
 * Get the default config directory path
 */
export function getConfigDir(): string {
    return join(homedir(), '.agentping');
}
