import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

/**
 * SKYNET Manager Theme
 *
 * Themes the Storybook manager UI (sidebar, toolbar, tabs) with
 * the SKYNET aesthetic. Uses the same color palette as preview.ts.
 *
 * Color conversions from HSL (skynet.css) to hex:
 * Primary Cyan:    hsl(195, 100%, 50%) → #00BFFF
 * Secondary Purple: hsl(280, 100%, 60%) → #CC33FF
 * Background:      hsl(220, 20%, 4%)   → #080A0D
 * Card:            hsl(220, 20%, 8%)   → #10131A
 * Border:          hsl(195, 50%, 25%)  → #205F60
 * Text:            hsl(195, 100%, 95%) → #E5FAFF
 * Bar BG:          hsl(220, 20%, 6%)   → #0C0F14
 */
const SKYNET_COLORS = {
  cyan: "#00BFFF",
  purple: "#CC33FF",
  background: "#080A0D",
  card: "#10131A",
  border: "#205F60",
  text: "#E5FAFF",
  textMuted: "#8BA4A8",
  barBg: "#0C0F14",
} as const;

const skynetTheme = create({
  base: "dark",

  // Branding
  brandTitle: "SKYNET Design System",
  brandUrl: "#",
  brandTarget: "_self",

  // Colors
  colorPrimary: SKYNET_COLORS.cyan,
  colorSecondary: SKYNET_COLORS.purple,

  // UI backgrounds
  appBg: SKYNET_COLORS.background,
  appContentBg: SKYNET_COLORS.card,
  appPreviewBg: SKYNET_COLORS.background,
  appBorderColor: SKYNET_COLORS.border,
  appBorderRadius: 0,

  // Typography
  fontBase: '"Rajdhani", "Inter", system-ui, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',

  // Text colors
  textColor: SKYNET_COLORS.text,
  textInverseColor: SKYNET_COLORS.background,
  textMutedColor: SKYNET_COLORS.textMuted,

  // Toolbar/bar colors
  barTextColor: SKYNET_COLORS.text,
  barSelectedColor: SKYNET_COLORS.cyan,
  barHoverColor: SKYNET_COLORS.purple,
  barBg: SKYNET_COLORS.barBg,

  // Form/input colors
  inputBg: SKYNET_COLORS.card,
  inputBorder: SKYNET_COLORS.border,
  inputTextColor: SKYNET_COLORS.text,
  inputBorderRadius: 0,
});

addons.setConfig({
  theme: skynetTheme,
});
