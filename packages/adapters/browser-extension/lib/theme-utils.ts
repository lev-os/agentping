/**
 * AgentPing Theme Utilities
 *
 * Theme detection, persistence, and management utilities.
 * Supports system preference detection and manual overrides.
 */

import {
  darkThemeColors,
  lightThemeColors,
  generateCSSVariables,
  type ColorTokens,
} from './tokens';

// ============================================================================
// Types
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
}

// ============================================================================
// System Preference Detection
// ============================================================================

/**
 * Check if user prefers dark mode at the system level
 */
export function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get the effective theme based on config and system preferences
 */
export function getEffectiveTheme(config: ThemeConfig): EffectiveTheme {
  if (config.mode === 'system') {
    return systemPrefersDark() ? 'dark' : 'light';
  }
  return config.mode;
}

/**
 * Get color tokens for the effective theme
 */
export function getThemeColors(effectiveTheme: EffectiveTheme): ColorTokens {
  return effectiveTheme === 'dark' ? darkThemeColors : lightThemeColors;
}

// ============================================================================
// Theme Manager
// ============================================================================

export interface ThemeChangeCallback {
  (theme: EffectiveTheme, colors: ColorTokens): void;
}

/**
 * Manages theme state and responds to system preference changes
 */
export class ThemeManager {
  private config: ThemeConfig;
  private effectiveTheme: EffectiveTheme;
  private listeners: Set<ThemeChangeCallback> = new Set();
  private mediaQuery: MediaQueryList | null = null;
  private boundHandleSystemChange: () => void;

  constructor(initialConfig: ThemeConfig = { mode: 'system' }) {
    this.config = initialConfig;
    this.effectiveTheme = getEffectiveTheme(this.config);
    this.boundHandleSystemChange = this.handleSystemChange.bind(this);

    // Listen for system preference changes
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.boundHandleSystemChange);
    }
  }

  /**
   * Handle system color scheme changes
   */
  private handleSystemChange(): void {
    if (this.config.mode === 'system') {
      const newTheme = getEffectiveTheme(this.config);
      if (newTheme !== this.effectiveTheme) {
        this.effectiveTheme = newTheme;
        this.notifyListeners();
      }
    }
  }

  /**
   * Notify all listeners of theme change
   */
  private notifyListeners(): void {
    const colors = this.getColors();
    for (const listener of this.listeners) {
      listener(this.effectiveTheme, colors);
    }
  }

  /**
   * Get the current effective theme
   */
  getTheme(): EffectiveTheme {
    return this.effectiveTheme;
  }

  /**
   * Get the current theme colors
   */
  getColors(): ColorTokens {
    return getThemeColors(this.effectiveTheme);
  }

  /**
   * Get CSS variables string for the current theme
   */
  getCSSVariables(): string {
    return generateCSSVariables(this.getColors());
  }

  /**
   * Get the current config
   */
  getConfig(): ThemeConfig {
    return { ...this.config };
  }

  /**
   * Update the theme config
   */
  setConfig(config: Partial<ThemeConfig>): void {
    this.config = { ...this.config, ...config };
    const newTheme = getEffectiveTheme(this.config);

    if (newTheme !== this.effectiveTheme) {
      this.effectiveTheme = newTheme;
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(callback: ThemeChangeCallback): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.boundHandleSystemChange);
    }
    this.listeners.clear();
  }
}

// ============================================================================
// Shadow DOM Theme Injection
// ============================================================================

/**
 * Inject theme CSS variables into a Shadow DOM
 */
