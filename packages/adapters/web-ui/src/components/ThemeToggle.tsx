/**
 * ThemeToggle Component
 *
 * Fail-fast theme toggle:
 * - Theme MUST be one of: agentping | skynet | syslog
 * - Mode MUST be one of: dark | light
 */

import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

type Theme = 'agentping' | 'skynet' | 'syslog';
type ThemeMode = 'light' | 'dark';

export interface ThemeToggleProps {
    defaultTheme?: Theme;
    defaultMode?: ThemeMode;
    onThemeChange?: (theme: Theme) => void;
    onModeChange?: (mode: ThemeMode) => void;
    showLabel?: boolean;
}

const STORAGE_THEME_KEY = 'agentping-theme';
const STORAGE_MODE_KEY = 'agentping-theme-mode';

const THEMES: Theme[] = ['agentping', 'skynet', 'syslog'];
const MODES: ThemeMode[] = ['dark', 'light'];

function assertValidTheme(theme: string | null): asserts theme is Theme {
    if (!theme || !THEMES.includes(theme as Theme)) {
        throw new Error(`Invalid theme "${theme ?? 'null'}". Valid themes: ${THEMES.join(', ')}`);
    }
}

function assertValidMode(mode: string | null): asserts mode is ThemeMode {
    if (!mode || !MODES.includes(mode as ThemeMode)) {
        throw new Error(`Invalid mode "${mode ?? 'null'}". Valid modes: ${MODES.join(', ')}`);
    }
}

function getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_THEME_KEY);
    if (!stored) return 'skynet';
    assertValidTheme(stored);
    return stored;
}

function getInitialMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_MODE_KEY);
    if (!stored) return 'dark';
    assertValidMode(stored);
    return stored;
}

export function ThemeToggle({
    defaultTheme,
    defaultMode,
    onThemeChange,
    onModeChange,
    showLabel = false,
}: ThemeToggleProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme ?? getInitialTheme);
    const [mode, setMode] = useState<ThemeMode>(defaultMode ?? getInitialMode);
    const [mounted, setMounted] = useState(false);

    // Apply theme to document
    useEffect(() => {
        setMounted(true);

        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-mode', mode);
        root.style.colorScheme = mode;
        document.body.setAttribute('data-theme', theme);
        document.body.setAttribute('data-mode', mode);

        localStorage.setItem(STORAGE_THEME_KEY, theme);
        localStorage.setItem(STORAGE_MODE_KEY, mode);
    }, [theme, mode]);

    const cycleTheme = () => {
        const currentIndex = THEMES.indexOf(theme);
        const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
        setTheme(nextTheme);
        onThemeChange?.(nextTheme);
    };

    const toggleDarkLight = () => {
        const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
        setMode(nextMode);
        onModeChange?.(nextMode);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button className="theme-toggle" aria-label="Toggle theme" disabled>
                <span className="theme-toggle-icon">◐</span>
            </button>
        );
    }

    const icon = mode === 'dark' ? '☀️' : '🌙';
    const label = `${theme} / ${mode}`;

    return (
        <button
            className="theme-toggle"
            onClick={toggleDarkLight}
            onDoubleClick={cycleTheme}
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            title={`Current: ${label}. Click to toggle, double-click to cycle.`}
        >
            <span className="theme-toggle-icon" aria-hidden="true">
                {icon}
            </span>
            {showLabel && <span className="theme-toggle-label">{label}</span>}
        </button>
    );
}

/**
 * Hook for accessing and controlling theme
 */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [mode, setMode] = useState<ThemeMode>(getInitialMode);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.setAttribute('data-mode', mode);
        root.style.colorScheme = mode;
        localStorage.setItem(STORAGE_THEME_KEY, theme);
        localStorage.setItem(STORAGE_MODE_KEY, mode);
    }, [theme, mode]);

    return {
        theme,
        mode,
        setTheme,
        setMode,
        isDark: mode === 'dark',
        isLight: mode === 'light',
        toggleMode: () => setMode(mode === 'dark' ? 'light' : 'dark'),
    };
}

export default ThemeToggle;
