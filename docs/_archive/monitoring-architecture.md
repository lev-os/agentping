# Monitoring Dashboard Architecture - Phase 4

## Overview

This document defines the architecture for the monitoring dashboard feature in AgentPing Studio, enabling real-time visibility into dashboard process metrics, health history, and operational analytics.

## Metrics Schema

### DashboardMetrics Interface

```typescript
interface DashboardMetrics {
  // Identity
  dashboardId: string;

  // Lifecycle tracking
  uptime: number;                    // Current uptime in milliseconds
  totalUptime: number;               // Cumulative uptime across all sessions (ms)
  startedAt: Date;                   // Current session start time
  firstStartedAt: Date;              // First time this dashboard was ever started

  // Restart tracking
  totalRestarts: number;             // Lifetime restart count
  restartHistory: RestartRecord[];   // Last 100 restarts
  currentRestartAttempts: number;    // Attempts in current failure cycle

  // Crash tracking
  totalCrashes: number;              // Lifetime crash count
  lastCrashTime?: Date;              // Timestamp of most recent crash
  crashHistory: CrashRecord[];       // Last 50 crashes

  // Health monitoring
  healthCheckHistory: HealthCheckRecord[];  // Last 500 checks (rolling window)
  healthCheckSuccess: number;        // Count of successful checks
  healthCheckFailed: number;         // Count of failed checks
  healthCheckRate: number;           // Success rate (0-1)

  // Performance
  averageResponseTime?: number;      // Average HTTP health check response time (ms)
  peakMemoryUsage?: number;          // Peak RSS memory (bytes)
}

interface RestartRecord {
  timestamp: Date;
  reason: 'crash' | 'manual' | 'health_failure';
  previousUptime: number;            // How long it ran before restart (ms)
  attempts: number;                  // Restart attempt number in cycle
  success: boolean;
}

interface CrashRecord {
  timestamp: Date;
  reason: string;                    // Error message or exit signal
  exitCode: number | null;
  uptime: number;                    // How long it ran before crash (ms)
  port: number;
  pid: number;
}

interface HealthCheckRecord {
  timestamp: Date;
  success: boolean;
  responseTime?: number;             // HTTP check latency (ms)
  statusCode?: number;               // HTTP status code
  error?: string;                    // Failure reason
}
```

### AggregateStats Interface

```typescript
interface AggregateStats {
  // Fleet overview
  totalDashboards: number;
  runningCount: number;
  stoppedCount: number;
  failedCount: number;

  // Aggregate metrics
  totalRestarts: number;             // Sum across all dashboards
  totalCrashes: number;
  averageUptime: number;             // Mean uptime of running dashboards (ms)
  fleetHealthRate: number;           // Weighted average health check success rate

  // Fleet performance
  totalHealthChecks: number;
  healthCheckSuccessRate: number;
  averageRestartTime: number;        // Mean time to recover from crash (ms)

  // Time windows
  last24hRestarts: number;
  last24hCrashes: number;
  last7dUptime: number;              // Cumulative uptime across fleet
}
```

## IPC Contracts

### Main Process → Renderer (Events)

All existing `DashboardEvent` types remain unchanged. New metric events:

```typescript
// Fired every 60s or on significant metric change
type MetricEvent = {
  type: 'metrics_updated';
  dashboardId: string;
  metrics: DashboardMetrics;
};
```

### Renderer → Main Process (Commands)

#### `dashboard:get-metrics`

**Request:**
```typescript
{
  dashboardId: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  metrics?: DashboardMetrics;
  error?: string;
}
```

**Description:** Retrieve current metrics for a specific dashboard.

---

#### `dashboard:get-all-metrics`

**Request:**
```typescript
{} // No parameters
```

**Response:**
```typescript
{
  success: boolean;
  metrics?: Record<string, DashboardMetrics>;  // dashboardId → metrics
  error?: string;
}
```

**Description:** Retrieve metrics for all dashboards in one call.

---

#### `dashboard:stream-logs`

**Request:**
```typescript
{
  dashboardId: string;
  lines?: number;              // Number of historical lines to include (default: 100)
  follow?: boolean;            // Stream new lines (default: true)
}
```

**Response Stream:**
```typescript
{
  type: 'log_line';
  dashboardId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  line: number;                // Line number in log file
}

// Stream completion
{
  type: 'log_stream_end';
  dashboardId: string;
  totalLines: number;
}

// Stream error
{
  type: 'log_stream_error';
  dashboardId: string;
  error: string;
}
```

