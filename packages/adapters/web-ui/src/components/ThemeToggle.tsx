/**
 * ThemeToggle Component
 *
 * Switches between light and dark themes.
 * Persists preference to localStorage and respects system preference.
 */

import React, { useEffect, useState } from 'react';
import './ThemeToggle.css';

type Theme = 'light' | 'dark' | 'system';

export interface ThemeToggleProps {
    defaultTheme?: Theme;
    onThemeChange?: (theme: Theme) => void;
    showLabel?: boolean;
}

const STORAGE_KEY = 'agentping-theme';

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored || 'system';
}

export function ThemeToggle({ defaultTheme, onThemeChange, showLabel = false }: ThemeToggleProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme ?? getInitialTheme);
    const [mounted, setMounted] = useState(false);

    // Apply theme to document
    useEffect(() => {
        setMounted(true);

        const applyTheme = (t: Theme) => {
            const root = document.documentElement;
            const resolvedTheme = t === 'system' ? getSystemTheme() : t;

            root.setAttribute('data-theme', resolvedTheme);
            root.style.colorScheme = resolvedTheme;
        };

        applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const cycleTheme = () => {
        const themes: Theme[] = ['system', 'light', 'dark'];
        const currentIndex = themes.indexOf(theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        setTheme(nextTheme);
        onThemeChange?.(nextTheme);
    };

    const toggleDarkLight = () => {
        const resolvedCurrent = theme === 'system' ? getSystemTheme() : theme;
        const nextTheme = resolvedCurrent === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        onThemeChange?.(nextTheme);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button className="theme-toggle" aria-label="Toggle theme" disabled>
                <span className="theme-toggle-icon">◐</span>
            </button>
        );
    }

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
    const icon = resolvedTheme === 'dark' ? '☀️' : '🌙';
    const label = theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light';

    return (
        <button
            className="theme-toggle"
            onClick={toggleDarkLight}
            onDoubleClick={cycleTheme}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
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

    useEffect(() => {
        const root = document.documentElement;
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

        root.setAttribute('data-theme', resolvedTheme);
        root.style.colorScheme = resolvedTheme;
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

    return {
        theme,
        resolvedTheme,
        setTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
        toggleTheme: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
    };
}

export default ThemeToggle;
