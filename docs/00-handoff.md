# 00 Handoff

## Source of truth

- Use Beads only (`bd`).
- Do not create or maintain CSV/TXT trackers.

## Current status

- `ap-4rs` is the active migration/QA epic (327 child component tasks).
- `ap-n2l` is the active dashboard consolidation epic.
- Storybooks and runtime surfaces are operational from dashboard-runner.

## Validation refresh (2026-02-13)

### Pass 5 complete
- 10 prop mismatches fixed (widened migration interfaces for consumer compat)
- 205 orphaned CSS files deleted (shim companions)
- 39 new files: 8 review infra, 19 review stories, 12 real sample pages (+8,555 LOC)
- Build gates: `@kingly/ui build` PASS, `@kingly/ui build-storybook` PASS
- `docs/qa/` deleted — beads are sole source of truth

### QA totals (bead-tracked)
- PASS: ~269/327 (82.3%)
- FAIL: ~58 (38 SHELL, 16 HOLLOW, 4 actionable REAL)
- 6 former REAL fails fixed by prop widening (DmDashboardDetail/List, HistoryView, LandingPage, LeaseApproval, PingCard)
- 4 remaining REAL fails: ErrorCluster, MultiSelect, ReviewQueue, WidgetCrashFallback

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

1. Investigate 4 remaining REAL failures (ErrorCluster, MultiSelect, ReviewQueue, WidgetCrashFallback)
2. Implement 38 SHELL components (placeholder → full build)
3. Implement 16 HOLLOW gallery sections (summary text → real content)
4. Visual QA: run storybook, validate review pages + sample pages render correctly
5. Close passing `ap-4rs.*` beads after human visual sign-off
