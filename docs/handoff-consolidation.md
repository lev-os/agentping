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

## Critical Known Gap (Read Before Implementation)

Current canvas payload naming uses Sofia as a strict envelope, but render ownership is not fully migrated:

- Payloads are validated as `componentType: "sofia-widget"` with `props.provider: "sofia"`.
- Canvas rendering still resolves through local app widgets for kanban/todo/markdown and generic fallback payload views.
- This is not equivalent to full Sofia UI-kit consumption.

Implementation implication:

- Do not treat the Sofia envelope as completed UI unification.
- Unification is complete only when shared widget render paths are sourced from `packages/ui` and adapter/surface-local duplicates are removed.

## Canvas + Playground Merge Rule

Treat current canvas and playground efforts as one convergence stream:

- keep one canonical canvas runtime in `packages/canvas`
- keep experimentation in isolated modules until promoted
- promote only typed, reusable primitives into `packages/ui`
- do not create a second long-lived canvas runtime under adapter packages

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

## Pilot Migration Snapshot (Analysis-Only, No Normalization Yet)

Two raw migration candidates were pulled into `packages/ui` to establish real comparison baselines:

- From Studio Storybook:
  - Source: `packages/studio/src/renderer/components/ui/StatusGrid.tsx`
  - Candidate now in UI kit: `packages/ui/src/components/migrations/status-grid.tsx`
  - Story: `packages/ui/src/stories/migrations/StatusGrid.migrated.stories.tsx`

- From Web-UI gallery:
  - Source: `packages/adapters/web-ui/src/components/visuals/HolographicCard.tsx`
  - Candidate now in UI kit: `packages/ui/src/components/migrations/holographic-card.tsx`
  - Story: `packages/ui/src/stories/migrations/HolographicCard.migrated.stories.tsx`

Observed style/code pattern deltas (to normalize later, not now):

1. Styling model mismatch
- Studio/Web-UI candidates use component-scoped CSS files and hardcoded values.
- Canonical UI kit mostly uses tokenized utility composition (`cn`, variant systems, theme vars).

2. Token adoption inconsistency
- Candidates mix fallback CSS literals (`#000`, `#333`, `Courier New`) with partial token usage.
- Canonical target requires theme-token-first styling with explicit mode behavior.

3. API shape inconsistency
- Legacy candidates expose ad-hoc props and status enums without shared interfaces.
- Canonical target should align common status/value/event contracts across surfaces.

4. Interaction state contracts
- Candidate components use local hover/animation behavior not standardized with kit motion patterns.
- Consolidation should define animation and interaction primitives centrally.

5. Story coverage model
- Raw candidates are now visible in canonical Storybook, but still tagged as migration candidates.
- Final phase should re-home accepted components under canonical sections and remove raw migration namespace.

## Migration Process (Batch, Trackable)

Use this exact loop for each batch of components:

1. Select batch candidates from Studio stories + web-ui gallery sections.
2. Decide migration mode per component:
   - `copy`: direct copy when dependency surface is small and styling is isolated
   - `reimplement`: safer rebuild using UI-kit patterns (`cva`, `cn`, tokenized theme vars)
   - `hybrid`: copy structure first, then refactor styling/API to canonical patterns
3. Add/Update component in `packages/ui`.
4. Add migration Storybook story under `packages/ui/src/stories/migrations`.
5. Update `docs/progress.txt` with statuses.
6. Run visual checks:
   - agent visual QA (automated browser run)
   - human QA
7. Swap imports in target surfaces only after QA pass.
8. Mark `swapped=pass` only when target app renders correctly after import switch.

### CP vs Reimplement Decision

Use `hybrid` as default.

- Prefer `copy` for self-contained visual components with minimal runtime coupling.
- Prefer `reimplement` for components that:
  - depend on app runtime APIs
  - rely heavily on hardcoded colors/layout values
  - have weak accessibility contracts
- Prefer `hybrid` when visual behavior is good but API/style model needs canonicalization.

### Status Contract (progress.txt)

Each row tracks one source component and follows this lifecycle:

- `migrated`: `pass|fail|pending`
- `agent_visual_qa`: `pass|fail|pending`
- `human_qa`: `pass|fail|pending`
- `swapped`: `pass|fail|pending`

Rule:

- A row with non-empty `migrated_path` is considered migrated-in-progress/completed.
- `swapped=pass` is the final gate for that component.

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
