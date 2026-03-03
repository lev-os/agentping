# Top 10 Improvements — AgentPing v2

> Curated from 100 ideas generated across 10 independent deep-dive reviews of the codebase.
> Each improvement is selected for maximum impact-to-effort ratio, covering the most critical gaps.

---

## 1. Consolidate the Two MCP Packages

**Source:** MCP Review | **Impact:** HIGH | **Effort:** Low

**Problem:** Two packages share the name `@agentping/mcp`:
- `packages/adapters/mcp/` (205 lines, uses `@agentping/api-client`)
- `packages/mcp/` (458 lines, uses `@agentping/core` directly, has factory pattern + `tools.ts`)

Both define nearly identical tool sets with slightly different schemas. Changes to tool definitions must be duplicated. The workspace can't publish two packages with the same name.

**Fix:** Deprecate `packages/adapters/mcp/`. Make it a 10-line shim that re-exports from `packages/mcp/`. Keep one canonical tool schema definition in `packages/mcp/src/tools.ts`. Update daemon and studio to import from the canonical location.

---

## 2. Add CI/CD Pipeline with Coverage Gates

**Source:** Testing Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** No `.github/workflows/` directory exists. 11 of 15 packages have zero tests. No automated test runs on PR. No coverage tracking. Tests only run when developers remember to.

**Fix:** Create `.github/workflows/test.yml`:
1. `pnpm install` + `pnpm -r build`
2. `pnpm test` (Vitest across all packages)
3. `pnpm test:e2e` (Playwright for studio + extension)
4. Coverage upload to Codecov with threshold: 60% lines (raises over time)
5. Add status badge to README

This is the single highest-leverage change — it makes every other improvement verifiable.

---

## 3. Enforce Ping Expiration and Add Storage Cleanup

**Source:** Storage Review + Core SDK Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** Pings have an `expiresAt` field that is never checked. `PingService.respond()` accepts responses to expired pings. No background sweep marks expired pings. The SQLite store accumulates stale data indefinitely. The `IPingStore` interface has no `deleteExpired()` method.

**Fix:**
1. Add `deleteExpired(before?: Date): Promise<number>` to `IPingStore`
2. Implement in SQLite adapter: `DELETE FROM pings WHERE expires_at IS NOT NULL AND expires_at < ?`
3. Add expiration check in `PingService.respond()`: reject if `ping.expiresAt < now`
4. Add `PingService.cleanupExpired()` method called on an interval (every 60s)
5. Add composite index: `CREATE INDEX idx_pings_expires_at ON pings(expires_at)`

---

## 4. Add Structured Error Types Across All Packages

**Source:** Security Review + Core SDK Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** All errors are generic `Error` instances. HTTP API returns `{ error, details }` inconsistently. MCP returns `Error: ${message}` strings that LLMs can't parse. CLI calls `process.exit(1)`. The api-client has `AgentPingApiError` but it's the only typed error in the system.

**Fix:** Define in `@agentping/core`:
```typescript
export class AgentPingError extends Error {
  constructor(message: string, public code: string, public retriable: boolean = false) { ... }
}
export class NotFoundError extends AgentPingError { code = 'PING_NOT_FOUND' }
export class StateError extends AgentPingError { code = 'INVALID_STATE' }
export class ValidationError extends AgentPingError { code = 'VALIDATION_ERROR' }
export class TimeoutError extends AgentPingError { code = 'TIMEOUT', retriable = true }
export class ChannelError extends AgentPingError { code = 'CHANNEL_FAILURE' }
```
Use these in PingService, HTTP API error responses, and MCP tool error messages. The `retriable` flag lets agents decide whether to retry automatically.

---

## 5. Add Turbo Build Caching

**Source:** DX Review | **Impact:** HIGH | **Effort:** Low

**Problem:** No `turbo.json` exists. With 20+ packages, `pnpm -r build` rebuilds everything from scratch every time. Developers and CI waste minutes on unchanged packages.

**Fix:** Create `turbo.json`:
```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"], "outputs": [] },
    "dev": { "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^build"], "outputs": [] }
  }
}
```
Update `package.json` scripts to use `turbo run build/test/typecheck`. Add `.turbo/` to `.gitignore`. Enable remote caching for CI.

---

## 6. Implement Rate Limiting and CORS Lockdown on HTTP API

**Source:** Security Review | **Impact:** HIGH | **Effort:** Low

**Problem:** CORS defaults to `['*']` (any origin). No rate limiting exists. An attacker can spam `POST /api/v1/pings` or send `?timeout=999999999` to exhaust server resources. CDP commands have no method whitelist — `Runtime.evaluate` could execute arbitrary JS.

