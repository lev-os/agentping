/**
 * XDG Base Directory Specification Utilities
 *
 * Provides XDG-compliant paths for config, data, and cache directories.
 * Falls back to sensible defaults on non-Linux systems.
 */

import { homedir, platform } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// ============================================================================
// XDG Environment Variables
// ============================================================================

/**
 * XDG_CONFIG_HOME: User-specific configuration files
 * Default: ~/.config
 */
export function getXdgConfigHome(): string {
  return process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
}

/**
 * XDG_DATA_HOME: User-specific data files
 * Default: ~/.local/share
 */
export function getXdgDataHome(): string {
  return process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share');
}

/**
 * XDG_CACHE_HOME: User-specific cache files
 * Default: ~/.cache
 */
export function getXdgCacheHome(): string {
  return process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
}

/**
 * XDG_STATE_HOME: User-specific state files (logs, history)
 * Default: ~/.local/state
 */
export function getXdgStateHome(): string {
  return process.env.XDG_STATE_HOME || join(homedir(), '.local', 'state');
}

// ============================================================================
// AgentPing-Specific Paths
// ============================================================================

const APP_NAME = 'agentping';

/**
 * Config directory paths in priority order (highest to lowest)
 */
export interface ConfigPaths {
  /** package.json path (if exists) */
  packageJson: string | null;
  /** Project-local: .agents/.agentping/ */
  projectLocal: string;
  /** XDG global: ~/.config/agentping/ */
  xdgGlobal: string;
  /** Legacy: ~/.agentping/ (for migration) */
  legacy: string;
}

/**
 * Get all config directory paths
 */
export function getConfigPaths(cwd: string = process.cwd()): ConfigPaths {
  return {
    packageJson: join(cwd, 'package.json'),
    projectLocal: join(cwd, '.agents', '.agentping'),
    xdgGlobal: join(getXdgConfigHome(), APP_NAME),
    legacy: join(homedir(), '.agentping'),
  };
}

/**
 * Get the config file path within a directory
 */
export function getConfigFilePath(dir: string): string {
  return join(dir, 'config.yaml');
}

/**
 * Get the JSON config file path (legacy)
 */
export function getJsonConfigFilePath(dir: string): string {
  return join(dir, 'config.json');
}

/**
 * Get the XDG-compliant data directory
 */
export function getDataDir(): string {
  return join(getXdgDataHome(), APP_NAME);
}

/**
 * Get the XDG-compliant cache directory
 */
export function getCacheDir(): string {
  return join(getXdgCacheHome(), APP_NAME);
}

/**
 * Get the XDG-compliant state directory (logs)
 */
export function getStateDir(): string {
  return join(getXdgStateHome(), APP_NAME);
}

/**
 * Get the default database path
 */
export function getDefaultDbPath(): string {
  return join(getDataDir(), 'agentping.db');
}

/**
 * Get the default log directory
 */
export function getLogDir(): string {
  return join(getStateDir(), 'logs');
}

// ============================================================================
// Directory Management
// ============================================================================

/**
 * Ensure a directory exists, creating it if necessary
 */
export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Ensure all XDG directories exist
 */
export function ensureXdgDirs(): void {
  ensureDir(join(getXdgConfigHome(), APP_NAME));
  ensureDir(getDataDir());
  ensureDir(getCacheDir());
  ensureDir(getStateDir());
  ensureDir(getLogDir());
}

/**
 * Ensure project-local config directory exists
 */
export function ensureProjectLocalDir(cwd: string = process.cwd()): string {
  const dir = join(cwd, '.agents', '.agentping');
  ensureDir(dir);
  return dir;
}

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Expand ~ to home directory in paths
 */
export function expandPath(path: string): string {
  if (path.startsWith('~/')) {
    return join(homedir(), path.slice(2));
  }
  if (path.startsWith('~')) {
    return join(homedir(), path.slice(1));
  }
  return path;
}

/**
 * Contract home directory to ~ for display
 */
export function contractPath(path: string): string {
  const home = homedir();
  if (path.startsWith(home)) {
    return '~' + path.slice(home.length);
  }
  return path;
}

// ============================================================================
// Platform Detection
// ============================================================================

/**
 * Check if running on macOS
 */
export function isMacOS(): boolean {
  return platform() === 'darwin';
}

/**
 * Check if running on Linux
 */
export function isLinux(): boolean {
  return platform() === 'linux';
}

/**
 * Check if running on Windows
 */
export function isWindows(): boolean {
  return platform() === 'win32';
}

/**
 * Get platform-appropriate config directory
 * macOS: ~/Library/Application Support/agentping (native) or XDG
 * Windows: %APPDATA%\agentping
 * Linux: XDG
 */
export function getPlatformConfigDir(): string {
  if (isWindows() && process.env.APPDATA) {
    return join(process.env.APPDATA, APP_NAME);
  }
  // Use XDG on macOS and Linux for consistency
  return join(getXdgConfigHome(), APP_NAME);
}

/**
 * Get all config search paths for display
 */
export function getAllConfigSearchPaths(cwd: string = process.cwd()): string[] {
  const paths = getConfigPaths(cwd);
  return [
    paths.packageJson ? `${paths.packageJson} (agentping key)` : null,
    `${paths.projectLocal}/config.yaml (project-local)`,
    `${paths.xdgGlobal}/config.yaml (XDG global)`,
    `${paths.legacy}/config.json (legacy)`,
  ].filter((p): p is string => p !== null);
}
