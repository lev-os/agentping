# Component Catalog

Current consolidation baseline for AgentPing + Sofia import readiness.

## Dashboard Surfaces (runner source of truth)

| id | name | target |
|---|---|---|
| `agentping` | AgentPing Storybook | `http://localhost:6006` |
| `sofia` | Sofia Storybook | `http://localhost:6007` |
| `web-ui` | AgentPing Web UI | `http://localhost:5173` |
| `canvas` | AgentPing Canvas | `http://localhost:5174` |
| `dashboard-manager-ui` | Dashboard Manager UI | `http://localhost:5175` |
| `studio` | AgentPing Studio | `http://localhost:5180` |

Legacy dashboard entries (`jarvis`, `flight-deck`, `ceo-stack`, `clawd`) are removed from runner-managed surfaces.

## Component Inventory (2026-02-11 local audit)

### AgentPing

- `packages/adapters/web-ui/src/components`: **281** `.tsx` components total
  - non-Sofia local set: **210** `.tsx` components (`!*/sofia/*`)
  - Sofia-imported set: **71** `.tsx` components (`*/sofia/*`)

- `packages/studio/src/renderer/components`: **54** `.tsx` components (excluding stories)

- `packages/canvas/src/components`: **6** canvas-focused components

- `packages/dashboard-manager-ui/src/components`: **8** `.tsx` components

- Storybook stories:
  - studio: **16**
  - web-ui/Sofia: **1**

### Sofia UI kit (imported into AgentPing)

- `packages/adapters/web-ui/src/components/sofia`: **71** `.tsx` components

- Unique normalized component names in Sofia set: **64**

## Direct Overlap (name-normalized)

- Overlap between AgentPing local web-ui components and Sofia set: **3** normalized names (`badge`, `searchinput`, `textarea`).

- Remaining components in AgentPing local web-ui set are consolidation candidates (merge, wrap, or deprecate).

## Sofia Import Delta

- One-time import baseline is now local-first under `packages/adapters/web-ui/src/components/sofia`.

- Source repo path for external Sofia is not currently mounted in this workspace snapshot, so parity is measured against local normalized overlap + compile/runtime validation.

## Theme Contract (fail-fast)

- Canonical themes: `agentping`, `skynet`, `syslog`

- Canonical modes: `dark`, `light`

- Unknown theme or mode is treated as invalid configuration (fail-fast), not fallback.

## Canonical Verification Commands

```bash
# Kill legacy dashboard/Next servers
pnpm dashboards:kill

# Start consolidated dashboard manager (single control plane)
pnpm dashboards:start

# Dashboard runtime inventory
pnpm dashboards:status

# AgentPing component count
find packages/adapters/web-ui/src/components -type f -name '*.tsx' | wc -l

# Sofia local component count
find packages/adapters/web-ui/src/components/sofia -type f -name '*.tsx' | wc -l

# Full component name lists (sorted)
find packages/adapters/web-ui/src/components -type f -name '*.tsx' -exec basename {} .tsx \\\; | sort
find packages/adapters/web-ui/src/components/sofia -type f -name '*.tsx' -exec basename {} .tsx \\\; | sort
```