**Fix:**
1. Default CORS to `[]` (disabled) instead of `['*']`. Require explicit config.
2. Add rate limiting middleware: 100 requests/min per agent, 10 CDP commands/min.
3. Cap timeout parameter: `Math.min(parseInt(timeout, 10), 300)` (5 min max).
4. Add CDP method whitelist: `['Page.navigate', 'DOM.getDocument', ...]`. Block `Runtime.evaluate`.

---

## 7. Add React Error Boundary and State Management in Studio

**Source:** Studio Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** No React Error Boundary exists — any component crash kills the window. `App.tsx` has 23 `useState` calls and 13 `useEffect` hooks managing layout, sessions, canvas, shortcuts, daemon state, and IPC. Session state is tracked in 3 places (App.tsx, ChatPanel.tsx, AgentCoordinator.ts). `ClaudeCodeBridge.ts` has no approval queue bounds (unbounded memory growth).

**Fix:**
1. Add `<ErrorBoundary>` wrapping each layout zone (sidebar, canvas, chat, footer) with "Reset" fallback UI.
2. Extract state into Zustand store with slices: `useLayoutStore`, `useSessionStore`, `useCanvasStore`.
3. Add `MAX_QUEUE_SIZE = 100` to approval queue with 5-minute TTL auto-expiry.
4. Add message queue to `ClaudeCodeBridge.execute()` to prevent race conditions from rapid `send()` calls.

---

## 8. Add Unit Tests for Storage Adapter and Core Services

**Source:** Testing Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** SQLite adapter (data persistence) has zero tests. Core collaborator services (`WaiterPool`, `AuditLogger`, `ChannelManager`, `ParserRegistry`) have zero tests. Webhook adapter (retry + HMAC signing) has zero tests. These are the most critical untested paths.

**Fix:** Create test suites for the 3 highest-risk untested areas:
1. **`storage-sqlite/__tests__/`**: save/retrieve/update/delete pings, findPending filters, audit log append/query, schema initialization, directive CRUD
2. **`core/__tests__/waiter-pool.test.ts`**: concurrent waiters, timeout expiry, memory cleanup
3. **`webhook/__tests__/webhook.test.ts`**: delivery, retry logic, HMAC signing, event filtering

Create shared test fixtures: `createMockPingService()`, `createInMemoryStore()`, `createTestEventBus()`.

---

## 9. Eliminate Component Re-export Indirection in web-ui

**Source:** UI Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** 280+ component files in `web-ui/src/components/` are empty 3-line re-exports from `@kingly/ui`. Example: `export { PingCard } from '@kingly/ui'`. The component registry imports all 150+ components upfront — no lazy loading. This creates maintenance confusion, unnecessary bundling overhead, and slow initial load.

**Fix:**
1. Delete all pure re-export files. Create a single `ui-imports.ts` barrel.
2. Implement lazy loading by category: `const InteractionComponents = React.lazy(() => import('./components/interaction-batch'))`.
3. Split component registry into batches loaded on demand (interaction, primitives, system, finance).
4. Document the local-vs-centralized component split.

---

## 10. Implement Zombie Process Cleanup and Health Check Hysteresis in Dashboard Runner

**Source:** Dashboard Review | **Impact:** HIGH | **Effort:** Medium

**Problem:** If the dashboard runner crashes, orphaned child processes remain running, consuming resources and blocking ports. A single failed HTTP health check triggers an immediate restart — transient network glitches cause restart thrashing. Process exit code 0 (success) triggers the same restart logic as code 1 (error).

**Fix:**
1. On startup, read PIDs from `state.json`, verify each with `process.kill(pid, 0)`, kill orphans.
2. Add hysteresis: only restart after 3 consecutive failed health checks (configurable `minFailuresBeforeRestart`).
3. Classify exit codes: code 0 = success (don't restart), code 127 = dependency missing (don't restart), SIGKILL = force killed (restart with backoff).

---

## Priority Matrix

| # | Improvement | Impact | Effort | Prerequisite |
|---|-------------|--------|--------|--------------|
| 2 | CI/CD Pipeline | HIGH | Medium | None |
| 5 | Turbo Build Cache | HIGH | Low | None |
| 6 | Rate Limit + CORS | HIGH | Low | None |
| 1 | Consolidate MCP | HIGH | Low | None |
| 4 | Structured Errors | HIGH | Medium | None |
| 3 | Ping Expiration | HIGH | Medium | #4 (error types) |
| 8 | Unit Tests (storage, core, webhook) | HIGH | Medium | #2 (CI to run them) |
| 7 | Studio Error Boundary + State | HIGH | Medium | None |
| 9 | Web-UI Component Cleanup | HIGH | Medium | None |
| 10 | Dashboard Process Safety | HIGH | Medium | None |

**Recommended execution order:** 5 → 2 → 6 → 1 → 4 → 3 → 8 → 7 → 9 → 10

Start with the low-effort, high-impact items (Turbo, CI, CORS, MCP consolidation) to build momentum, then tackle the medium-effort structural improvements.
