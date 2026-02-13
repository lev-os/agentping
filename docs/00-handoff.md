# 00 Handoff

## Source of truth

- Use Beads only (`bd`).
- Do not create or maintain CSV/TXT trackers.

## Current status

- `ap-4rs` is the active migration/QA epic (327 child component tasks).
- `ap-n2l` is the active dashboard consolidation epic.
- Storybooks and runtime surfaces are operational from dashboard-runner.

## Validation refresh (2026-02-13)

### Pass 6 complete
- 4 story crashes fixed (ErrorCluster, MultiSelect, ReviewQueue, WidgetCrashFallback)
- EnrichmentPanel fully ported: 35 LOC shell → 319 LOC (directives, attachments, notes, QuickActionBar, drag-and-drop)
- 53 beads reclassified: 38 SHELL + 15 HOLLOW → pass6-implemented (all had working code from Pass 3)
- 3 bead misattributions corrected (MultiSelect, ReviewQueue, WidgetCrashFallback)
- Build gates: `@kingly/ui build` PASS, `@kingly/ui build-storybook` PASS
- ReviewQueue barrel crash fixed: replaced 400+ barrel import with direct per-conflict-family imports

### Pass 5 complete
- 10 prop mismatches fixed (widened migration interfaces for consumer compat)
- 205 orphaned CSS files deleted (shim companions)
- 39 new files: 8 review infra, 19 review stories, 12 real sample pages (+8,555 LOC)
- Build gates: `@kingly/ui build` PASS, `@kingly/ui build-storybook` PASS
- `docs/qa/` deleted — beads are sole source of truth

### QA totals (bead-tracked)
- PASS: ~323/327 (98.7%)
- FAIL: ~4 structural debt remaining (gallery composition edge cases)
- All 4 former REAL fails FIXED: ErrorCluster, MultiSelect, ReviewQueue, WidgetCrashFallback
- 38 former SHELL components confirmed implemented (Pass 3)
- 15 former HOLLOW gallery sections confirmed working
- EnrichmentPanel: only truly incomplete component, now fully ported

## Known blocker

- `bd` prints a legacy database warning in this repo:
  - `LEGACY DATABASE DETECTED`
  - run `bd migrate --update-repo-id` once before normal operation

## Operator commands

```bash
cd community/agentping
bd migrate --update-repo-id
bd list --status open --limit 50
bd show ap-4rs
bd show ap-n2l
bd ready
```

## Working agreement

- Status updates happen on beads (`bd comment`, `bd update`), not docs tables.
- If scope/status changes, update this file only.

## Next actions

1. Visual QA: run storybook, validate all 327 component stories render correctly
2. Close passing `ap-4rs.*` beads after human visual sign-off
3. Dashboard consolidation: resume `ap-n2l` epic
