# Pass 7: Dashboard Consolidation Triage

> Generated: 2026-02-16 | Epic: `lev-my90` | Related: `ap-n2l`

## Context

Four specs govern dashboard work:
1. **Entity-dashboard-consolidation spec** — CLI dashboard shortcuts + BD-as-CMS
2. **20260201 handoff** — shortcut-to-skill routing
3. **lev-dashboard-synthesis proposal** — Flight Deck merging INTO Lev Dashboard
4. **Dashboard 0.1.0 handoff** — theme system + multi-platform (epic `lev-2ci6`, fully shipped)

The `lev-my90` epic covers **migrating dashboard UI components only** — explicitly scoped to exclude infrastructure (Docker/networking/gateway).

---

## What's Already in `@kingly/ui`

### 9 Dashboard Migration Components

| Component | Source | Status | Notes |
|---|---|---|---|
| `dashboard.tsx` | Studio `Dashboard.tsx` | **needs-review** | Mission Control with telemetry grid, quick ops, activity stream. Runtime-coupled (window.coordinator) |
| `dashboard-detail-view.tsx` | Studio `DashboardDetailView.tsx` | **needs-review** | Metrics detail view. Runtime-coupled (window.electron) |
| `dashboard-widget.tsx` | Re-export alias | **done** | Points to `../dashboard/DashboardWidget.tsx` (canonical) |
| `dm-dashboard-list.tsx` | dashboard-manager-ui | **candidate** | Table of dashboards with status, ports, uptime. Prop-driven |
| `dm-dashboard-detail.tsx` | dashboard-manager-ui | **candidate** | Detail view with config/metrics. Prop-driven |
| `dm-create-dashboard-modal.tsx` | dashboard-manager-ui | **candidate** | Form modal for new dashboards. Prop-driven |
| `gallery-dashboard-section.tsx` | web-ui Gallery | **done** | Gallery showcase of StatsGrid, StatusCard, ProgressBar, etc. |
| `navigator-with-dashboards.tsx` | Studio | **needs-review** | Dashboard grid navigator with health status. Runtime-coupled |
| `responsive-dashboard.tsx` | Re-export alias | **done** | Points to canonical `../dashboard/ResponsiveDashboard.tsx` |

### 25 Supporting Components (`@kingly/ui/components/dashboard/`)

`DashboardWidget`, `ResponsiveDashboard`, `WidgetWrapper`, `GraphView`, `SpecPanel`, `DocCard`, `TreeExpander`, skeletons (7), and more.

All original sources are **shimmed** — Studio and web-ui dashboard files now re-export from `@kingly/ui/components`.

---

## What's Missing (NOT in `@kingly/ui`)

### 1. Jarvis Monitoring Components

Source: `~/clawd/.lev/poc/jarvis-dashboard/` (documented in `jarvis-monitoring-components.md`)

- `DaemonMonitor` — daemon status cards (lev/poly/bd)
- `ProcessList` — sortable process table
- `ExecTracker` — workflow execution tracking with progress bars
- `StreamingOutput` — terminal-style live log output
- `MonitoringView` — unified layout combining all four
- `useMonitoring` hook + mock data generators

**Zero** of these exist in `@kingly/ui`. The Jarvis POC directory appears to no longer exist in the monorepo.

### 2. Flight Deck Components (`packages/dashboard-core`)

Shipped in Dashboard 0.1.0 but NOT in `@kingly/ui`:

- `StatusBadge`, `EntityGrid`, `DetailPage`, `Card`, `Section`, `ActivityLog`, `MetadataPanel`
- `AuditFeed`, `Header`, `Navigation`, `Breadcrumbs`, `SearchInput`, `FilterChips`
- `Modal`, `Toast`, `Spinner`, `EmptyState`, `Button`, `ThemeSelector`, `VoiceConsole`
- `ThemeProvider` + 5-theme system (Cyberpunk, Kingly, Sofia, AgentPing, LCARS)
- `HITLQueue`, `TaskCard`

These live in `packages/dashboard-core/src/components/flight-deck/` — a separate package.

### 3. CEO Stack

Referenced at port 3003/6036. No components in any migration path. Listed as legacy/inactive in `docs/component-catalog.md`.

---

## Recommendations for `lev-my90.1` through `lev-my90.4`

### `lev-my90.1` — Jarvis Monitoring Migration (P0)
Port `DaemonMonitor`, `ProcessList`, `ExecTracker`, `StreamingOutput`, `MonitoringView` from Jarvis POC into `@kingly/ui/components/migrations/`. Locate source (likely archived outside monorepo). Highest-value missing pieces — real operational monitoring UI.

### `lev-my90.2` — Flight Deck / dashboard-core Reconciliation (P0)
`packages/dashboard-core` flight-deck components overlap conceptually with `@kingly/ui` dashboard components but aren't deduplicated. **Decision needed**: absorb `dashboard-core/flight-deck` into `@kingly/ui`, or keep as separate package. The theme system (5 themes + ThemeProvider) is the key differentiator.

### `lev-my90.3` — Needs-Review Resolution (P1)
Three migration files (`dashboard.tsx`, `dashboard-detail-view.tsx`, `navigator-with-dashboards.tsx`) flagged `needs-review` due to runtime coupling (`window.coordinator`, `window.electron`, dashboard-manager API). Stub or inject runtime dependencies via props for full portability.

### `lev-my90.4` — CEO Stack Deprecation (P0)
CEO Stack has no active components in any migration path. Document as deprecated in component catalog. **No migration work needed** — just close the loop.

---

## File Manifest

### Specs/Planning
- `.lev/pm/specs/archived.spec-entity-dashboard-consolidation.md`
- `.lev/pm/handoffs/20260201-entity-dashboard-consolidation.md`
- `.lev/pm/proposals/lev-dashboard-synthesis.md`
- `.lev/pm/handoffs/20260117-092501-dashboard-0.1.0-complete.md`
- `.lev/pm/archive/scratch-202601/jarvis-monitoring-components.md`

### Migrated Components (`@kingly/ui` migrations/)
- `community/agentping/packages/ui/src/components/migrations/dashboard.tsx`
- `community/agentping/packages/ui/src/components/migrations/dashboard-widget.tsx`
- `community/agentping/packages/ui/src/components/migrations/dashboard-detail-view.tsx`
- `community/agentping/packages/ui/src/components/migrations/dm-dashboard-list.tsx`
- `community/agentping/packages/ui/src/components/migrations/dm-dashboard-detail.tsx`
- `community/agentping/packages/ui/src/components/migrations/dm-create-dashboard-modal.tsx`
- `community/agentping/packages/ui/src/components/migrations/gallery-dashboard-section.tsx`
- `community/agentping/packages/ui/src/components/migrations/navigator-with-dashboards.tsx`
- `community/agentping/packages/ui/src/components/migrations/responsive-dashboard.tsx`

### Original Sources (shimmed)
- `packages/adapters/web-ui/src/components/sofia/dashboard/ResponsiveDashboard.tsx`
- `packages/adapters/web-ui/src/components/sofia/dashboard/DashboardWidget.tsx`
- `packages/adapters/web-ui/src/components/gallery/GalleryDashboardSection.tsx`
- `packages/studio/src/renderer/components/NavigatorWithDashboards.tsx`
- `packages/studio/src/renderer/components/DashboardDetailView.tsx`
- `packages/studio/src/renderer/components/Dashboard.tsx`

### Separate Package (not in `@kingly/ui`)
- `packages/dashboard-core/src/components/flight-deck/index.ts`
- `packages/dashboard-core/src/components/index.ts`
- `packages/ui/src/components/dashboard/` (25 canonical files)
