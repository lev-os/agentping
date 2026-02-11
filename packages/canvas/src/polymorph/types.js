/**
 * Polymorph Primitive Types
 *
 * Universal component primitives that render to HTML, Pencil (.pen), or React.
 */
export const THEMES = {
    agentping: {
        dark: {
            bg: '#0a0a0f',
            surface: '#12121a',
            border: '#2b2b3a',
            text: '#ffffff',
            muted: '#9ea0b4',
            accent: '#00ffaa',
            warning: '#ffaa00',
            error: '#ff4466',
            success: '#10b981',
            info: '#3b82f6',
            fontFamily: '"Inter", "SF Pro", system-ui, sans-serif',
        },
        light: {
            bg: '#ffffff',
            surface: '#f5f7fb',
            border: '#d5d9e2',
            text: '#101828',
            muted: '#667085',
            accent: '#0ea5e9',
            warning: '#d97706',
            error: '#dc2626',
            success: '#059669',
            info: '#2563eb',
            fontFamily: '"Inter", "SF Pro", system-ui, sans-serif',
        },
    },
    skynet: {
        dark: {
            bg: '#05070f',
            surface: '#0f1422',
            border: '#263247',
            text: '#c9f5ff',
            muted: '#7fa2b1',
            accent: '#00e5ff',
            warning: '#f5b841',
            error: '#ff5f70',
            success: '#36d399',
            info: '#4d9dff',
            fontFamily: '"Rajdhani", "Inter", system-ui, sans-serif',
        },
        light: {
            bg: '#f1fbff',
            surface: '#e4f4ff',
            border: '#b8d8e8',
            text: '#0f172a',
            muted: '#4b6475',
            accent: '#0284c7',
            warning: '#b45309',
            error: '#be123c',
            success: '#0f766e',
            info: '#1d4ed8',
            fontFamily: '"Rajdhani", "Inter", system-ui, sans-serif',
        },
    },
    syslog: {
        dark: {
            bg: '#101217',
            surface: '#171b23',
            border: '#30384a',
            text: '#e6edf3',
            muted: '#9da9ba',
            accent: '#98e8ff',
            warning: '#f8c25c',
            error: '#ff8da1',
            success: '#74d3a7',
            info: '#8ab4f8',
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
        },
        light: {
            bg: '#f6f8fb',
            surface: '#edf1f7',
            border: '#c9d3e3',
            text: '#1b2433',
            muted: '#556178',
            accent: '#0b7fab',
            warning: '#9a5e00',
            error: '#b42318',
            success: '#17663c',
            info: '#1f4ea8',
            fontFamily: '"JetBrains Mono", "SF Mono", monospace',
        },
    },
};
export function getThemeTokens(theme, mode) {
    const variants = THEMES[theme];
    if (!variants) {
        throw new Error(`Unknown theme "${theme}"`);
    }
    const tokens = variants[mode];
    if (!tokens) {
        throw new Error(`Unknown mode "${mode}" for theme "${theme}"`);
    }
    return tokens;
}
