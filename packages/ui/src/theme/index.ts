/**
 * @kingly/ui - Theme
 *
 * SKYNET Design System Theme Configuration
 *
 * This module exports:
 * - Color tokens (HSL-based cyber palette)
 * - Typography (Orbitron, Rajdhani, JetBrains Mono)
 * - Spacing/sizing (grid, border radius)
 * - Animation presets (glow, scanline, radar)
 * - Glow effects (text-glow, border-glow)
 * - Gradient definitions
 *
 * @example
 * ```tsx
 * import { colors, fonts, animations, textGlow } from "@kingly/ui/theme";
 *
 * const style = {
 *   color: colors.cyber.cyan,
 *   fontFamily: fonts.display,
 *   textShadow: textGlow.cyan,
 * };
 * ```
 *
 * For CSS styles, import skynet.css in your app's entry point:
 * ```css
 * @import "@kingly/ui/theme/skynet.css";
 * ```
 */

// Re-export all design tokens
export {
  // Google Fonts URL
  GOOGLE_FONTS_URL,
  // Color system
  hsl,
  colors,
  // Typography
  fonts,
  fontWeights,
  typography,
  // Spacing & sizing
  grid,
  radius,
  cutCorner,
  scrollbar,
  // Animations
  animationDurations,
  animationEasing,
  animations,
  // Effects
  textGlow,
  borderGlow,
  gradients,
  // CSS variable names
  cssVars,
} from "./tokens";

// Re-export types
export type {
  HSLColors,
  Colors,
  Fonts,
  FontWeights,
  Typography,
  Grid,
  Radius,
  CutCorner,
  AnimationDurations,
  AnimationEasing,
  Animations,
  TextGlow,
  BorderGlow,
  Gradients,
  CSSVars,
} from "./tokens";

export * as situationMonitor from "./situation-monitor";
