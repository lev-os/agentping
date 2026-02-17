# 00 Handoff

## Source of truth

- Use Beads only (`bd`).
- Do not create or maintain CSV/TXT trackers.

## Current status

- `ap-4rs` — **CLOSED** (327/327 beads closed, migration complete)
- `ap-n2l` is the active dashboard consolidation epic.
- `lev-my90` is the active dashboard component migration epic (4 open tasks).
- Storybooks and runtime surfaces are operational from dashboard-runner.

## Validation refresh (2026-02-16)

### Pass 7 complete — Migration DONE
- **327/327 `ap-4rs` beads CLOSED** (including parent epic)
- Storybook static build: GREEN (12.14s, zero real compilation errors)
- Storybook dev server: serving on port 6006 (HTTP 200)
- All `"use client"` sourcemap warnings — benign, expected in bundled builds
- Dashboard consolidation triage complete → `docs/qa/pass7-dashboard-triage.md`

### Pass 6 complete (2026-02-13)
- 4 story crashes fixed (ErrorCluster, MultiSelect, ReviewQueue, WidgetCrashFallback)
- EnrichmentPanel fully ported: 35 LOC shell → 319 LOC (directives, attachments, notes, QuickActionBar, drag-and-drop)
- 53 beads reclassified: 38 SHELL + 15 HOLLOW → pass6-implemented (all had working code from Pass 3)
- 3 bead misattributions corrected (MultiSelect, ReviewQueue, WidgetCrashFallback)
- Build gates: `@kingly/ui build` PASS, `@kingly/ui build-storybook` PASS
- ReviewQueue barrel crash fixed: replaced 400+ barrel import with direct per-conflict-family imports

### Pass 5 complete (2026-02-13)
- 10 prop mismatches fixed (widened migration interfaces for consumer compat)
- 205 orphaned CSS files deleted (shim companions)
- 39 new files: 8 review infra, 19 review stories, 12 real sample pages (+8,555 LOC)
- Build gates: `@kingly/ui build` PASS, `@kingly/ui build-storybook` PASS

### Final QA totals
- **327/327 beads CLOSED** — all gates pass
- Storybook static build: GREEN
- 416 components migrated to `@kingly/ui`
- 340 migration `.tsx` files, 327 Storybook stories
- 318 consumer files shimmed across 4 packages (-33,915 LOC)
- 205 orphaned CSS files deleted

## Dashboard consolidation triage (2026-02-16)

### What's in `@kingly/ui`
- 9 dashboard migration components + 25 supporting dashboard components
- Original sources shimmed to re-export from `@kingly/ui/components`

### What's missing
1. **Jarvis monitoring** (DaemonMonitor, ProcessList, ExecTracker, StreamingOutput, MonitoringView) — zero in `@kingly/ui`
2. **Flight Deck** (`packages/dashboard-core`) — 20+ components not deduplicated with `@kingly/ui`
3. **CEO Stack** — deprecated, no active components

### Next steps (`lev-my90`)
- `lev-my90.1` — Port Jarvis monitoring components (P0)
- `lev-my90.2` — Reconcile Flight Deck / dashboard-core with `@kingly/ui` (P0)
- `lev-my90.3` — Resolve 3 `needs-review` dashboard migrations (P1)
- `lev-my90.4` — Document CEO Stack as deprecated (P0)

Full triage: `docs/qa/pass7-dashboard-triage.md`

## Known blocker

- `bd` prints a legacy database warning in this repo:
  - `LEGACY DATABASE DETECTED`
  - run `bd migrate --update-repo-id` once before normal operation

## Operator commands

```bash
cd community/agentping
bd migrate --update-repo-id
bd list --status open --limit 50
bd show ap-4rs    # CLOSED
bd show ap-n2l
bd show lev-my90  # from parent repo
bd ready
```

## Working agreement

- Status updates happen on beads (`bd comment`, `bd update`), not docs tables.
- If scope/status changes, update this file only.

## Next actions

1. Dashboard consolidation: begin `lev-my90.1` (Jarvis monitoring port)
2. Dashboard consolidation: decide Flight Deck absorption strategy (`lev-my90.2`)
3. Close `lev-my90.4` (CEO Stack deprecation — documentation only)
