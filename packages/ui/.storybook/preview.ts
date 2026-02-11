import type { Preview } from "@storybook/react-vite";
import { create } from "storybook/theming";

// Import SKYNET theme
import "../src/theme/skynet.css";

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
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "skynet-dark",
      values: [
        {
          name: "skynet-dark",
          value: SKYNET_COLORS.background,
        },
        {
          name: "skynet-card",
          value: SKYNET_COLORS.card,
        },
      ],
    },
    docs: {
      theme: skynetTheme,
    },
  },
  tags: ["autodocs"],
};

export default preview;