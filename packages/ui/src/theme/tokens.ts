/**
 * SKYNET Design Tokens
 *
 * Extracted from Sofia Dashboard's SKYNET theme system.
 * A cyberpunk/military-tactical aesthetic with HSL-based colors.
 *
 * @example
 * ```tsx
 * import { colors, fonts, animations } from "@kingly/ui/theme";
 *
 * const style = {
 *   color: colors.cyber.cyan,
 *   fontFamily: fonts.display,
 * };
 * ```
 */

// =============================================================================
// GOOGLE FONTS URL
// =============================================================================

/**
 * Google Fonts import URL for SKYNET typography
 * Import this in your app's head or CSS entry point
 */
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap";

// =============================================================================
// COLOR SYSTEM - HSL Based
// =============================================================================

/**
 * HSL color values as strings for CSS custom properties
 * Use with hsl() function: `hsl(${colors.hsl.primary})`
 */
export const hsl = {
  // Core palette
  background: "220 20% 4%",
  foreground: "195 100% 95%",

  card: "220 20% 8%",
  cardForeground: "195 100% 95%",

  popover: "220 20% 6%",
  popoverForeground: "195 100% 95%",

  primary: "195 100% 50%",
  primaryForeground: "220 20% 4%",

  secondary: "280 100% 60%",
  secondaryForeground: "195 100% 95%",

  accent: "45 100% 50%",
  accentForeground: "220 20% 4%",

  destructive: "0 85% 55%",
  destructiveForeground: "195 100% 95%",

  muted: "220 15% 15%",
  mutedForeground: "220 10% 55%",

  border: "195 50% 25%",
  input: "220 20% 12%",
  ring: "195 100% 50%",

  // Semantic colors
  success: "150 100% 45%",
  warning: "45 100% 50%",
  info: "195 100% 50%",

  // Cyber accent colors
  cyberCyan: "195 100% 50%",
  cyberPurple: "280 100% 60%",
  cyberYellow: "45 100% 50%",
  cyberRed: "0 85% 55%",
  cyberGreen: "150 100% 45%",
  cyberOrange: "30 100% 50%",
} as const;

/**
 * Resolved HSL colors ready for use in JavaScript/TypeScript
 * These are the actual CSS hsl() values
 */
