/**
 * AgentPing Studio - Theme Configuration System
 *
 * Provides programmatic control over theme switching and customization.
 * Supports multiple themes: default (original), kingly (cyber-terminal)
 */

export type Theme = 'default' | 'kingly';

export interface ThemeConfig {
  name: Theme;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    background: string;
    surface: string;
  };
}

/**
 * Available theme configurations
 */
export const THEMES: Record<Theme, ThemeConfig> = {
  default: {
    name: 'default',
    displayName: 'AgentPing Default',
    description: 'Original cyber-premium design with teal accents',
    colors: {
      primary: '#00ffaa',
      background: '#0a0a0f',
      surface: '#12121a',
    },
  },
  kingly: {
    name: 'kingly',
    displayName: 'Kingly',
    description: 'Cyber-terminal aesthetic with neon green and void black',
    colors: {
      primary: '#22c55e',
      background: '#000000',
      surface: '#0a0a0a',
    },
  },
};

/**
 * Get the current theme from the document body
 */
export function getCurrentTheme(): Theme {
  const theme = document.body.getAttribute('data-theme');
  return (theme as Theme) || 'default';
}

/**
 * Set the active theme
 * @param theme - Theme name to apply
 */
export function setTheme(theme: Theme): void {
  if (theme === 'default') {
    // Remove the data-theme attribute to restore default
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', theme);
  }

  // Store preference in localStorage
  try {
    localStorage.setItem('agentping-theme', theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

/**
 * Load saved theme preference from localStorage
 */
export function loadSavedTheme(): Theme {
  try {
    const saved = localStorage.getItem('agentping-theme');
    if (saved && saved in THEMES) {
      return saved as Theme;
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
  }
  return 'kingly'; // Default to Kingly theme
}

/**
 * Initialize theme system on app startup
 */
export function initializeTheme(): void {
  const theme = loadSavedTheme();
  setTheme(theme);
}

/**
 * Toggle between available themes
 */
export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const next = current === 'default' ? 'kingly' : 'default';
  setTheme(next);
  return next;
}

/**
 * Get theme configuration
 */
export function getThemeConfig(theme: Theme): ThemeConfig {
  return THEMES[theme];
}

/**
 * Get all available themes
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(THEMES);
}
