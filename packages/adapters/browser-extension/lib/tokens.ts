/**
 * AgentPing Design Tokens
 *
 * CSS custom properties for consistent styling across notification UIs.
 * Supports light and dark themes with cyber aesthetic.
 */

// ============================================================================
// Color Tokens
// ============================================================================

export interface ColorTokens {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgOverlay: string;

  // Accent Colors
  accent: string;
  accentMuted: string;
  accentGlow: string;

  // Status Colors
  success: string;
  successMuted: string;
  successGlow: string;
  danger: string;
  dangerMuted: string;
  dangerGlow: string;
  warning: string;
  warningMuted: string;

  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Border Colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;
}

export const darkThemeColors: ColorTokens = {
  // Backgrounds
  bgPrimary: '#0a0a0a',
  bgSecondary: '#111111',
  bgTertiary: '#1a1a1a',
  bgOverlay: 'rgba(5, 5, 5, 0.92)',

  // Accent (Cyan)
  accent: '#00e5ff',
  accentMuted: 'rgba(0, 229, 255, 0.15)',
  accentGlow: 'rgba(0, 229, 255, 0.3)',

  // Success (Green)
  success: '#00ff9d',
  successMuted: 'rgba(0, 255, 157, 0.15)',
  successGlow: 'rgba(0, 255, 157, 0.3)',

  // Danger (Magenta)
  danger: '#ff2a6d',
  dangerMuted: 'rgba(255, 42, 109, 0.15)',
  dangerGlow: 'rgba(255, 42, 109, 0.3)',

  // Warning (Amber)
  warning: '#f59e0b',
  warningMuted: 'rgba(245, 158, 11, 0.15)',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textInverse: '#0a0a0a',

  // Borders
  borderPrimary: 'rgba(255, 255, 255, 0.1)',
  borderSecondary: 'rgba(255, 255, 255, 0.06)',
  borderAccent: 'rgba(0, 229, 255, 0.2)',
};

export const lightThemeColors: ColorTokens = {
  // Backgrounds
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f9fa',
  bgTertiary: '#f0f1f3',
  bgOverlay: 'rgba(255, 255, 255, 0.95)',

  // Accent (Cyan - darker for light mode)
  accent: '#0096b4',
  accentMuted: 'rgba(0, 150, 180, 0.1)',
  accentGlow: 'rgba(0, 150, 180, 0.2)',

  // Success (Green - darker for light mode)
  success: '#00b36b',
  successMuted: 'rgba(0, 179, 107, 0.1)',
  successGlow: 'rgba(0, 179, 107, 0.2)',

  // Danger (Magenta - darker for light mode)
  danger: '#d92662',
  dangerMuted: 'rgba(217, 38, 98, 0.1)',
  dangerGlow: 'rgba(217, 38, 98, 0.2)',

  // Warning (Amber)
  warning: '#d97706',
  warningMuted: 'rgba(217, 119, 6, 0.1)',

  // Text
  textPrimary: '#111111',
  textSecondary: '#374151',
  textMuted: 'rgba(0, 0, 0, 0.5)',
  textInverse: '#ffffff',

  // Borders
  borderPrimary: 'rgba(0, 0, 0, 0.1)',
  borderSecondary: 'rgba(0, 0, 0, 0.06)',
  borderAccent: 'rgba(0, 150, 180, 0.3)',
};

// ============================================================================
// Spacing Tokens
// ============================================================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '28px',
  xxxl: '32px',
} as const;

// ============================================================================
// Typography Tokens
// ============================================================================

export const typography = {
  fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
  fontFamilySans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  fontSize: {
    xs: '10px',
    sm: '11px',
    base: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
    xxl: '18px',
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.5px',
    wider: '1px',
    widest: '1.5px',
  },
} as const;

// ============================================================================
// Border Radius Tokens
// ============================================================================

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
} as const;

// ============================================================================
// Shadow Tokens
// ============================================================================

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',

  // Glow shadows (dark mode)
  glowAccent: '0 0 20px rgba(0, 229, 255, 0.2)',
  glowSuccess: '0 0 20px rgba(0, 255, 157, 0.2)',
  glowDanger: '0 0 20px rgba(255, 42, 109, 0.2)',

  // Modal shadow
  modal: '0 0 40px rgba(0, 229, 255, 0.1), 0 0 80px rgba(0, 0, 0, 0.5)',
  modalLight: '0 25px 50px rgba(0, 0, 0, 0.15)',

  // Drawer shadow
  drawer: '-4px 0 20px rgba(0, 0, 0, 0.5)',
  drawerLight: '-4px 0 20px rgba(0, 0, 0, 0.1)',
} as const;

// ============================================================================
// Animation Tokens
// ============================================================================

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ============================================================================
// Z-Index Tokens
// ============================================================================

export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 2147483646,
  modal: 2147483647,
  toast: 2147483645,
} as const;

// ============================================================================
// CSS Custom Properties Generator
// ============================================================================

/**
 * Generate CSS custom properties string for a theme
 */
export function generateCSSVariables(colors: ColorTokens): string {
  return `
    --ap-bg-primary: ${colors.bgPrimary};
    --ap-bg-secondary: ${colors.bgSecondary};
    --ap-bg-tertiary: ${colors.bgTertiary};
    --ap-bg-overlay: ${colors.bgOverlay};

    --ap-accent: ${colors.accent};
    --ap-accent-muted: ${colors.accentMuted};
    --ap-accent-glow: ${colors.accentGlow};

    --ap-success: ${colors.success};
    --ap-success-muted: ${colors.successMuted};
    --ap-success-glow: ${colors.successGlow};

    --ap-danger: ${colors.danger};
    --ap-danger-muted: ${colors.dangerMuted};
    --ap-danger-glow: ${colors.dangerGlow};

    --ap-warning: ${colors.warning};
    --ap-warning-muted: ${colors.warningMuted};

    --ap-text-primary: ${colors.textPrimary};
    --ap-text-secondary: ${colors.textSecondary};
    --ap-text-muted: ${colors.textMuted};
    --ap-text-inverse: ${colors.textInverse};

    --ap-border-primary: ${colors.borderPrimary};
    --ap-border-secondary: ${colors.borderSecondary};
    --ap-border-accent: ${colors.borderAccent};

    --ap-spacing-xs: ${spacing.xs};
    --ap-spacing-sm: ${spacing.sm};
    --ap-spacing-md: ${spacing.md};
    --ap-spacing-lg: ${spacing.lg};
    --ap-spacing-xl: ${spacing.xl};
    --ap-spacing-xxl: ${spacing.xxl};

    --ap-font-mono: ${typography.fontFamily};
    --ap-font-sans: ${typography.fontFamilySans};

    --ap-radius-sm: ${borderRadius.sm};
    --ap-radius-md: ${borderRadius.md};
    --ap-radius-lg: ${borderRadius.lg};
    --ap-radius-xl: ${borderRadius.xl};

    --ap-transition-fast: ${animation.duration.fast};
    --ap-transition-normal: ${animation.duration.normal};
    --ap-transition-slow: ${animation.duration.slow};
    --ap-ease-default: ${animation.easing.default};
    --ap-ease-bounce: ${animation.easing.bounce};
  `;
}

/**
 * Get base styles that use CSS variables
 */
export function getBaseStyles(): string {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      font-family: var(--ap-font-mono);
      font-size: ${typography.fontSize.base};
      line-height: ${typography.lineHeight.normal};
      color: var(--ap-text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `;
}
