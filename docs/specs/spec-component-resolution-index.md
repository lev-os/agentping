# Spec: Component Resolution Index

## Purpose

Define the canonical resolution path for the AgentPing component estate during the `LevUI IR` consolidation.

This spec is not a full inventory dump. It answers:

1. what the canonical source component or recipe is
2. whether it belongs to the provider palette, host layer, or translator lane

## Current Problem

Component resolution currently exists in multiple places:

- component inventory docs
- manual registries
- hardcoded canvas/widget switchboards
- provider-specific catalogs

The estate is also much larger than a small primitive-only story. Current documented inventory in `docs/component-catalog.md` shows:

- `packages/adapters/web-ui/src/components`: 281 `.tsx` files, 268 unique normalized names
- `packages/ui/src/components`: 64 `.tsx` files, 64 unique normalized names
- `packages/studio/src/renderer/components`: 54 `.tsx` files, 54 unique normalized names
- `packages/dashboard-manager-ui/src/components`: 8 `.tsx` files
- `packages/canvas/src/components`: 6 `.tsx` files

Overlap matters:

- `packages/ui` overlaps the Sofia subtree completely at the name level
- the full web-ui set still contains 204 non-`packages/ui` names after removing the shared 64-name overlap
- studio overlaps `packages/ui` only lightly and is therefore mostly host-shell material, not provider palette material

## Canonical Rule

There must be one canonical resolution index per active provider path.

For the current slice:

- `packages/ui` is the canonical shared component estate
- the active provider direction resolves through a provider catalog/registry path
- ad-hoc switch statements and host-local forks are transitional only

## Source Ownership

### Canonical Shared Estate

`packages/ui` is the source of truth for reusable shared UI.

This includes:

- generic controls under `packages/ui/src/components/migrations/*`
- reusable dashboard-facing building blocks under `packages/ui/src/components/dashboard/*`
- shared exports from `packages/ui/src/components/index.ts`

This does not mean every file currently living in `packages/ui` is already a clean canonical primitive. The shared estate still contains migration shims and composed surfaces that must be classified explicitly.

### Host-Owned Surfaces

These are not canonical provider palette sources:

- `packages/dashboard-manager-ui/src/components/*`
- `packages/studio/src/renderer/components/*`
- shell chrome, navigator, terminal, voice console, diagnostics, and operator panels

### Translator And Legacy Paths

These remain useful inputs but not long-term sources of truth:

- `packages/adapters/web-ui/src/components/canvas/*`
- legacy `sofia-widget` payload contracts
- adapter-local wrappers that exist only to preserve old runtime behavior

## Classification Contract

Every active component or recipe must be classified into one of five buckets.

### 1. Provider Primitive

Definition:

- generic
- reusable across multiple surfaces
- portable across providers
- suitable for direct registry/catalog entries

Current examples from `packages/ui`:

- `button-canonical`
- `card`
- `checkbox`
- `dropdown`
- `dialog`
- `search-input`
- `badge-canonical`
- `progress` / `circular-progress`
- `tabs`
- `tooltip`
- `input` / `textarea`

Rule:

- provider primitives come from `packages/ui`
- they should be modeled as stable provider entries, not redefined per host

### 2. Composite Recipe

Definition:

- built from primitives
- reusable as a surface pattern
- should usually compile down into primitive trees plus recipe metadata

Current examples:

- `packages/ui/src/components/dashboard/DashboardWidget.tsx`
- `packages/ui/src/components/dashboard/ResponsiveDashboard.tsx`
- `packages/ui/src/components/dashboard/GraphView.tsx`
- `packages/ui/src/components/dashboard/SpecPanel.tsx`
- `packages/ui/src/components/dashboard/DocCard.tsx`
- CRUD flows under `packages/ui/src/components/migrations/crud-*`
- diff/review surfaces such as `code-diff-viewer-conflict`

Rule:

- composites are allowed in provider-facing catalogs only when the pattern is stable and reused
- otherwise they should compile from recipe metadata into primitives

### 3. Host-Only Widget

Definition:

- coupled to a specific runtime host, operator flow, or shell surface
- not portable enough to be treated as abstract provider palette

Current examples:

- `packages/dashboard-manager-ui/src/components/DashboardList.tsx`
- `packages/dashboard-manager-ui/src/components/DashboardDetail.tsx`
- `packages/studio/src/renderer/components/Navigator.tsx`
- `packages/studio/src/renderer/components/VoiceConsole.tsx`
- `packages/studio/src/renderer/components/Terminal.tsx`
- `packages/studio/src/renderer/components/Toolbar.tsx`
- approval/review queue shells and operator diagnostics

Rule:

- host-only widgets stay owned by the host/runtime
- they may mount provider-rendered subtrees, but they do not enter the abstract provider palette directly

### 4. Translator / Legacy Path

Definition:

- compatibility path for old payloads, local forks, or temporary wrappers

Current examples:

- `packages/adapters/web-ui/src/components/canvas/CanvasRenderer.tsx`
- `packages/adapters/web-ui/src/components/canvas/envelope.ts`
- legacy `canvas_interaction` payloads with `componentType: "sofia-widget"`
- adapter-local wrappers around old web-ui components not yet classified into `packages/ui`

Rule:

- translators preserve runtime continuity
- translators must point toward a canonical provider or host target
- translators may not become permanent alternate resolution indexes

### 5. Page / Story Scenario

Definition:

- composed demonstration or workflow surfaces used for Storybook review, scenario testing, or migration comparison
- useful as reference material, but not canonical provider entries

Current examples:

- `packages/ui/src/stories/*`
- full-surface showcase compositions mounted only for Storybook or migration review

Rule:

- story scenarios are review surfaces, not component palette items
- they may reference primitives, composites, host widgets, and translators together
- they must not be mistaken for canonical provider registry entries

## Resolution Index Decision

For this consolidation batch, the resolution index must answer:

1. what the canonical source path is
2. which of the five buckets it belongs to
3. whether the current provider path may register it directly

Anything outside those questions is inventory, not runtime contract.

## Reference Surface

Use the `@kingly/ui` Storybook surface from `packages/ui` as the visual reference surface for shared components.

Use `docs/component-catalog.md` as the seed inventory evidence file, not as a claim that the estate is already fully normalized.

Within Storybook, distinguish between:

- canonical shared components
- migration shims
- composed story scenarios

Use runtime browser surfaces only to validate host-owned widgets, not to define the provider palette.

## Immediate Consolidation Rules

For the current slice:

- direct provider work should start from `packages/ui`
- web-ui local components should be classified before any new provider entries are added
- host-only widgets should remain in host packages until they are proven generic
- legacy canvas and Sofia payload paths should remain explicit translators
- no new long-term source of truth may be created outside `packages/ui` plus the active provider catalog

## Acceptance For `lev-eft`

`lev-eft` is complete when:

- the shared estate, host estate, and translator estate are explicitly separated
- `packages/ui` is locked as the canonical shared source
- the classification buckets above are the required decision frame for future consolidation work