**Description:** Stream dashboard logs with automatic log level detection and colorization support. Uses `tail -f` for live streaming.

---

#### `dashboard:get-aggregate-stats`

**Request:**
```typescript
{} // No parameters
```

**Response:**
```typescript
{
  success: boolean;
  stats?: AggregateStats;
  error?: string;
}
```

**Description:** Calculate fleet-wide statistics across all dashboards.

---

#### `dashboard:export-metrics`

**Request:**
```typescript
{
  dashboardId?: string;        // If omitted, export all dashboards
  format: 'json' | 'csv';
  timeRange?: {
    start: Date;
    end: Date;
  };
}
```

**Response:**
```typescript
{
  success: boolean;
  filePath?: string;           // Path to exported file
  error?: string;
}
```

**Description:** Export metrics to disk for analysis or archival.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Process (Node.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DashboardManager (dashboard-manager.ts)                    │
│  ├── MetricsStore: Map<dashboardId, DashboardMetrics>     │
│  ├── IPC Handlers (dashboard:get-metrics, etc.)           │
│  ├── Event Listeners (process_started, process_crashed)   │
│  └── Persistence (metrics.json, auto-save every 60s)      │
│                                                             │
│  DashboardRunner (@lev-os/dashboard-runner)                │
│  └── Existing event emitters (no changes)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↕ IPC
┌─────────────────────────────────────────────────────────────┐
│                  Renderer Process (React)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Routes                                                     │
│  ├── /              → NavigatorWithRunner (existing)       │
│  └── /dashboard/:id → DashboardDetailView (new)           │
│                                                             │
│  Components                                                 │
│  ├── NavigatorWithRunner                                   │
│  │   └── AnalyticsPanel (new, top-right header)           │
│  │                                                          │
│  ├── DashboardDetailView (new)                             │
│  │   ├── DetailHeader (status, uptime, controls)          │
│  │   ├── MetricsSection                                    │
│  │   │   ├── UptimeChart                                   │
│  │   │   ├── RestartHistogram                              │
│  │   │   └── HealthCheckLineChart                          │
│  │   └── LogsSection                                       │
│  │       └── LogViewer                                     │
│  │                                                          │
│  └── Charts (recharts library)                             │
│      ├── UptimeChart.tsx      (area chart, time series)   │
│      ├── RestartHistogram.tsx (bar chart, grouped by day) │
│      └── HealthCheckLineChart.tsx (line, success rate)    │
│                                                             │
│  Hooks                                                      │
│  ├── useMetrics(dashboardId) → DashboardMetrics           │
│  ├── useAggregateStats() → AggregateStats                 │
│  └── useLogStream(dashboardId) → LogLine[]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Metric Collection (Main Process)**
   - `DashboardManager` subscribes to all `DashboardEvent` types
   - On each event, updates corresponding `DashboardMetrics` in memory
   - Calculates derived metrics (uptime, health rate, etc.)
   - Emits `metrics_updated` event to renderer
   - Persists to `~/.local/share/lev/dashboard-runner/metrics.json` every 60s

2. **Metric Display (Renderer)**
   - Components use `useMetrics()` hook
   - Hook calls `dashboard:get-metrics` IPC on mount
   - Subscribes to `metrics_updated` events for real-time updates
   - Auto-refreshes charts when metrics change

3. **Log Streaming (Main Process)**
   - On `dashboard:stream-logs` request, spawn `tail -f` child process
   - Parse each line for log level (regex: `ERROR|WARN|INFO|DEBUG`)
   - Send `log_line` events to renderer via IPC
   - Clean up tail process on component unmount

## Chart Library Selection: Recharts

**Decision:** Use [Recharts](https://recharts.org/) for all chart components.

**Rationale:**
- **TypeScript-first:** Full type definitions, no `@types` package needed
- **React-native:** Composable API matches React component model
- **Declarative:** Chart structure mirrors data structure (easy to reason about)
- **Responsive:** Built-in container sizing and breakpoints
- **Accessible:** ARIA labels, keyboard navigation out-of-the-box
- **Small bundle:** ~100KB minified (tree-shakable)
- **Active maintenance:** 20K+ GitHub stars, weekly releases

**Alternatives considered:**
- **Chart.js:** Imperative API, not React-idiomatic
- **Victory:** Large bundle size (~300KB), slower renders
- **Nivo:** Excellent design but overkill for our needs

**Installation:**
```bash
pnpm add recharts
pnpm add -D @types/recharts  # Included in recharts, but explicit for clarity
```

## Persistence Strategy

### Metrics Storage

**Location:** `~/.local/share/lev/dashboard-runner/metrics.json`

**Format:**
```json
{
  "version": 1,
  "lastUpdated": "2024-01-31T12:00:00.000Z",
  "dashboards": {
    "claude-ui": {
      "dashboardId": "claude-ui",
      "uptime": 3600000,
      "totalUptime": 7200000,
      "startedAt": "2024-01-31T11:00:00.000Z",
      "firstStartedAt": "2024-01-30T10:00:00.000Z",
      "totalRestarts": 5,
      "restartHistory": [...],
      "totalCrashes": 2,
      "crashHistory": [...],
      "healthCheckHistory": [...],
      "healthCheckSuccess": 450,
      "healthCheckFailed": 10,
      "healthCheckRate": 0.978
    }
  }
}
```

**Rotation Policy:**
- Keep last 100 restart records per dashboard
- Keep last 50 crash records per dashboard
- Keep last 500 health check records per dashboard (oldest first eviction)

**Auto-save:** Every 60 seconds, flush in-memory metrics to disk using atomic write (write to `.tmp` file, then rename).

### Log Storage

**Location:** `~/.local/share/lev/dashboard-runner/logs/{dashboardId}.log`

**Rotation:** Handled by `DashboardLogger` (existing), max 10MB per file, keep last 5 rotations.

## Implementation Phases

### Phase 4A: Metrics Foundation (Task #5)
- Extend `DashboardManager` with `MetricsStore`
- Add IPC handlers: `dashboard:get-metrics`, `dashboard:get-all-metrics`
- Persist metrics to disk every 60s
- Create `src/types/dashboard.ts` with all metric interfaces

### Phase 4B: Chart Components (Task #6)
- Install recharts
- Create chart components in `src/renderer/components/charts/`
- Create Storybook stories for each chart
- Test with mock metric data

### Phase 4C: Log Viewer (Task #7)
- Add `dashboard:stream-logs` IPC handler
- Create `LogViewer.tsx` with search/filter/auto-scroll
- Add color coding for log levels

### Phase 4D: Detail View (Task #8)
- Create `/dashboard/:id` route
- Integrate charts and log viewer
- Add navigation from main dashboard list

### Phase 4E: Analytics Panel (Task #9)
- Add `dashboard:get-aggregate-stats` IPC handler
- Create `AnalyticsPanel.tsx` for header
- Display fleet-wide statistics

### Phase 4F: E2E Tests (Task #10)
- Test metrics update on restart
- Test chart rendering with real data
- Test log streaming

## Security Considerations

- **Log injection prevention:** Sanitize log lines before sending to renderer (escape HTML entities)
- **Path traversal:** Validate `dashboardId` matches `^[a-z0-9-]+$` before reading logs
- **Memory limits:** Cap history arrays (100 restarts, 50 crashes, 500 health checks)
- **IPC rate limiting:** Throttle `dashboard:stream-logs` to 1 request per dashboard at a time

## Performance Targets

- **Metric update latency:** < 100ms from event to renderer display
- **Log streaming:** Handle 1000+ lines/sec without UI freeze
- **Chart render time:** < 200ms for 500 data points
- **Memory overhead:** < 50MB for 10 dashboards with full history

## Open Questions

1. **Metric retention:** Should we archive metrics older than 30 days to a separate file?
2. **Export format:** Does CSV export need Excel compatibility (UTF-8 BOM)?
3. **Real-time updates:** Should charts update every second or only on metric changes?

---

**Status:** Architecture complete, ready for implementation (Phase 4A-4F)

**Key decisions:**
- Metrics schema: Comprehensive tracking with rolling history windows
- IPC contracts: 5 new handlers (get-metrics, get-all-metrics, stream-logs, get-aggregate-stats, export-metrics)
- Chart library: Recharts for TypeScript-first, React-native API
- Persistence: Auto-save every 60s to `~/.local/share/lev/dashboard-runner/metrics.json`
- Component structure: Detail view with 3 chart types + log viewer + analytics panel

**Doc location:** `/Users/jean-patricksmith/digital/leviathan/core/agent-harness/vendor/AgentPing/docs/monitoring-architecture.md`
