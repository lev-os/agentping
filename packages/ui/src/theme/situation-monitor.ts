/**
 * Situation Monitor Design Tokens
 *
 * Extracted from HipCityReg's Situation Monitor dashboard.
 * A dark, minimal, monospace-first aesthetic for operational dashboards.
 *
 * @see https://hipcityreg.github.io/situation-monitor/
 *
 * Key characteristics:
 * - Pure black background (#0a0a0a)
 * - Monospace typography (SF Mono, Monaco)
 * - Minimal color palette with status indicators
 * - Sharp edges, no border-radius
 * - Subtle borders (#2a2a2a)
 *
 * @example
 * ```tsx
 * import { colors, fonts } from "@kingly/ui/theme/situation-monitor";
 *
 * const style = {
 *   color: colors.text.primary,
 *   background: colors.bg.base,
 *   fontFamily: fonts.mono,
 * };
 * ```
 */

// =============================================================================
// COLOR SYSTEM - Situation Monitor Palette
// =============================================================================

/**
 * HSL color values as strings for CSS custom properties
 */
export const hsl = {
  // Backgrounds
  bgBase: "0 0% 4%", // #0a0a0a
  bgSurface: "0 0% 8%", // #141414
  bgElevated: "0 0% 6%", // #0f0f0f

  // Borders
  border: "0 0% 16%", // #2a2a2a
  borderSubtle: "0 0% 12%", // #1e1e1e

  // Text
  textPrimary: "0 0% 91%", // #e8e8e8
  textDim: "0 0% 53%", // #888888
  textAccent: "0 0% 100%", // #ffffff

  // Status colors
  statusRed: "0 100% 63%", // #ff4444
  statusGreen: "147 100% 63%", // #44ff88
  statusYellow: "40 100% 50%", // #ffaa00
  statusBlue: "210 100% 63%", // #44aaff

  // Map-specific (situation room style)
  mapGreen: "147 100% 53%", // #00ff88
  mapCyan: "180 100% 50%", // #00ffff
  mapGold: "51 100% 50%", // #ffcc00
} as const;

/**
 * Resolved colors ready for JavaScript/TypeScript
 */
export const colors = {
  // Backgrounds
  bg: {
    base: `hsl(${hsl.bgBase})`, // #0a0a0a
    surface: `hsl(${hsl.bgSurface})`, // #141414
    elevated: `hsl(${hsl.bgElevated})`, // #0f0f0f
  },

  // Borders
  border: {
    default: `hsl(${hsl.border})`, // #2a2a2a
    subtle: `hsl(${hsl.borderSubtle})`, // #1e1e1e
  },

  // Text
  text: {
    primary: `hsl(${hsl.textPrimary})`, // #e8e8e8
    dim: `hsl(${hsl.textDim})`, // #888888
    accent: `hsl(${hsl.textAccent})`, // #ffffff
  },

  // Status indicators
  status: {
    red: `hsl(${hsl.statusRed})`, // #ff4444
    green: `hsl(${hsl.statusGreen})`, // #44ff88
    yellow: `hsl(${hsl.statusYellow})`, // #ffaa00
    blue: `hsl(${hsl.statusBlue})`, // #44aaff
  },

  // Map/Globe colors (situation room)
  map: {
    green: `hsl(${hsl.mapGreen})`, // #00ff88
    cyan: `hsl(${hsl.mapCyan})`, // #00ffff
    gold: `hsl(${hsl.mapGold})`, // #ffcc00
  },

  // Heatmap gradients
  heatmap: {
    up3: "#0d5a2d",
    up2: "#157a3c",
    up1: "#1d9a4b",
    up0: "#2a4a35",
    down0: "#4a2a2a",
    down1: "#8a3a3a",
    down2: "#aa3333",
    down3: "#cc2222",
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Font family definitions - Situation Monitor uses monospace-first
 */
export const fonts = {
  mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
} as const;

/**
 * Font sizes - compact, information-dense
 */
export const fontSizes = {
  xs: "0.5rem", // 8px - tiny labels
  sm: "0.55rem", // 8.8px - timestamps
  base: "0.65rem", // 10.4px - panel titles
  md: "0.7rem", // 11.2px - market data
  lg: "0.75rem", // 12px - item titles
  xl: "0.8rem", // 12.8px - headers
} as const;

/**
 * Typography style presets
 */
export const typography = {
  panelTitle: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.base,
    fontWeight: "bold",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: colors.text.dim,
  },
  itemTitle: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.lg,
    fontWeight: "normal",
    color: colors.text.primary,
  },
  itemSource: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: colors.text.dim,
  },
  timestamp: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    color: colors.text.dim,
  },
  button: {
    fontFamily: fonts.mono,
    fontSize: fontSizes.md,
    fontWeight: "bold",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
} as const;

