/**
 * Polymorph Primitive Types
 *
 * Universal component primitives that render to HTML, Pencil (.pen), or React.
 */

export type PrimitiveKind =
  | 'status-dot'
  | 'badge'
  | 'button'
  | 'text-block'
  | 'input-field'
  | 'progress-bar'
  | 'check-item'
  | 'metric-value'
  | 'list-item'
  | 'card'
  | 'nav-item'
  | 'action-bar';

export interface PolymorphPrimitive {
  kind: PrimitiveKind;
  id: string;
  label?: string;
  props: Record<string, unknown>;
  children?: PolymorphPrimitive[];
}

export type ThemeName = 'terminal-swiss' | 'skynet' | 'system';
export type TemplateName = 'design' | 'data' | 'concept' | 'critique';

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

export const THEMES: Record<ThemeName, ThemeTokens> = {
  'terminal-swiss': {
    bg: '#0a0a0a',
    surface: '#111111',
    border: '#333333',
    text: '#e0e0e0',
    muted: '#888888',
    accent: '#00ff88',
    warning: '#ffaa00',
    error: '#ff4444',
    success: '#00ff88',
    info: '#4488ff',
    fontFamily: '"SF Mono", "Fira Code", monospace',
  },
  skynet: {
    bg: '#0d1117',
    surface: '#161b22',
    border: '#30363d',
    text: '#c9d1d9',
    muted: '#8b949e',
    accent: '#58a6ff',
    warning: '#d29922',
    error: '#f85149',
    success: '#3fb950',
    info: '#58a6ff',
    fontFamily: '"Inter", "SF Pro", system-ui, sans-serif',
  },
  system: {
    bg: '#ffffff',
    surface: '#f6f8fa',
    border: '#d0d7de',
    text: '#1f2328',
    muted: '#656d76',
    accent: '#0969da',
    warning: '#9a6700',
    error: '#cf222e',
    success: '#1a7f37',
    info: '#0969da',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
};

export interface RenderOptions {
  template: TemplateName;
  topic: string;
  mode: 'html' | 'pencil' | 'react';
  theme: ThemeName;
}

export interface Template {
  name: TemplateName;
  description: string;
  previewRenderer: (values: Record<string, unknown>) => PolymorphPrimitive[];
}
