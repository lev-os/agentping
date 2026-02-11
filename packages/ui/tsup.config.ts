import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
    "theme/index": "src/theme/index.ts",
    "lib/index": "src/lib/index.ts",
    "tailwind.config": "src/tailwind.config.ts",
  },
  format: ["esm"],
  dts: true,
  splitting: true,
  treeshake: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss"],
});
