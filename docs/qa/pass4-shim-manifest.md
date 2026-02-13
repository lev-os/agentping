# Pass 4 Shim Manifest

Generated: 2026-02-12

## Summary

| Package | Files Shimmed | Already Shimmed | Kept Original | Total Component Files |
|---------|--------------|-----------------|---------------|----------------------|
| web-ui | 263 | 8 | 2 | 275 |
| studio | 41 | 13 | 0 | 54 |
| canvas | 6 | 0 | 0 | 6 |
| dashboard-manager-ui | 8 | 0 | 0 | 8 |
| **TOTAL** | **318** | **21** | **2** | **343** |

## Kept Original (Not Shimmed)

These files export multiple sub-components not individually available in @kingly/ui:

- `web-ui/src/components/SharedComponents.tsx` — exports `ApprovalButtons`, `QuestionInput`, `DirectionPicker`, `NotificationBanner`
- `web-ui/src/components/EnrichmentPanel.tsx` — exports `EnrichmentPanel`, `QuickActionBar`

## Build Status After Shimming

| Gate | Package | Result | Notes |
|------|---------|--------|-------|
| G1 | @kingly/ui | GREEN | Source of truth, no changes |
| G1 | @agentping/web-ui | YELLOW | 11 App.tsx prop type mismatches (migration interface diffs) |
| G1 | @agentping/studio | GREEN | 0 errors (66 pre-existing electron errors eliminated) |
| G1 | canvas | YELLOW | 4 pre-existing polymorph errors (not shim-related) |
| G1 | dashboard-manager-ui | YELLOW | 2 App.tsx prop mismatches (migration interface diffs) |
| G2.1 | Storybook | GREEN | Full static build passes |
| G2.2 | Import residue | GREEN | 0 web-ui, 1 studio (navigator.tsx — acceptable) |
| G2.3 | Circular deps | GREEN | 0 @agentping imports in @kingly/ui |

## App.tsx Prop Mismatches (Deferred to Visual QA)

All 11 web-ui errors and 2 dm-ui errors are prop type differences between original source components and migration components:

- `StepChecklist.onComplete`: `string` vs `number` callback parameter
- `SelectionList`: missing `items` prop, different structure
- `TaskWorkflow`: different prop shape
- `PingCard`: `Ping` vs `PingCardPing` type
- `LandingPage`: extra `onGetStarted` prop not in migration
- `PrimitivesGallery`: extra `initialSection` prop not in migration
- `HistoryView`: extra `onSelectPing` prop not in migration
- `DmDashboardList/DmDashboardDetail`: required props not passed

These are migration fidelity issues to resolve during visual QA, not shim infrastructure problems.
