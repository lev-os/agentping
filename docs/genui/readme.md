# AgentPing GenUI: Research & Design Specs

> Status: Research/Input
> Runtime Contract: `docs/architecture.md`
> This document is design/research guidance, not runtime source-of-truth.

> Canonical design specifications for AgentPing's Generative UI upgrade.
> Sprint date: 2026-02-10

## Key Finding

**Spec-based rendering > code generation.** The Thesys C1 reverse-engineering sprint confirmed that high-quality GenUI comes from structured specs (feature inventories, theme tokens, layout primitives) fed to deterministic renderers -- not from LLMs generating raw component code.

## Quick Nav

| Section | Description | Files |
|---------|-------------|-------|
| [research/](research/) | Thesys C1 architecture, gap analysis, rendering pipeline, quality patterns | 5 docs + 10 screenshots |
| [implementation/](implementation/) | Build plan and polymorph migration strategy | 2 docs |
| [design-system/](design-system/) | Superdesign themes, token index, usage guide | 4 docs |
| [ux-sprint/](ux-sprint/) | Full UX pipeline: user research through wireframes | 8 docs |

## Stats

- **42** features cataloged in [feature inventory](research/feature-inventory.yaml)
- **28** gaps analyzed in [gap analysis](research/gap-analysis.md)
- **18** rendering primitives documented in [rendering pipeline](research/rendering-pipeline.md)
- **12** theme presets in [superdesign index](design-system/superdesign-index.json)

Note:

- Theme preset counts here describe design-system candidates.
- Production runtime only allows explicitly registered themes and must fail fast on invalid selections.

## Research

- [thesys-architecture.md](research/thesys-architecture.md) -- Thesys C1 platform architecture teardown
- [gap-analysis.md](research/gap-analysis.md) -- Feature gap map: AgentPing vs C1 capabilities
- [rendering-pipeline.md](research/rendering-pipeline.md) -- Rendering workflow and primitive catalog
- [quality-patterns.md](research/quality-patterns.md) -- Quality patterns and anti-patterns guide
- [feature-inventory.yaml](research/feature-inventory.yaml) -- Structured feature catalog
- [screenshots/](research/screenshots/) -- 10 annotated C1 interface captures

## Implementation

- [build-plan.md](implementation/build-plan.md) -- Phased build plan with milestones
- [polymorph-migration.md](implementation/polymorph-migration.md) -- Migration from HTML to React + Pencil renderers

## Design System

- [readme.md](design-system/readme.md) -- Design system research overview
- [superdesign-themes.md](design-system/superdesign-themes.md) -- Theme prompt library for GenUI
- [superdesign-index.json](design-system/superdesign-index.json) -- Machine-readable theme token index
- [theme-guide.md](design-system/theme-guide.md) -- Usage examples and integration patterns

## UX Sprint

- [summary.md](ux-sprint/summary.md) -- Sprint summary and key decisions
- [user-research.md](ux-sprint/user-research.md) -- User research and persona synthesis
- [information-architecture.md](ux-sprint/information-architecture.md) -- IA and content structure
- [user-flows.md](ux-sprint/user-flows.md) -- Core user flow diagrams
- [interaction-model.md](ux-sprint/interaction-model.md) -- Interaction patterns and affordances
- [visual-identity.md](ux-sprint/visual-identity.md) -- Visual identity and brand alignment
- [components.md](ux-sprint/components.md) -- Component inventory and specs
- [wireframes.md](ux-sprint/wireframes.md) -- Wireframe designs and layout specs

