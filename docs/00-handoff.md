# 00 Handoff

## Source of truth

- Beads DB (`.beads/beads.db`) is canonical for component QA state.
- Storybook runtime and build outputs are canonical for render/build validation.
- QA artifacts for this pass are under `docs/qa/pass26/`.

## Live status snapshot (2026-02-24)

- `ap-4rs.*` child beads: `327`
- `ap-4rs.*` bead status: `327 open`, `0 closed`
- `ap-4rs.*` comment coverage: complete (`0` beads without comments; historical baseline `1245+` comments)
- Migration Storybook families: `327` unique `Migrations/*` titles
- Bead/component parity check: migration story file universe and bead universe align (`327 ↔ 327`)

## Build gates (current run)

- `pnpm --filter @kingly/ui build` → PASS (2026-02-24)
- `pnpm --filter @kingly/ui build-storybook` → PASS (2026-02-24)
- Warnings are still primarily `"use client"` bundling + sourcemap resolution and are non-blocking.

## Pass 26 platform stabilization (this run)

### Fixes applied

1. Storybook wide-canvas stabilization for centered/padded layouts on wide screens.
2. Global Storybook layout default switched to `fullscreen` to reduce clipped/narrow preview behavior.
3. Theme/mode propagation hardened in preview decorator:
   - consistent `data-theme`/`data-mode` on preview root,
   - `color-scheme` sync,
   - toolbar state persistence keys.

Implementation file:
- `packages/ui/.storybook/preview.ts`

### Audit executed

- `agent-browser` matrix on 3 random migration stories:
  - `migrations-webui-holographiccard--default`
  - `migrations-studio-toast--error`
  - `migrations-dashboardmanager-uptimechart--multi-day`
- Coverage: `2 modes × 3 viewports × 3 stories = 18` screenshots
- Result: `18/18 PASS`, `0 console error rows`
- Artifact CSV: `docs/qa/pass26/mini-audit-results.csv`
- Screenshots: `docs/qa/pass26/screenshots/`
- Bead comments added for sampled components:
  - `ap-4rs.151` (`HolographicCard`)
  - `ap-4rs.296` (`Toast`)
  - `ap-4rs.310` (`UptimeChart`)
- Extra validation shots:
  - toolbar theme/mode propagation check
  - wide container validation shot

## Known failure inventory (for remediation planning)

`pass2.5-all-gates` is present on `260/327`, so `67` remain in non-pass state.

Breakdown:
1. Structural debt cluster (`54`): labels `shell-needs-implementation` and/or `hollow-needs-ui`.
2. Actionable fail cluster (`5` still non-pass): `ErrorCluster`, `MultiSelect`, `ReviewQueue.conflicts`, `WeatherCard`, `WidgetCrashFallback`.
3. State-drift cluster (`9`): non-pass but missing both structural and actionable fail labels.
   - `CanvasRenderer`, `ChatMessage`, `ConnectionStatus`, `CrudEntityForm`, `CrudFieldRenderer`, `DatePicker`, `DatePickerPro`, `FieldRenderer`, `MiniMap`
4. Label drift (`2`): still tagged `pass5-actionable-fail` while already tagged `pass2.5-all-gates`.
   - `ParticleStream`, `StatGridSkeleton`

## Remediation queue (next agent pass)

1. Normalize metadata first:
   - resolve `67` non-pass rows into exactly one failure class each,
   - remove stale contradictory labels.
2. Close actionable implementation fails next (the 5-component cluster above).
3. Tackle structural debt in prioritized batches:
   - batch A: gallery section hollows,
   - batch B: shell controls/input primitives,
   - batch C: data-visual shells.
4. Re-run full matrix audit after each batch:
   - desktop/tablet/mobile,
   - light/dark,
   - console + screenshot capture,
   - bead comment update only (no auto-close).

## Linked docs

- `docs/qa/pass26/mini-audit-results.csv`
- `docs/qa/pass26/screenshots/`
- `docs/qa/pass7-visual-qa-report.md`
- `docs/qa/pass7-dashboard-triage.md`

## Operational note

- `bd`/Dolt reads are intermittently unstable in this workspace (`bd show` can panic with nil pointer in Dolt engine). Re-run usually succeeds; treat as toolchain instability, not component regression.
