# Web UI Companion

Companion to `docs/architecture.md`.

Use this file for UI-surface boundary decisions only.
Product definition, end-state goals, and handoff contract live in `docs/architecture.md`.

## Scope

In scope:

- UI package boundaries
- adapter-vs-ui-kit ownership rules
- surface runtime checklist

Out of scope:

- protocol/domain architecture
- cross-repo planning history
- GenUI research synthesis

## Current UI Surface Map

Runner-managed surfaces from `packages/dashboard-runner/config/dashboards.yaml`:

- `agentping` storybook (`packages/studio`, `:6006`)
- `sofia` storybook (`packages/ui`, `:6007`)
- `web-ui` (`packages/adapters/web-ui`, `:5173`)
- `canvas` (`packages/canvas`, `:5174`)
- `dashboard-manager-ui` (`packages/dashboard-manager-ui`, `:5175`)
- `studio` web shell (`packages/studio`, `:5180`)

## Ownership Rules

1. `packages/ui` is the canonical shared component library.
2. `packages/adapters/web-ui` is an adapter shell, not a canonical primitive source.
3. `packages/canvas` owns canvas runtime and mode orchestration.
4. `packages/studio` owns desktop shell concerns, not shared primitive canon.
5. system/operator components can remain local when they are runtime-coupled.

## Adapter Boundary Rules

Adapters in `packages/adapters/*` should own:

- transport/channel integration
- session/auth/channel-specific UX
- adapter wiring to core ports

Adapters should not own:

- long-term reusable component canon
- duplicate primitive libraries

## Short Execution Sequence

1. Consolidate shared components into `packages/ui`.
2. Update Studio/web-ui/canvas shared imports to `packages/ui`.
3. Remove adapter-local primitive ownership from `packages/adapters/web-ui`.
4. Keep only adapter-shell concerns in `web-ui`.
5. Verify surfaces through dashboard runner.

Detailed sequence and acceptance checks:

- `docs/handoff-consolidation.md`
- `docs/open-questions.md`

## Validation Commands

```bash
pnpm dashboards:kill
pnpm dashboards:start
pnpm dashboards:status
curl -s http://127.0.0.1:3030/api/dashboards | jq
```

If this file conflicts with `docs/architecture.md`, follow `docs/architecture.md`.
