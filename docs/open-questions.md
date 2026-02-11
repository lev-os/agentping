# Open Questions: UI Consolidation

This page tracks unresolved decisions for the consolidation handoff.

## 1) Storybook Topology

Question:

- final state should be one storybook or two (`ui` + `studio-shell`)?

Recommended default:

- one canonical component storybook in `packages/ui`; Studio storybook either retired or limited to shell-only integration stories.

## 2) Theme Set Scope

Question:

- keep runtime themes fixed at `agentping|skynet|syslog` now, or expand immediately with GenUI candidate themes?

Recommended default:

- keep current fail-fast runtime set for production now; stage additional themes behind explicit registration and QA.

## 3) Naming Migration For Domain-Bound Components

Question:

- what is the canonical naming pattern for domain-neutral primitives?

Recommended default:

- use neutral names (for example `entity-picker`/`actor-picker`) and pass domain semantics through props/data.

## 4) Adapter Package Scope

Question:

- should `packages/adapters/web-ui` keep any reusable presentational components?

Recommended default:

- no; keep adapter-shell/channel concerns only. Reusable components belong in `packages/ui`.

## 5) Canvas + Studio Boundary

Question:

- what stays canvas-local vs shared in `packages/ui`?

Recommended default:

- keep mode/runtime orchestration local; move reusable primitives and common widgets to `packages/ui`.

## 6) Migration Strategy

Question:

- big-bang cutover or phased migration?

Recommended default:

- phased migration in the order defined in `docs/handoff-consolidation.md`:
  1. Studio shared extraction
  2. theme normalization
  3. web-ui adapter cleanup
  4. canvas alignment
  5. boundary lock
