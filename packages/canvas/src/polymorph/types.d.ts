/**
 * Polymorph Primitive Types
 *
 * Universal component primitives that render to HTML, Pencil (.pen), or React.
 */
export type PrimitiveKind = 'status-dot' | 'badge' | 'button' | 'text-block' | 'input-field' | 'progress-bar' | 'check-item' | 'metric-value' | 'list-item' | 'card' | 'nav-item' | 'action-bar';
export interface PolymorphPrimitive {
    kind: PrimitiveKind;
    id: string;
    label?: string;
    props: Record<string, unknown>;
    children?: PolymorphPrimitive[];
}
export type ThemeName = 'agentping' | 'skynet' | 'syslog';
export type ThemeMode = 'dark' | 'light';
export type TemplateName = 'design' | 'data' | 'concept' | 'critique' | 'docs';
export interface ThemeTokens {
    bg: string;
    surface: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    warning: string;
    error: string;
    success: string;
    info: string;
    fontFamily: string;
}
export interface ThemeVariants {
    dark: ThemeTokens;
    light: ThemeTokens;
}
export declare const THEMES: Record<ThemeName, ThemeVariants>;
export declare function getThemeTokens(theme: ThemeName, mode: ThemeMode): ThemeTokens;
export interface RenderOptions {
    template: TemplateName;
    topic: string;
    mode: 'html' | 'pencil' | 'react';
    theme: ThemeName;
    themeMode: ThemeMode;
}
export interface Template {
    name: TemplateName;
    description: string;
    previewRenderer: (values: Record<string, unknown>) => PolymorphPrimitive[];
}
