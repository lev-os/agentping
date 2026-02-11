# Handoff: UI Consolidation And Adapter Boundaries

This is the handoff execution doc for consolidating AgentPing UI architecture.

## Goal

Build a single canonical component library and a clean adapter layer:

- `packages/ui` owns reusable primitives and themes
- `packages/adapters/*` owns transport/channel integration
- UI surfaces consume shared primitives instead of defining their own component canon

## Current Source Folders (What Exists)

These are the primary component sources currently in play:

- `packages/adapters/web-ui/src/components` (281 `.tsx`; includes Sofia subtree)
- `packages/studio/src/renderer/components` (54 non-story `.tsx`)
- `packages/canvas/src/components` (6 `.tsx`)
- `packages/dashboard-manager-ui/src/components` (8 `.tsx`)
- `packages/ui/src/components` (64 `.tsx`; target canonical kit)

## Target Folder (Where Reusable Components Must Live)

Canonical target:

- `packages/ui/src/components`

Optional structure inside `packages/ui/src`:

- `components/` for primitives and shared widgets
- `theme/` for tokens, theme registration, and fail-fast validation
- `lib/` for framework-agnostic helpers

## System-Level Components (Do Not Migrate To Shared UI Kit)

Keep these in app/surface packages unless generalized later:

- dashboard process controls and operator internals
- Studio shell/navigation/workspace orchestration views
- adapter-specific transport UX wiring (history, queue, notifications, channel auth)
- canvas mode controllers or tooling that depend on app runtime context

Rule:

- if a component is tightly coupled to process/runtime control or channel transport behavior, keep it local
- if it is reusable across surfaces, move it to `packages/ui`

## Adapter Model (What `packages/adapters` Is For)

`packages/adapters` should contain integration adapters, not canonical UI component ownership.

Intended adapter responsibilities:

- protocol transport adapters: `http-api`, `mcp`, `webhook`, `slack`, `browser-extension`
- persistence adapter: `storage-sqlite`
- shell adapter logic for `web-ui` (route/auth/session/transport hooks)

Not intended:

- primary home for reusable component libraries
- long-term source of truth for design primitives

## Order Of Operations (Execution Sequence)

1. Consolidate Studio first.
- Classify `packages/studio/src/renderer/components` into:
  - shared candidate
  - studio-shell only
- Move shared candidates into `packages/ui/src/components`.
- Update Studio imports to consume from `packages/ui`.

2. Normalize themes in shared UI kit.
- Keep explicit registered themes only.
- Enforce fail-fast theme/mode selection (`agentping`, `skynet`, `syslog` + `light|dark` unless expanded by explicit registration).

3. Migrate web-ui adapter components out.
- Move reusable components from `packages/adapters/web-ui/src/components` into `packages/ui/src/components`.
- Replace adapter-local component usage with imports from `packages/ui`.
- Keep only adapter-shell/channel UX in web-ui package.

4. Consolidate canvas rendering surface.
- Ensure canvas uses shared primitives/contracts from `packages/ui` where applicable.
- Keep canvas-specific mode/runtime controllers local.

5. Cleanup and lock boundaries.
- Remove duplicate/forked component implementations after import updates.
- Document remaining local-only components and why they are local.

## End-State Deliverable

Primary deliverable:

- one canonical UI kit storybook with all reusable components and themes

Required conditions:

- web-ui adapter package has no canonical component ownership
- reusable components are sourced from `packages/ui`
- system-level surface internals remain local by explicit decision

## Acceptance Checks

```bash
# Shared component canon exists
find packages/ui/src/components -type f -name '*.tsx' | wc -l

# Adapter component canon is reduced to adapter-shell-only use
find packages/adapters/web-ui/src/components -type f -name '*.tsx' | wc -l

# Surface inventories still run
pnpm dashboards:kill
pnpm dashboards:start
pnpm dashboards:status
```

Interpretation target:

- `packages/ui` increases as shared components consolidate
- `packages/adapters/web-ui/src/components` decreases to adapter-local shell components only
