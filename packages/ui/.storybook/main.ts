import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@chromatic-com/storybook"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  viteFinal: async (config) => {
    // Add Tailwind CSS v4 plugin
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());

    // Add path aliases for @kingly/ui/*
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@kingly/ui": join(__dirname, "../src"),
    };
    return config;
  },
};

export default config;