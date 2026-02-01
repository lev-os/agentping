# Web UI Architecture - Phase 5

> Browser-based dashboard management interface for @lev-os/dashboard-runner

## Overview

Phase 5 adds a browser-based management interface for dashboard-runner. The architecture supports **two deployment modes**:

1. **Standalone HTTP Server** - Independent server (dev, testing, remote access)
2. **Embedded in Electron** - Integrated into AgentPing Studio (production)

Both modes share the same codebase with different entry points.

---

## Architecture Decisions

### 1. Dual Deployment Strategy

**Standalone Server (`@agentping/dashboard-web-server`)**
- Independent HTTP server using existing `@agentping/http-api`
- Direct connection to `DashboardRunner` instance
- Use case: Development, remote monitoring, headless deployments

**Embedded Mode (`packages/studio/src/main/`)**
- Served via Electron `protocol.registerFileProtocol`
- IPC bridge between renderer and main process
- Use case: Production GUI, offline use, bundled distribution

**Why both?**
- Standalone enables remote access and testing without Electron overhead
- Embedded provides seamless Studio integration
- Code reuse maximizes efficiency

### 2. API Design - REST + WebSocket Hybrid

**REST for CRUD Operations**
```
GET    /api/dashboards           → List all dashboards
GET    /api/dashboards/:id       → Get single dashboard status
POST   /api/dashboards           → Create/start new dashboard
PATCH  /api/dashboards/:id       → Update dashboard config
DELETE /api/dashboards/:id       → Stop and remove dashboard
```

**WebSocket for Real-Time Updates**
```
WS /socket → Socket.io connection

Client subscribes to:
  - dashboard:status         → Status changes (starting → online → failed)
  - dashboard:log-line       → Streaming stdout/stderr
  - dashboard:health-failed  → Health check failures
  - dashboard:port-changed   → Dynamic port reassignment

Client sends:
  - dashboard:subscribe      → Subscribe to specific dashboard
  - dashboard:unsubscribe    → Unsubscribe from updates
```

**Why this split?**
- REST: Stateless operations, cacheable, idempotent
- WebSocket: Low-latency streaming, bi-directional, event-driven
- Follows existing AgentPing hexagonal architecture pattern

### 3. Authentication Strategy

**Phase 5.1 (MVP)**: None (localhost-only)
- Bind to `127.0.0.1` only
- No auth required for local development

**Phase 5.2 (Optional)**: API Key Auth
- Optional `--api-key` flag for standalone server
- Header: `Authorization: Bearer {token}`
- Environment variable: `DASHBOARD_API_KEY`
- Use case: Remote access, shared environments

**Why defer auth?**
- Simplifies initial development
- localhost binding provides basic security
- Can add middleware later without architecture changes

### 4. Package Structure

```
packages/
├── adapters/
│   ├── http-api/              (existing - extend for dashboard routes)
│   └── web-ui/                (existing - add dashboard UI components)
├── dashboard-runner/          (existing - core runtime)
└── dashboard-web-server/      (NEW - standalone HTTP server)
    ├── src/
    │   ├── server.ts          → HTTP server entry point
    │   ├── routes/
    │   │   ├── dashboards.ts  → REST routes
    │   │   └── websocket.ts   → Socket.io handler
    │   └── cli.ts             → CLI entry point (npm start)
    └── package.json           → Publishable npm package
```

**Why new package?**
- Standalone server is separately publishable
- Doesn't bloat `@agentping/http-api` with dashboard-specific code
- Clean separation: `http-api` = AgentPing adapter, `dashboard-web-server` = runner UI

---

## API Specification

### REST Endpoints

#### `GET /api/dashboards`
**Response:**
```json
{
  "dashboards": [
    {
      "id": "grafana",
      "status": "online",
      "port": 3000,
      "pid": 12345,
      "startedAt": "2026-01-31T10:00:00Z",
      "restartAttempts": 0,
      "healthy": true,
      "lastHealthCheck": "2026-01-31T10:05:00Z"
    }
  ]
}
```

