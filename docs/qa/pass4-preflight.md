# Pass 4 Preflight Report (G0 Gate Results)

Generated: 2026-02-12

## G0.1: Export Inventory

| Package | Total Components | Matched | Unmatched | Already Shimmed | To Shim |
|---------|-----------------|---------|-----------|-----------------|---------|
| web-ui | 275 | 270 | 5 | 8 | 262 |
| studio | 54 | 54 | 0 | 13 | 41 |
| canvas | 6 | 6 | 0 | 0 | 6 |
| dashboard-manager-ui | 8 | 8 | 0 | 0 | 8 |
| **TOTAL** | **343** | **338** | **5** | **21** | **317** |

**Barrel modules in @kingly/ui:** 326

### Unmatched Files (5 total, all in web-ui)

These are CRUD recipe internals and should NOT be shimmed (they are not standalone components):

| File | Reason |
|------|--------|
| `sofia/recipes/CrudDetailPage.tsx` | CRUD recipe internal (excluded from barrel) |
| `sofia/recipes/CrudListPage.tsx` | CRUD recipe internal (excluded from barrel) |
| `sofia/recipes/context.tsx` | CRUD React context (not a component) |
| `sofia/recipes/crud/layouts/CrudArchivePage.tsx` | CRUD layout internal |
| `finance/CandleStickChart.tsx` | Case mismatch: file is `CandleStickChart`, barrel is `candlestick-chart` |

**Action needed:** `CandleStickChart.tsx` has a casing discrepancy. The barrel module is `candlestick-chart` (no hyphen between candle-stick). The PascalCase `CandleStickChart` converts to `candle-stick-chart` but the barrel uses `candlestick-chart`. This component should be shimmed manually using the `candlestick-chart` module name.

**Updated to-shim for web-ui:** 263 (262 auto-matched + 1 CandleStickChart manual)

### Conflict Families Verified (11/11)

All conflict family modules exist in barrel with correct StudioRaw/WebUiRaw/Candidate exports:

- badge-conflict
- button-conflict
- code-diff-viewer-conflict
- context-menu-conflict
- empty-state-conflict
- icon-button-conflict
- input-conflict
- search-input-conflict
- spinner-conflict
- timeline-conflict
- log-viewer-conflict

### Already Shimmed Files (21 total)

**Web-UI (8):** Badge, CodeDiffViewer, ContextMenu, EmptyState, LogViewer, SearchInput, Spinner, Timeline

**Studio (13):** LogViewer, ui/Badge, ui/Button, ui/CodeDiffViewer, ui/ContextMenu, ui/EmptyState, ui/IconButton, ui/Input, ui/SearchInput, ui/Spinner, ui/StatusGrid, ui/Timeline, ui/Toast

All verified to import from `@kingly/ui/components`.

## G0.2: Dependency Resolution

| Package | @kingly/ui dep before | @kingly/ui dep after | Status |
|---------|----------------------|---------------------|--------|
| canvas | MISSING | `"workspace:*"` added | FIXED |
| dashboard-manager-ui | MISSING | `"workspace:*"` added | FIXED |
| web-ui | already present | - | OK |
| studio | already present | - | OK |

`pnpm install` completed successfully after adding deps.

## G0.3: Conflict Family Verification

| Family | StudioRaw Export | WebUiRaw Export | Candidate Export | Module Exists |
|--------|-----------------|-----------------|------------------|---------------|
| Badge | BadgeStudioRaw | BadgeWebUiRaw | BadgeCandidate | YES |
| Button | ButtonStudioRaw | ButtonWebUiRaw | ButtonCandidate | YES |
| CodeDiffViewer | CodeDiffViewerStudioRaw | CodeDiffViewerWebUiRaw | CodeDiffViewerCandidate | YES |
| ContextMenu | ContextMenuStudioRaw | ContextMenuWebUiRaw | ContextMenuCandidate | YES |
| EmptyState | EmptyStateStudioRaw | EmptyStateWebUiRaw | EmptyStateCandidate | YES |
| IconButton | IconButtonStudioRaw | IconButtonWebUiRaw | IconButtonCandidate | YES |
| Input | InputStudioRaw | InputWebUiRaw | InputCandidate | YES |
| SearchInput | SearchInputStudioRaw | SearchInputWebUiRaw | SearchInputCandidate | YES |
| Spinner | SpinnerStudioRaw | SpinnerWebUiRaw | SpinnerCandidate | YES |
| Timeline | TimelineStudioRaw | TimelineWebUiRaw | TimelineCandidate | YES |
| LogViewer | LogViewerStudioRaw | LogViewerWebUiRaw | LogViewerCandidate | YES |

## G0.4: Baseline Build Status

| Package | TypeScript | Vite Build | Packaging | Overall |
|---------|-----------|------------|-----------|---------|
| @kingly/ui | PASS (ESM + DTS) | PASS | N/A | GREEN |
| @agentping/web-ui | PASS | PASS (5010 modules) | N/A | GREEN |
| @agentping/studio | PASS | PASS (6206 modules) | FAIL (electron-builder 7zip) | YELLOW |

**Studio note:** TypeScript compilation and Vite bundle both succeed. The failure is in electron-builder's 7zip step (arm64 binary issue), which is a pre-existing environment issue unrelated to the migration. The tsc+vite portion is GREEN.

## Summary

- **317 files to shim** across 4 packages (262 web-ui + 41 studio + 6 canvas + 8 dm-ui)
- **+1 manual shim** for CandleStickChart casing mismatch = **318 total**
- **4 CRUD internals** skipped (not standalone components)
- **21 already-shimmed files** confirmed correct
- **All 11 conflict families** verified in barrel
- **Dependencies** added to canvas + dashboard-manager-ui
- **Baseline builds** all GREEN (studio electron packaging is pre-existing)

## Artifacts

- Export map: `docs/qa/pass4-export-map.json`
- This report: `docs/qa/pass4-preflight.md`
