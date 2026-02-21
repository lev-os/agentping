import type { Preview } from "@storybook/react-vite";
import { createElement } from "react";
import { create } from "storybook/theming";
import { LoadingStateProvider } from "../src/components/dashboard/LoadingStateProvider";

// Import SKYNET theme + multi-theme system
import "../src/theme/skynet.css";
import "../src/theme/themes.css";

/**
 * SKYNET Color Palette (Hex conversion for Storybook compatibility)
 *
 * Storybook's internal theming uses `polished` library which requires
 * hex/rgb colors, not HSL. These are converted from the HSL values
 * in skynet.css for theme consistency.
 *
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
  barBg: "#0C0F14",
} as const;

/**
 * SKYNET Theme for Storybook Docs
 *
 * Storybook 10 requires themes created with create() from storybook/theming.
 * Raw hex objects cause "PASSED AN INCORRECT ARGUMENT TO A COLOR FUNCTION" errors.
 */
const skynetTheme = create({
  base: "dark",
  brandTitle: "SKYNET Design System",
  brandUrl: "#",
  colorPrimary: SKYNET_COLORS.cyan,
  colorSecondary: SKYNET_COLORS.purple,
  appBg: SKYNET_COLORS.background,
  appContentBg: SKYNET_COLORS.card,
  appBorderColor: SKYNET_COLORS.border,
  textColor: SKYNET_COLORS.text,
  textInverseColor: SKYNET_COLORS.background,
  barTextColor: SKYNET_COLORS.text,
  barSelectedColor: SKYNET_COLORS.cyan,
  barBg: SKYNET_COLORS.barBg,
});

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Switch design theme",
      defaultValue: "sofia",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "agentping", title: "AgentPing" },
          { value: "canvas", title: "Canvas" },
          { value: "sofia", title: "Sofia / SKYNET" },
          { value: "lcars", title: "LCARS" },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      name: "Mode",
      description: "Switch light/dark mode",
      defaultValue: "dark",
      toolbar: {
        icon: "sun",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "theme-bg",
      values: [
        { name: "theme-bg", value: "var(--color-background)" },
        { name: "theme-card", value: "var(--color-card)" },
        { name: "white", value: "#ffffff" },
        { name: "black", value: "#000000" },
      ],
    },
    docs: {
      theme: skynetTheme,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "sofia";
      const mode = context.globals.mode || "dark";

      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-storybook", "true");
        document.body.setAttribute("data-storybook", "true");
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.setAttribute("data-mode", mode);
        document.body.setAttribute("data-theme", theme);
        document.body.setAttribute("data-mode", mode);
      }

      return createElement(LoadingStateProvider, null, Story());
    },
  ],
};

export default preview;