#### `GET /api/dashboards/:id`
**Response:**
```json
{
  "id": "grafana",
  "config": {
    "name": "Grafana Dashboard",
    "command": "grafana-server",
    "cwd": "/opt/grafana",
    "port_range": [3000, 3100],
    "health_check": {
      "type": "http",
      "path": "/api/health",
      "timeout_ms": 5000
    }
  },
  "status": {
    "status": "online",
    "port": 3000,
    "pid": 12345,
    "startedAt": "2026-01-31T10:00:00Z",
    "restartAttempts": 0,
    "healthy": true
  }
}
```

#### `POST /api/dashboards`
**Request:**
```json
{
  "config": {
    "id": "new-dashboard",
    "name": "New Dashboard",
    "command": "npm start",
    "cwd": "/path/to/dashboard",
    "port_range": [4000, 4100]
  }
}
```
**Response:** 201 Created (same as GET /:id)

#### `DELETE /api/dashboards/:id`
**Response:** 204 No Content

#### `GET /api/dashboards/:id/metrics`
**Response:**
```json
{
  "uptime_ms": 300000,
  "restarts": 2,
  "memory_mb": 256,
  "cpu_percent": 12.5,
  "last_health_check": "2026-01-31T10:05:00Z"
}
```

#### `GET /api/dashboards/:id/logs`
**Response:** Server-Sent Events (SSE)
```
event: log
data: {"timestamp": "2026-01-31T10:00:01Z", "level": "info", "message": "Server started"}

event: log
data: {"timestamp": "2026-01-31T10:00:02Z", "level": "error", "message": "Connection failed"}
```

### WebSocket Events

#### Server → Client

**`dashboard:status`**
```json
{
  "dashboardId": "grafana",
  "status": "online",
  "port": 3000,
  "pid": 12345
}
```

**`dashboard:log-line`**
```json
{
  "dashboardId": "grafana",
  "timestamp": "2026-01-31T10:00:01Z",
  "stream": "stdout",
  "line": "Server listening on port 3000"
}
```

**`dashboard:health-failed`**
```json
{
  "dashboardId": "grafana",
  "reason": "HTTP 503 Service Unavailable",
  "timestamp": "2026-01-31T10:05:00Z"
}
```

**`dashboard:port-changed`**
```json
{
  "dashboardId": "grafana",
  "oldPort": 3000,
  "newPort": 3001,
  "reason": "port_conflict"
}
```

#### Client → Server

**`dashboard:subscribe`**
```json
{
  "dashboardId": "grafana"
}
```

**`dashboard:unsubscribe`**
```json
{
  "dashboardId": "grafana"
}
```

---

## Implementation Plan

### Phase 5.1: Standalone Server MVP

**Tasks:**
1. Create `packages/dashboard-web-server/` package
2. Implement REST routes using Hono (extend `@agentping/http-api` patterns)
3. Add WebSocket handler with Socket.io
4. Wire DashboardRunner events → WebSocket broadcasts
5. Build CLI entry point (`dashboard-web-server --config path/to/dashboards.yaml`)
6. Add basic HTML landing page (dashboard list)

**Dependencies:**
- `@agentping/http-api` (Hono framework)
- `@lev-os/dashboard-runner` (core runtime)
- `socket.io` (WebSocket)
- `zod` (validation)

### Phase 5.2: Electron Integration

**Tasks:**
1. Add HTTP server to `packages/studio/src/main/web-server.ts`
2. Register `dashboard://` protocol in Electron main process
3. Create IPC bridge: `ipcMain` ↔ REST API
4. Serve static React UI from `packages/adapters/web-ui/dist/`
5. Add "Dashboard Manager" tab to Studio sidebar

**Files to modify:**
- `packages/studio/src/main/index.ts` - Initialize web server
- `packages/studio/src/main/dashboard-manager.ts` - Add HTTP server instance
- `packages/studio/src/renderer/App.tsx` - Add dashboard UI route

### Phase 5.3: React UI Components

**Components to build:**
1. `DashboardList` - Table of all dashboards
2. `DashboardCard` - Single dashboard status widget
3. `LogViewer` - Streaming log display (SSE or WebSocket)
4. `DashboardForm` - Create/edit dashboard config
5. `MetricsChart` - CPU/memory graphs (optional)