export function injectThemeIntoShadow(
  shadow: ShadowRoot,
  themeManager: ThemeManager
): () => void {
  // Create style element for theme variables
  const styleElement = document.createElement('style');
  styleElement.id = 'ap-theme-vars';

  const updateStyles = () => {
    styleElement.textContent = `:host {
      ${themeManager.getCSSVariables()}
    }

    :host([data-theme="dark"]) {
      ${generateCSSVariables(darkThemeColors)}
    }

    :host([data-theme="light"]) {
      ${generateCSSVariables(lightThemeColors)}
    }`;
  };

  // Initial injection
  updateStyles();
  shadow.prepend(styleElement);

  // Update host data attribute
  const host = shadow.host as HTMLElement;
  host.dataset.theme = themeManager.getTheme();

  // Subscribe to changes
  const unsubscribe = themeManager.subscribe((theme) => {
    host.dataset.theme = theme;
    updateStyles();
  });

  return () => {
    unsubscribe();
    styleElement.remove();
  };
}

// ============================================================================
// CSS Helpers
// ============================================================================

/**
 * Generate complete theme stylesheet
 */
export function generateThemeStylesheet(theme: EffectiveTheme): string {
  const colors = getThemeColors(theme);

  return `
    :host {
      ${generateCSSVariables(colors)}
    }
  `;
}

/**
 * Get theme-aware box shadow
 */
export function getThemeBoxShadow(theme: EffectiveTheme, type: 'modal' | 'drawer' | 'toast'): string {
  const isDark = theme === 'dark';

  switch (type) {
    case 'modal':
      return isDark
        ? '0 0 40px rgba(0, 229, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.5)'
        : '0 25px 50px rgba(0, 0, 0, 0.15)';
    case 'drawer':
      return isDark
        ? '-4px 0 20px rgba(0, 0, 0, 0.5)'
        : '-4px 0 20px rgba(0, 0, 0, 0.1)';
    case 'toast':
      return isDark
        ? '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 229, 255, 0.1)'
        : '0 4px 20px rgba(0, 0, 0, 0.1)';
    default:
      return 'none';
  }
}

/**
 * Get theme-aware vignette gradient
 */
export function getVignetteGradient(theme: EffectiveTheme): string {
  return theme === 'dark'
    ? `radial-gradient(
        ellipse 80% 70% at 50% 50%,
        rgba(5, 5, 5, 0.85) 0%,
        rgba(5, 5, 5, 0.92) 50%,
        rgba(0, 0, 0, 0.98) 100%
      )`
    : `radial-gradient(
        ellipse 80% 70% at 50% 50%,
        rgba(255, 255, 255, 0.85) 0%,
        rgba(255, 255, 255, 0.92) 50%,
        rgba(240, 240, 240, 0.98) 100%
      )`;
}

// ============================================================================
// Storage Helpers
// ============================================================================

const THEME_STORAGE_KEY = 'agentping_theme_config';

/**
 * Load theme config from chrome.storage
 */
export async function loadThemeConfig(): Promise<ThemeConfig> {
  try {
    const result = await chrome.storage.local.get(THEME_STORAGE_KEY);
    if (result[THEME_STORAGE_KEY]) {
      return result[THEME_STORAGE_KEY] as ThemeConfig;
    }
  } catch (e) {
    console.warn('[AgentPing] Failed to load theme config:', e);
  }
  return { mode: 'system' };
}

/**
 * Save theme config to chrome.storage
 */
export async function saveThemeConfig(config: ThemeConfig): Promise<void> {
  try {
    await chrome.storage.local.set({ [THEME_STORAGE_KEY]: config });
  } catch (e) {
    console.warn('[AgentPing] Failed to save theme config:', e);
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let globalThemeManager: ThemeManager | null = null;

/**
 * Get or create the global theme manager instance
 */
export function getGlobalThemeManager(): ThemeManager {
  if (!globalThemeManager) {
    globalThemeManager = new ThemeManager();
  }
  return globalThemeManager;
}

/**
 * Initialize global theme manager with config from storage
 */
export async function initGlobalThemeManager(): Promise<ThemeManager> {
  const config = await loadThemeConfig();
  if (globalThemeManager) {
    globalThemeManager.setConfig(config);
  } else {
    globalThemeManager = new ThemeManager(config);
  }
  return globalThemeManager;
}
