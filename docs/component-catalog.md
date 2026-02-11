# Component Catalog

Consolidation inventory for AgentPing, Sofia, and dashboard surfaces.

Scope:

- This file tracks runtime component inventory and ownership.
- GenUI design candidates and theme experiments are documented in `docs/genui/` and are not automatically part of runtime contracts.

## Dashboard Surfaces (Runner Managed)

Source of truth: `packages/dashboard-runner/config/dashboards.yaml`

| id | name | URL | package |
|---|---|---|---|
| `agentping` | AgentPing Storybook | `http://127.0.0.1:6006` | `packages/studio` |
| `sofia` | Sofia Storybook | `http://127.0.0.1:6007` | `packages/ui` |
| `web-ui` | AgentPing Web UI | `http://127.0.0.1:5173` | `packages/adapters/web-ui` |
| `canvas` | AgentPing Canvas | `http://127.0.0.1:5174` | `packages/canvas` |
| `dashboard-manager-ui` | Dashboard Manager UI | `http://127.0.0.1:5175` | `packages/dashboard-manager-ui` |
| `studio` | AgentPing Studio | `http://127.0.0.1:5180` | `packages/studio` |

Legacy entries (`jarvis`, `flight-deck`, `ceo-stack`, `clawd`) are not in the active runner manifest.

## Component Inventory (Local Audit: 2026-02-11)

Counts below exclude `*.stories.*` files.

| Surface | Path | `.tsx` files | Unique normalized names |
|---|---|---:|---:|
| Web UI (all) | `packages/adapters/web-ui/src/components` | 281 | 268 |
| Web UI (Sofia subtree) | `packages/adapters/web-ui/src/components/sofia` | 71 | 64 |
| Shared UI kit | `packages/ui/src/components` | 64 | 64 |
| Studio renderer | `packages/studio/src/renderer/components` | 54 | 54 |
| Canvas app | `packages/canvas/src/components` | 6 | 6 |
| Dashboard manager UI | `packages/dashboard-manager-ui/src/components` | 8 | 8 |

Story file counts:

- `packages/studio`: 16
- `packages/ui`: 17
- `packages/adapters/web-ui`: 1
- `packages/canvas`: 0

## Overlap Snapshot (Normalized Name Match)

- Web UI non-Sofia vs Sofia subtree overlap: **3**
- Sofia subtree vs `packages/ui` overlap: **64** (complete name-level overlap)
- Web UI full set vs `packages/ui` overlap: **64**
- `packages/ui` vs Studio overlap: **5**

Interpretation:

- `packages/ui` mirrors the Sofia name set and is the right canonical target for one-time Sofia consumption.
- Web UI still carries a large non-Sofia local set that must be merged, wrapped, or deprecated.

## Consolidation Rules (Current)

1. Shared component source of truth is `packages/ui`.
2. Adapter-local forks should be temporary wrappers only.
3. Unknown theme/mode is invalid config and must fail fast.
4. Dashboard surface inventory is controlled by runner config, not ad-hoc scripts.

## Domain-Neutralization Requirement (Sofia)

Shared library primitives must be generic and reusable across domains.

- Not allowed in canonical primitive names: domain-bound terms (example: aviation-specific names such as `pilot-*`).
- Required pattern: generic primitive name + domain data via props.
- Example migration:
  - from: `pilot-picker`
  - to: `entity-picker` (or `actor-picker`) + `{ entities, selectedId, onSelect }`

Acceptance check for this rule:

```bash
rg -n \"pilot|flight|aircraft|runway|cockpit\" packages/ui/src/components
```

Expected result for canonical primitives: no domain-bound naming unless explicitly documented as feature-level examples.

## Verification Commands

```bash
# Process hygiene
pnpm dashboards:kill

# Single control plane
pnpm dashboards:start
pnpm dashboards:status

# Detailed surface inventory
curl -s http://127.0.0.1:3030/api/dashboards | jq

# Component counts
find packages/adapters/web-ui/src/components -type f -name '*.tsx' | wc -l
find packages/adapters/web-ui/src/components/sofia -type f -name '*.tsx' | wc -l
find packages/ui/src/components -type f -name '*.tsx' | wc -l
find packages/studio/src/renderer/components -type f -name '*.tsx' | grep -v '\\.stories\\.' | wc -l
```
