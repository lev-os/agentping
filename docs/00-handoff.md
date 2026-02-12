# 00 Handoff

## Source of truth

- Use Beads only (`bd`).
- Do not create or maintain CSV/TXT trackers.

## Current status

- `ap-4rs` is the active migration/QA epic (327 child component tasks).
- `ap-n2l` is the active dashboard consolidation epic.
- Storybooks and runtime surfaces are operational from dashboard-runner.

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

1. Close human QA on `ap-4rs.*` tasks that are already visually validated.
2. Execute import rewrites in task order and capture evidence in bead comments.
3. Re-run smoke checks on storybook + studio + canvas before closing epic slices.
