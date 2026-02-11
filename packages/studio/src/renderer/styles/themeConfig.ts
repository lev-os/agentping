/**
 * AgentPing Studio Theme Configuration
 *
 * Fail-fast contract:
 * - Theme MUST be one of: agentping | skynet | syslog
 * - Mode MUST be one of: dark | light
 */

export type Theme = 'agentping' | 'skynet' | 'syslog';
export type ThemeMode = 'dark' | 'light';

export interface ThemeConfig {
  name: Theme;
  displayName: string;
  description: string;
}

export interface ModeConfig {
  name: ThemeMode;
  displayName: string;
}

const STORAGE_THEME_KEY = 'agentping-theme';
const STORAGE_MODE_KEY = 'agentping-theme-mode';

export const THEMES: Record<Theme, ThemeConfig> = {
  agentping: {
    name: 'agentping',
    displayName: 'AgentPing',
    description: 'Core AgentPing visual language',
  },
  skynet: {
    name: 'skynet',
    displayName: 'Skynet',
    description: 'Sofia-import tactical/cyber theme',
  },
  syslog: {
    name: 'syslog',
    displayName: 'Syslog',
    description: 'System utility theme for diagnostics and operations',
  },
};

export const MODES: Record<ThemeMode, ModeConfig> = {
  dark: { name: 'dark', displayName: 'Dark' },
  light: { name: 'light', displayName: 'Light' },
};

function assertValidTheme(theme: string | null): asserts theme is Theme {
  if (!theme || !(theme in THEMES)) {
    throw new Error(
      `Invalid theme "${theme ?? 'null'}". Valid themes: ${Object.keys(THEMES).join(', ')}`,
    );
  }
}

function assertValidMode(mode: string | null): asserts mode is ThemeMode {
  if (!mode || !(mode in MODES)) {
    throw new Error(
      `Invalid theme mode "${mode ?? 'null'}". Valid modes: ${Object.keys(MODES).join(', ')}`,
    );
  }
}

function applyThemeAttributes(theme: Theme, mode: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
  document.body.setAttribute('data-theme', theme);
  document.body.setAttribute('data-mode', mode);
}

export function getCurrentTheme(): Theme {
  const theme = document.body.getAttribute('data-theme');
  assertValidTheme(theme);
  return theme;
}

export function getCurrentMode(): ThemeMode {
  const mode = document.body.getAttribute('data-mode');
  assertValidMode(mode);
  return mode;
}

export function setTheme(theme: Theme): void {
  const currentMode = document.body.getAttribute('data-mode');
  assertValidMode(currentMode);
  const mode: ThemeMode = currentMode;
  applyThemeAttributes(theme, mode);

  try {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

export function setMode(mode: ThemeMode): void {
  const currentTheme = document.body.getAttribute('data-theme');
  assertValidTheme(currentTheme);
  const theme: Theme = currentTheme;
  applyThemeAttributes(theme, mode);

  try {
    localStorage.setItem(STORAGE_MODE_KEY, mode);
  } catch (error) {
    console.warn('Failed to save mode preference:', error);
  }
}

export function loadSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (!saved) return 'skynet';
    assertValidTheme(saved);
    return saved;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Unable to load theme preference: ${String(error)}`);
  }
}

export function loadSavedMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_MODE_KEY);
    if (!saved) return 'dark';
    assertValidMode(saved);
    return saved;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(`Unable to load mode preference: ${String(error)}`);
  }
}

export function initializeTheme(): void {
  const theme = loadSavedTheme();
  const mode = loadSavedMode();
  applyThemeAttributes(theme, mode);
}

export function toggleThemeMode(): ThemeMode {
  const current = getCurrentMode();
  const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
  setMode(next);
  return next;
}

export function getThemeConfig(theme: Theme): ThemeConfig {
  return THEMES[theme];
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES);
}
