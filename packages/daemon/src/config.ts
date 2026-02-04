/**
 * Configuration Loader
 *
 * Multi-source configuration resolution with cascade priority:
 * 1. package.json "agentping" key
 * 2. .agents/.agentping/config.yaml (project-local)
 * 3. ~/.config/agentping/config.yaml (XDG global)
 * 4. Built-in defaults
 *
 * Also supports environment variable overrides and legacy config migration.
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

import {
  AgentPingConfigSchema,
  type AgentPingConfig,
  type PartialConfig,
  DEFAULT_CONFIG,
  mergeConfigs,
  safeParseConfig,
} from './config-schema.js';

import {
  getConfigPaths,
  getConfigFilePath,
  getJsonConfigFilePath,
  expandPath,
  ensureDir,
  ensureXdgDirs,
  getDataDir,
  type ConfigPaths,
} from './xdg-paths.js';

// Re-export types for backward compatibility
export type { AgentPingConfig as DaemonConfig };
export type { AgentPingConfig };

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
// Config Sources
// ============================================================================

interface ConfigSource {
  name: string;
  path: string;
  config: PartialConfig;
}

/**
 * Load config from a YAML file
 */
function loadYamlConfig(filePath: string): PartialConfig | null {
  if (!existsSync(filePath)) return null;

  try {
    const content = readFileSync(filePath, 'utf-8');
    return parseYaml(content) as PartialConfig;
  } catch (err) {
    console.warn(`[Config] Failed to parse YAML ${filePath}:`, err);
    return null;
  }
}

/**
 * Load config from a JSON file
 */
function loadJsonConfig(filePath: string): PartialConfig | null {
  if (!existsSync(filePath)) return null;

  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as PartialConfig;
  } catch (err) {
    console.warn(`[Config] Failed to parse JSON ${filePath}:`, err);
    return null;
  }
}

/**
 * Load config from package.json "agentping" key
 */
function loadPackageJsonConfig(packageJsonPath: string): PartialConfig | null {
  if (!existsSync(packageJsonPath)) return null;

  try {
    const content = readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content);
    if (pkg.agentping && typeof pkg.agentping === 'object') {
      return pkg.agentping as PartialConfig;
    }
  } catch (err) {
    // Not a valid package.json, or no agentping key
  }
  return null;
}

// ============================================================================
// Config Resolution
// ============================================================================

/**
 * Resolve configuration from all sources with cascade priority
 */
export function resolveConfig(cwd: string = process.cwd()): {
  config: AgentPingConfig;
  sources: ConfigSource[];
  activePath: string | undefined;
} {
  const paths = getConfigPaths(cwd);
  const sources: ConfigSource[] = [];

  // Start with defaults
  let config = { ...DEFAULT_CONFIG };

  // Layer 4: Legacy config (~/.agentping/config.json)
  const legacyPath = getJsonConfigFilePath(paths.legacy);
  const legacyConfig = loadJsonConfig(legacyPath);
  if (legacyConfig) {
    config = mergeConfigs(config, legacyConfig);
    sources.push({ name: 'legacy', path: legacyPath, config: legacyConfig });
  }

  // Layer 3: XDG global (~/.config/agentping/config.yaml)
  const xdgPath = getConfigFilePath(paths.xdgGlobal);
  const xdgConfig = loadYamlConfig(xdgPath);
  if (xdgConfig) {
    config = mergeConfigs(config, xdgConfig);
    sources.push({ name: 'xdg-global', path: xdgPath, config: xdgConfig });
  }

  // Layer 2: Project-local (.agents/.agentping/config.yaml)
  const localPath = getConfigFilePath(paths.projectLocal);
  const localConfig = loadYamlConfig(localPath);
  if (localConfig) {
    config = mergeConfigs(config, localConfig);
    sources.push({ name: 'project-local', path: localPath, config: localConfig });
  }

  // Layer 1: package.json "agentping" key (highest priority)
  if (paths.packageJson) {
    const pkgConfig = loadPackageJsonConfig(paths.packageJson);
    if (pkgConfig) {
      config = mergeConfigs(config, pkgConfig);
      sources.push({ name: 'package.json', path: paths.packageJson, config: pkgConfig });
    }
  }

  // Expand ~ in database path
  config.database.path = expandPath(config.database.path);

  // Determine the active (highest priority) config path
  const activePath = sources.length > 0 ? sources[sources.length - 1].path : undefined;

  return { config, sources, activePath };
}

