import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
    // Collision modules — separate entries to avoid barrel name clashes
    "components/catalog/audit-log-viewer": "src/components/catalog/audit-log-viewer.tsx",
    "components/catalog/log-stream": "src/components/catalog/log-stream.tsx",
    "components/catalog/quick-actions": "src/components/catalog/quick-actions.tsx",
    "components/catalog/skeleton": "src/components/catalog/skeleton.tsx",
    "components/catalog/status-card": "src/components/catalog/status-card.tsx",
    "components/catalog/candlestick-chart": "src/components/catalog/candlestick-chart.tsx",
    "components/catalog/crud-detail-page": "src/components/catalog/crud-detail-page.tsx",
    "components/catalog/crud-list-page": "src/components/catalog/crud-list-page.tsx",
    "components/catalog/crud-archive-page": "src/components/catalog/crud-archive-page.tsx",
    "components/catalog/crud-context": "src/components/catalog/crud-context.tsx",
    "renderers/lev-now/index": "src/renderers/lev-now/index.ts",
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