export const colors = {
  // Core palette
  background: `hsl(${hsl.background})`,
  foreground: `hsl(${hsl.foreground})`,

  card: `hsl(${hsl.card})`,
  cardForeground: `hsl(${hsl.cardForeground})`,

  popover: `hsl(${hsl.popover})`,
  popoverForeground: `hsl(${hsl.popoverForeground})`,

  primary: `hsl(${hsl.primary})`,
  primaryForeground: `hsl(${hsl.primaryForeground})`,

  secondary: `hsl(${hsl.secondary})`,
  secondaryForeground: `hsl(${hsl.secondaryForeground})`,

  accent: `hsl(${hsl.accent})`,
  accentForeground: `hsl(${hsl.accentForeground})`,

  destructive: `hsl(${hsl.destructive})`,
  destructiveForeground: `hsl(${hsl.destructiveForeground})`,

  muted: `hsl(${hsl.muted})`,
  mutedForeground: `hsl(${hsl.mutedForeground})`,

  border: `hsl(${hsl.border})`,
  input: `hsl(${hsl.input})`,
  ring: `hsl(${hsl.ring})`,

  // Semantic
  success: `hsl(${hsl.success})`,
  warning: `hsl(${hsl.warning})`,
  info: `hsl(${hsl.info})`,

  // Cyber accent colors
  cyber: {
    cyan: `hsl(${hsl.cyberCyan})`,
    purple: `hsl(${hsl.cyberPurple})`,
    yellow: `hsl(${hsl.cyberYellow})`,
    red: `hsl(${hsl.cyberRed})`,
    green: `hsl(${hsl.cyberGreen})`,
    orange: `hsl(${hsl.cyberOrange})`,
  },

  // Level performance colors
  level: {
    perfect: `hsl(${hsl.cyberYellow})`,
    excellent: `hsl(${hsl.cyberGreen})`,
    good: `hsl(${hsl.cyberOrange})`,
    poor: `hsl(${hsl.cyberRed})`,
    none: `hsl(${hsl.mutedForeground})`,
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

/**
 * Font family definitions
 * - display: Orbitron - Futuristic display font for headings
 * - body: Rajdhani - Clean sans-serif for body text
 * - mono: JetBrains Mono - Monospace for code and data
 */
export const fonts = {
  display: "'Orbitron', sans-serif",
  body: "'Rajdhani', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

/**
 * Font weight scale
 */
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

/**
 * Typography style presets
 */
export const typography = {
  heading: {
    fontFamily: fonts.display,
    fontWeight: fontWeights.bold,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  body: {
    fontFamily: fonts.body,
  },
  data: {
    fontFamily: fonts.mono,
    fontWeight: fontWeights.semibold,
    letterSpacing: "0.05em",
  },
  label: {
    fontFamily: fonts.body,
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.1em",
    color: colors.mutedForeground,
  },
} as const;

// =============================================================================
// SPACING & SIZING
// =============================================================================

/**
 * Grid system configuration
 */
export const grid = {
  size: "30px",
  sizeNum: 30,
  color: `hsla(195, 100%, 50%, 0.05)`,
} as const;

/**
 * Border radius values (SKYNET uses sharp edges)
 */
export const radius = {
  none: "0px",
  sm: "0px",
  md: "0px",
  lg: "0px",
} as const;

/**
 * Cyber panel cut corner sizes
 */
export const cutCorner = {
  sm: "8px",
  md: "15px",
  lg: "20px",
} as const;

/**
 * Scrollbar dimensions
 */
export const scrollbar = {
  width: "6px",
  height: "6px",
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

/**
 * Animation timing constants
 */
export const animationDurations = {
  scanline: "8s",
  pulseGlow: "2s",
  radarSweep: "4s",
  dataStream: "2s",
  flicker: "3s",
  // Status-specific
  statusActive: "1.5s",
  statusWarning: "2s",
  statusError: "0.5s",
  // UI transitions
  progress: "0.3s",
} as const;

/**
 * Animation easing functions
 */
export const animationEasing = {
  linear: "linear",
  easeInOut: "ease-in-out",
  ease: "ease",
} as const;

/**
 * Complete animation definitions for use in JavaScript
 */
export const animations = {
  scanline: {
    duration: animationDurations.scanline,
    timing: animationEasing.linear,
    iteration: "infinite",
  },
  pulseGlow: {
    duration: animationDurations.pulseGlow,
    timing: animationEasing.easeInOut,
    iteration: "infinite",
  },
  radar: {
    duration: animationDurations.radarSweep,
    timing: animationEasing.linear,
    iteration: "infinite",
  },
  flicker: {
    duration: animationDurations.flicker,
    timing: animationEasing.easeInOut,
    iteration: "infinite",
  },
} as const;

// =============================================================================
// GLOW EFFECTS
// =============================================================================

/**
 * Text shadow glow presets
 */
export const textGlow = {
  sm: "0 0 5px currentColor, 0 0 10px currentColor",
  md: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor",
  cyan: `0 0 10px ${colors.cyber.cyan}, 0 0 20px ${colors.cyber.cyan}, 0 0 40px ${colors.cyber.cyan}`,
  purple: `0 0 10px ${colors.cyber.purple}, 0 0 20px ${colors.cyber.purple}, 0 0 40px ${colors.cyber.purple}`,
  yellow: `0 0 10px ${colors.cyber.yellow}, 0 0 20px ${colors.cyber.yellow}, 0 0 40px ${colors.cyber.yellow}`,
  green: `0 0 10px ${colors.cyber.green}, 0 0 20px ${colors.cyber.green}, 0 0 40px ${colors.cyber.green}`,
  red: `0 0 10px ${colors.cyber.red}, 0 0 20px ${colors.cyber.red}, 0 0 40px ${colors.cyber.red}`,
} as const;

/**
 * Box shadow glow presets
 */
export const borderGlow = {
  default: "0 0 5px currentColor, 0 0 10px currentColor, inset 0 0 5px currentColor",
  cyan: `0 0 5px ${colors.cyber.cyan}, 0 0 10px ${colors.cyber.cyan}, inset 0 0 5px hsl(195 100% 50% / 0.3)`,
  purple: `0 0 5px ${colors.cyber.purple}, 0 0 10px ${colors.cyber.purple}, inset 0 0 5px hsl(280 100% 60% / 0.3)`,
} as const;

// =============================================================================
// GRADIENTS
// =============================================================================

/**
 * Background gradient presets
 */
export const gradients = {
  cyberPanel: `linear-gradient(135deg, ${colors.card} 0%, hsl(220 20% 6%) 100%)`,
  cyberBackground: `linear-gradient(135deg, ${colors.card} 0%, hsl(220 20% 2%) 100%)`,
  progress: `linear-gradient(90deg, ${colors.primary}, ${colors.cyber.cyan})`,
  topGlow: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
  borderMask: `linear-gradient(135deg, ${colors.primary}, transparent, ${colors.secondary})`,
} as const;

// =============================================================================
// CSS CUSTOM PROPERTY NAMES
// =============================================================================

/**
 * CSS custom property names for use in stylesheets
 * These map to the @theme inline variables
 */
export const cssVars = {
  // Colors
  colorBackground: "--color-background",
  colorForeground: "--color-foreground",
  colorCard: "--color-card",
  colorCardForeground: "--color-card-foreground",
  colorPopover: "--color-popover",
  colorPopoverForeground: "--color-popover-foreground",
  colorPrimary: "--color-primary",
  colorPrimaryForeground: "--color-primary-foreground",
  colorSecondary: "--color-secondary",
  colorSecondaryForeground: "--color-secondary-foreground",
  colorAccent: "--color-accent",
  colorAccentForeground: "--color-accent-foreground",
  colorDestructive: "--color-destructive",
  colorDestructiveForeground: "--color-destructive-foreground",
  colorMuted: "--color-muted",
  colorMutedForeground: "--color-muted-foreground",
  colorBorder: "--color-border",
  colorInput: "--color-input",
  colorRing: "--color-ring",
  colorSuccess: "--color-success",
  colorWarning: "--color-warning",
  colorInfo: "--color-info",
  colorCyberCyan: "--color-cyber-cyan",
  colorCyberPurple: "--color-cyber-purple",
  colorCyberYellow: "--color-cyber-yellow",
  colorCyberRed: "--color-cyber-red",
  colorCyberGreen: "--color-cyber-green",
  colorCyberOrange: "--color-cyber-orange",
  // Grid
  gridColor: "--grid-color",
  gridSize: "--grid-size",
  // Misc
  radius: "--radius",
  // Fonts
  fontDisplay: "--font-display",
  fontBody: "--font-body",
  fontMono: "--font-mono",
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type HSLColors = typeof hsl;
export type Colors = typeof colors;
export type Fonts = typeof fonts;
export type FontWeights = typeof fontWeights;
export type Typography = typeof typography;
export type Grid = typeof grid;
export type Radius = typeof radius;
export type CutCorner = typeof cutCorner;
export type AnimationDurations = typeof animationDurations;
export type AnimationEasing = typeof animationEasing;
export type Animations = typeof animations;
export type TextGlow = typeof textGlow;
export type BorderGlow = typeof borderGlow;
export type Gradients = typeof gradients;
export type CSSVars = typeof cssVars;
