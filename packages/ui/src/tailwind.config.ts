/**
 * SKYNET Theme - Tailwind CSS v4 Preset
 *
 * @kingly/ui Tailwind Configuration
 *
 * Tailwind CSS v4 uses CSS-based configuration via @theme inline blocks.
 * The complete SKYNET design system is defined in `skynet.css` using @theme inline.
 * This config file provides:
 * - A preset that apps can extend
 * - Font family utilities mapped to SKYNET typography
 * - Reference to the CSS-based theme
 *
 * ## Usage in consuming apps:
 *
 * ### Option 1: CSS Import (Recommended for Tailwind v4)
 * In your app's CSS entry point (e.g., globals.css):
 * ```css
 * @import "@kingly/ui/theme/skynet.css";
 * @import "tailwindcss";
 * ```
 *
 * ### Option 2: Extend this config (if additional customization needed)
 * In your app's tailwind.config.ts:
 * ```ts
 * import skynetPreset from "@kingly/ui/tailwind";
 *
 * export default {
 *   presets: [skynetPreset],
 *   // ... your customizations
 * };
 * ```
 *
 * ## Font Utilities
 * The SKYNET theme provides three font families:
 * - `font-display` - Orbitron (futuristic headings)
 * - `font-body` - Rajdhani (clean body text)
 * - `font-mono` - JetBrains Mono (code/data)
 *
 * These are defined in skynet.css @theme inline as:
 * - --font-display: 'Orbitron', sans-serif
 * - --font-body: 'Rajdhani', sans-serif
 * - --font-mono: 'JetBrains Mono', monospace
 *
 * @see src/theme/skynet.css for complete @theme inline configuration
 * @see src/theme/tokens.ts for TypeScript design tokens
 */

import type { Config } from "tailwindcss";

/**
 * SKYNET Tailwind CSS v4 Preset
 *
 * A minimal preset that works with Tailwind v4's CSS-first approach.
 * The @theme inline in skynet.css defines all design tokens.
 */
const skynetPreset = {
  // Tailwind v4 uses CSS-based theming, so theme config is minimal
  // Colors, spacing, etc. are defined in skynet.css @theme inline
  theme: {
    extend: {
      // Font families referencing CSS custom properties
      // These map to --font-display, --font-body, --font-mono in skynet.css
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      // Animation keyframes are defined in skynet.css
      // This provides named access via animate-* classes
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        radar: "radar-sweep 4s linear infinite",
        flicker: "flicker 3s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        "data-stream": "data-stream 2s linear infinite",
        "skeleton-breathe": "skeleton-breathe 4s ease-in-out infinite",
      },
    },
  },
  // No plugins needed - all utilities defined in CSS
  plugins: [],
} satisfies Config;

export default skynetPreset;

/**
 * Type export for consuming apps
 */
export type { Config as TailwindConfig };
