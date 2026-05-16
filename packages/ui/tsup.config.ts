import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
    // Collision modules — separate entries to avoid barrel name clashes
    "components/migrations/audit-log-viewer": "src/components/migrations/audit-log-viewer.tsx",
    "components/migrations/log-stream": "src/components/migrations/log-stream.tsx",
    "components/migrations/quick-actions": "src/components/migrations/quick-actions.tsx",
    "components/migrations/skeleton": "src/components/migrations/skeleton.tsx",
    "components/migrations/status-card": "src/components/migrations/status-card.tsx",
    "components/migrations/candlestick-chart": "src/components/migrations/candlestick-chart.tsx",
    "components/migrations/crud-detail-page": "src/components/migrations/crud-detail-page.tsx",
    "components/migrations/crud-list-page": "src/components/migrations/crud-list-page.tsx",
    "components/migrations/crud-archive-page": "src/components/migrations/crud-archive-page.tsx",
    "components/migrations/crud-context": "src/components/migrations/crud-context.tsx",
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