// =============================================================================
// SPACING & SIZING
// =============================================================================

/**
 * Spacing scale - compact for information density
 */
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.4rem", // 6.4px
  md: "0.5rem", // 8px
  lg: "0.6rem", // 9.6px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
} as const;

/**
 * Panel padding presets
 */
export const padding = {
  panel: "0.75rem 1rem",
  item: "0.6rem 1rem",
  button: "0.4rem 1.2rem",
} as const;

/**
 * Border radius - Situation Monitor uses sharp edges
 */
export const radius = {
  none: "0px",
  sm: "2px", // subtle rounding for heatmap cells
} as const;

// =============================================================================
// GRID & LAYOUT
// =============================================================================

/**
 * Dashboard grid configuration
 */
export const grid = {
  columns: 4,
  gap: "1px",
  minPanelHeight: "300px",
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

/**
 * Animation presets
 */
export const animations = {
  pulse: {
    duration: "2s",
    timing: "ease-out",
    iteration: "infinite",
  },
  glow: {
    duration: "1.5s",
    timing: "ease-in-out",
    iteration: "infinite",
  },
  shine: {
    duration: "3s",
    timing: "ease-in-out",
    iteration: "infinite",
  },
} as const;

// =============================================================================
// EFFECTS
// =============================================================================

/**
 * Glow effects for map elements
 */
export const glow = {
  green: `0 0 10px ${colors.map.green}, 0 0 20px rgba(0,255,136,0.3)`,
  cyan: `0 0 10px ${colors.map.cyan}, 0 0 20px rgba(0,255,255,0.3)`,
  gold: `0 0 10px ${colors.map.gold}, 0 0 20px rgba(255,204,0,0.3)`,
  red: `0 0 15px ${colors.status.red}, 0 0 30px rgba(255,51,51,0.4)`,
} as const;

// =============================================================================
// CSS CUSTOM PROPERTY NAMES
// =============================================================================

/**
 * CSS custom property names for use in stylesheets
 */
export const cssVars = {
  // Backgrounds
  colorBg: "--sm-bg",
  colorBgSurface: "--sm-bg-surface",
  colorBgElevated: "--sm-bg-elevated",

  // Borders
  colorBorder: "--sm-border",
  colorBorderSubtle: "--sm-border-subtle",

  // Text
  colorText: "--sm-text",
  colorTextDim: "--sm-text-dim",
  colorTextAccent: "--sm-text-accent",

  // Status
  colorStatusRed: "--sm-status-red",
  colorStatusGreen: "--sm-status-green",
  colorStatusYellow: "--sm-status-yellow",
  colorStatusBlue: "--sm-status-blue",

  // Map
  colorMapGreen: "--sm-map-green",
  colorMapCyan: "--sm-map-cyan",
  colorMapGold: "--sm-map-gold",

  // Fonts
  fontMono: "--sm-font-mono",
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type HSLColors = typeof hsl;
export type Colors = typeof colors;
export type Fonts = typeof fonts;
export type FontSizes = typeof fontSizes;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Padding = typeof padding;
export type Radius = typeof radius;
export type Grid = typeof grid;
export type Animations = typeof animations;
export type Glow = typeof glow;
export type CSSVars = typeof cssVars;