**Libraries:**
- React 18 (already in `@agentping/web-ui`)
- TanStack Query (data fetching)
- Recharts (metrics visualization)

---

## Testing Strategy

### Unit Tests
- Route handlers: Mock `DashboardRunner` instance
- WebSocket: Mock Socket.io client
- CLI: Mock file system and runner

### Integration Tests
- Standalone server: Start real HTTP server + runner
- API contracts: Validate request/response schemas
- WebSocket flow: Connect client, verify events

### E2E Tests (Electron)
- Playwright: Launch Electron, navigate to dashboard UI
- Verify IPC bridge works
- Test dashboard create/delete flows

---

## Security Considerations

1. **Input Validation**
   - Zod schemas for all API requests
   - Path traversal prevention in `cwd` field
   - Command injection protection (validate against registry)

2. **Process Isolation**
   - Dashboards run as separate child processes
   - No shell expansion in commands (use `spawn` not `exec`)
   - Resource limits via `ulimit` (future)

3. **Network Exposure**
   - Default bind: `127.0.0.1` (localhost only)
   - Optional `--host 0.0.0.0` flag with WARNING
   - HTTPS support via reverse proxy (not built-in)

4. **Logging Security**
   - Sanitize log output (strip secrets from env vars)
   - Rotate logs to prevent disk exhaustion
   - Redact sensitive config fields in API responses

---

## Deployment Scenarios

### Scenario 1: Local Development
```bash
# Terminal 1: Start dashboards
dashboard-web-server --config ~/dashboards.yaml

# Terminal 2: Open browser
open http://localhost:8080
```

### Scenario 2: AgentPing Studio (Production)
```bash
# Launch Studio - web server starts automatically
pnpm start
# Navigate to "Dashboards" tab in sidebar
```

### Scenario 3: Remote Monitoring
```bash
# Server
dashboard-web-server --config prod.yaml --host 0.0.0.0 --api-key secret123

# Client
curl -H "Authorization: Bearer secret123" http://server:8080/api/dashboards
```

---

## Migration Path from Existing Electron-Only

**Current state:**
- `DashboardManager` in main process forwards events to renderer via IPC
- No HTTP API, no remote access

**After Phase 5:**
- `DashboardManager` starts HTTP server internally
- Renderer uses REST API instead of direct IPC
- IPC becomes thin proxy to HTTP endpoints
- Enables future web-only deployment (no Electron required)

**Backward compatibility:**
- Keep existing IPC handlers (deprecated)
- Add deprecation warnings
- Remove in v3.0.0

---

## Performance Considerations

1. **Log streaming**: Use ring buffer (max 1000 lines) to prevent memory leaks
2. **WebSocket scaling**: Limit 100 concurrent connections per dashboard
3. **Health checks**: Debounce HTTP requests (max 1/second)
4. **State persistence**: Write state.json only on changes, not every event

---

## Open Questions (to resolve in implementation)

1. Should metrics collection be always-on or opt-in? (Recommend: opt-in)
2. Log retention policy: Time-based (7 days) or size-based (100MB)? (Recommend: both)
3. Support multiple runners on same host? (Recommend: yes, different state dirs)
4. Allow runtime config reload (SIGHUP)? (Recommend: yes for standalone, no for Electron)

---

## Success Criteria

- [ ] Standalone server runs dashboards from YAML config
- [ ] REST API supports full CRUD operations
- [ ] WebSocket streams real-time status and logs
- [ ] Electron Studio integrates dashboard UI tab
- [ ] Published as `@lev-os/dashboard-web-server` on npm
- [ ] Documentation includes API reference and examples
- [ ] 80%+ test coverage for routes and WebSocket handlers

---

## References

- [DashboardRunner API](../packages/dashboard-runner/src/runner.ts)
- [Hono Web Framework](https://hono.dev)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [AgentPing Hexagonal Architecture](./ARCHITECTURE.md)
- [Electron IPC Guide](https://www.electronjs.org/docs/latest/tutorial/ipc)

---

**Author:** web-planner
**Created:** 2026-01-31
**Status:** Planning Phase