// ============================================================================
// Config Loader (Main Entry Point)
// ============================================================================

export async function loadConfig(): Promise<AgentPingConfig> {
  // Ensure XDG directories exist
  ensureXdgDirs();

  // Resolve config from all sources
  const { config, sources } = resolveConfig();

  // Apply environment variable overrides (highest priority)
  if (process.env.AGENTPING_PORT) {
    config.port = parseInt(process.env.AGENTPING_PORT, 10);
  }
  if (process.env.AGENTPING_DB_PATH) {
    config.database.path = expandPath(process.env.AGENTPING_DB_PATH);
  }

  // Ensure data directory exists for the database
  const dataDir = join(config.database.path, '..');
  ensureDir(dataDir);

  // Log loaded sources
  if (sources.length > 0) {
    console.log(`[Config] Loaded from ${sources.length} source(s):`);
    for (const source of sources) {
      console.log(`  - ${source.name}: ${source.path}`);
    }
  } else {
    console.log('[Config] Using defaults (no config files found)');
  }

  return config;
}

// ============================================================================
// Config Writing
// ============================================================================

/**
 * Write a config file (YAML)
 */
export function writeConfig(
  config: PartialConfig,
  target: 'global' | 'project',
  cwd: string = process.cwd()
): string {
  const paths = getConfigPaths(cwd);
  let dir: string;
  let filePath: string;

  if (target === 'global') {
    dir = paths.xdgGlobal;
    filePath = getConfigFilePath(dir);
  } else {
    dir = paths.projectLocal;
    filePath = getConfigFilePath(dir);
  }

  ensureDir(dir);

  const yaml = stringifyYaml(config, {
    indent: 2,
    lineWidth: 80,
  });

  writeFileSync(filePath, yaml, 'utf-8');
  return filePath;
}

/**
 * Initialize a new config file with defaults
 */
export function initConfig(
  target: 'global' | 'project',
  cwd: string = process.cwd()
): string {
  const defaultPartial: PartialConfig = {
    port: DEFAULT_CONFIG.port,
    database: {
      path: target === 'global'
        ? '~/.local/share/agentping/agentping.db'
        : '.agents/.agentping/agentping.db',
    },
    notification: {
      style: 'modal',
      position: 'right',
      maxStack: 5,
      soundEnabled: true,
      soundVolume: 0.15,
    },
    theme: {
      mode: 'system',
    },
    lease: {
      defaultTtlMinutes: 5,
      maxTtlMinutes: 60,
      requireReason: true,
    },
    logging: {
      enabled: true,
      level: 'info',
    },
  };

  return writeConfig(defaultPartial, target, cwd);
}

/**
 * Set a specific config value using dot-notation key
 */
export function setConfigValue(
  key: string,
  value: string,
  target: 'global' | 'project' = 'project',
  cwd: string = process.cwd()
): string {
  const paths = getConfigPaths(cwd);
  const dir = target === 'global' ? paths.xdgGlobal : paths.projectLocal;
  const filePath = getConfigFilePath(dir);

  // Load existing config or start fresh
  let existing: Record<string, unknown> = {};
  const loaded = loadYamlConfig(filePath);
  if (loaded) {
    existing = loaded as Record<string, unknown>;
  }

  // Parse the dot-notation key and set value
  const parts = key.split('.');
  let current: Record<string, unknown> = existing;

  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as Record<string, unknown>;
  }

  // Type-coerce the value
  const lastKey = parts[parts.length - 1];
  current[lastKey] = coerceValue(value);

  // Validate the resulting config
  safeParseConfig(existing);

  // Write back
  return writeConfig(existing as PartialConfig, target, cwd);
}

/**
 * Coerce a string value to appropriate type
 */
function coerceValue(value: string): unknown {
  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Number
  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') return num;

  // String
  return value;
}

// ============================================================================
// Legacy Compatibility
// ============================================================================

/**
 * Get the default config directory path (legacy)
 */
export function getConfigDir(): string {
  return join(homedir(), '.agentping');
}
