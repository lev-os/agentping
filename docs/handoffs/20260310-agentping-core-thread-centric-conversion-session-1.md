---
status: active
workstream: agentping
component: core
slug: thread-centric-conversion
session: 1
created_at: 2026-03-10
predecessor: null
confidence: 0.75
decisions_start: D1
---

# AgentPing Core — Thread-Centric Conversion

## You Are Here

**Date:** 2026-03-10
**Session:** 1 of N
**Status:** Step 1 complete — Thread domain model spec written. Step 2 pending spec approval.

The current `@agentping/core` domain model has `Ping` as the only tracked entity. A `Ping` carries `sessionId` as a string reference to the originating agent session, but there is no first-class **Thread** entity. This is a problem: pings are returned as flat lists, conversation context is lost, multi-turn agent interactions have no home, and Studio's session state ends up fragmented across three places (`App.tsx`, `ChatPanel.tsx`, `AgentCoordinator.ts`).

This workstream converts the core to be **thread-centric**: `Thread` becomes a first-class domain entity that owns an ordered sequence of `Ping` objects, with its own lifecycle, metadata, and participant model. Adapters, stores, and events get updated to match.

---

## Next Agent Brief

| Field | Value |
|-------|-------|
| **Long-Term Goal** | `@agentping/core` is thread-centric: Thread is a first-class domain entity; Ping belongs to a Thread; store, events, parsers, and all adapters treat Thread as the canonical grouping unit. |
| **Done Condition** | `Thread` type exported from `@agentping/core`; `IPingStore` extended with thread CRUD; `PingService` creates/retrieves/closes threads; all existing unit tests pass; HTTP API surfaces thread endpoints; Studio and web-ui display pings grouped by thread with no regressions. |
| **Current Execution Slice** | Step 2: Create `packages/core/src/domain/thread.ts`, `packages/core/src/ports/thread-store.ts`; modify `ping.ts`, `store.ts`, `event-bus.ts`; update export barrels. **Blocked on spec approval.** |
| **Why This Slice Now** | Step 1 (Thread domain model spec) is complete. Step 2 is the code scaffold that makes the spec real — types, port interface, and event extensions. Step 3 (PingService) and Step 4 (SQLite) cannot start until Step 2 types exist. |
| **Out of Scope This Session** | HTTP API changes, UI rendering changes, migration of existing pings/sessions, voice/genui flows, theme migration work (tracked separately under `ap-4rs`). |

---

## Roadmap To Goal

**Goal:** Thread is a first-class domain entity in `@agentping/core` — pings belong to threads, not just sessions.
**Done Condition:** All adapters, store, events, and HTTP API treat Thread as the organizing unit; Studio groups pings by thread; all existing tests pass with no regressions.
**Remaining Steps:** 7

### Step 1: Design and spec the Thread domain model
- Define `Thread` interface (id, agentId, agentName, sessionId, status, title?, metadata, pings[], createdAt, closedAt)
- Define `ThreadStatus`: `'open' | 'closed' | 'archived'`
- Define `CreateThreadRequest` (agentId, agentName, sessionId, title?, metadata?)
- Update `Ping`: add `threadId: string`, keep `sessionId` as direct field (threads group pings; session is the agent-side identifier)
- Decide: does `Thread` own pings or is ownership via `Ping.threadId`? (Recommendation: ownership via `Ping.threadId`; Thread is lightweight metadata)
- Draft `IThreadStore` port interface (create, findById, findBySession, findByAgent, update, close, delete)
- Define new event types: `thread:created`, `thread:closed`
- Write spec to `docs/specs/spec-thread-domain-model.md`

#### Step 2: Extend `IPingStore` and add `IThreadStore`
- Add `IThreadStore` to `packages/core/src/ports/thread-store.ts`
- Extend event bus with `ThreadEvents`
- Export from `packages/core/src/ports/index.ts` and root `index.ts`

#### Step 3: Implement thread operations in `PingService`
- Add `createThread()`, `getThread()`, `closeThread()` methods
- Update `submitPing()`: require `threadId` (or auto-create a thread if none supplied)
- Update `getPings()` filters to support `threadId`

#### Step 4: Implement SQLite adapter for threads
- Add `threads` table to `storage-sqlite` migration
- Implement `IThreadStore` in the SQLite adapter
- Add `threadId` column to `pings` table (nullable for migration safety)

#### Step 5: HTTP API thread endpoints
- `POST /api/v1/threads` — create thread
- `GET /api/v1/threads/:id` — get thread + its pings
- `POST /api/v1/threads/:id/close` — close thread
- Update existing ping endpoints to accept/return `threadId`

### Steps 6-7 (Optional)
6. Studio and web-ui: render pings grouped by thread (ChatPanel refactor)
7. Migrate existing pings to default threads; backfill `threadId`

---

## Timeline

### T1 — 2026-03-10 00:00 CST — Session Start / Discovery

- Loaded `packages/core/src/domain/ping.ts` (370 lines): confirmed `Ping` has `sessionId: string` but no `threadId`. Confirmed there is no `Thread` type anywhere in core.
- Loaded `packages/core/src/services/ping-service.ts` (318 lines): `PingService` is already clean after the god-class split. Good inheritance point for thread operations.
- Loaded `packages/core/src/ports/store.ts` (138 lines): `IPingStore` has `findBySession(sessionId)` — natural extension point for thread queries.
- Loaded `packages/core/src/events/event-bus.ts` (105 lines): `PingEvents` + `SessionEvents` + `LeaseEvents` = `AgentPingEvents`. Need to add `ThreadEvents`.
- Read `docs/ARCHITECTURAL_REVIEW.md`: confirmed **4.2 Session State Fragmentation** as a documented known issue — three places track session state in Studio. Thread-centric conversion is the correct structural fix.
- Read `docs/architecture.md`: confirmed north-star is a clean hexagonal core. Thread as a domain entity fits naturally within existing port/adapter model.
- Read `docs/TOP_10_IMPROVEMENTS.md` Item #7: Studio Error Boundary + State — "Session state tracked in 3 places." Thread domain entity + ThreadStore is the foundation that resolves this.

**Evidence:** Domain gap confirmed. No `Thread` type exists. Architecture review independently flagged session fragmentation. Thread-centric conversion is the right structural move.

### T2 — 2026-03-10 — Session 1 Continuation / Step 1 Execution

- Read `packages/core/src/domain/ping.ts` (370 lines): confirmed `Ping.sessionId: string`, no `threadId` field. `CreatePingRequest` also has no `threadId`.
- Read `packages/core/src/ports/store.ts` (138 lines): `IPingStore.findBySession()` confirmed as the extension point. `PingFilters` has `sessionId` but no `threadId`.
- Read `packages/core/src/events/event-bus.ts` (105 lines): `PingEvents`, `SessionEvents`, `LeaseEvents` confirmed. `AgentPingEvents = PingEvents & SessionEvents & LeaseEvents`.
- Wrote `docs/specs/spec-thread-domain-model.md`: full `Thread` type, `ThreadStatus`, `CreateThreadRequest`, `ThreadFilters`, `IThreadStore` port (8 methods), `IPingStore` extension (`findByThread`, `PingFilters.threadId`), `Ping` diff, `ThreadEvents` + `AgentPingEvents` extension, export barrel plan, 10 acceptance criteria, step sequencing.
- All provisional decisions (D1–D3) confirmed as final. D4–D6 resolved from Q1–Q5.

**Evidence:** Spec written. Step 1 complete. Step 2 blocked on spec approval.

---

## Decisions Log

### D1 — Thread Owns Pings via Foreign Key, Not Embedded Array
**Date:** 2026-03-10
**Decision:** `Thread` is lightweight metadata (id, status, agent info, timestamps, title). Pings carry `threadId` as a foreign key. Thread does not embed a `pings[]` array in the core type.
**Rationale:** Embedding creates hydration complexity and breaks the store adapter pattern. Queries like `findByThread(threadId)` via `IPingStore` give adapters full control over join strategy.
**Status:** provisional — confirm before writing the spec
**Superseded by:** —

### D2 — `threadId` is Required on New Pings; Legacy Pings Get a Null Default
**Date:** 2026-03-10
**Decision:** New pings require `threadId`. Existing pings in the SQLite store will have `threadId = NULL` during migration. A default "legacy" thread per session will be auto-created on first encounter during backfill.
**Rationale:** Hard-requiring `threadId` immediately would break all existing adapters. Null default + backfill preserves existing data without a forced migration gate.
**Status:** provisional — confirm before SQLite adapter work
**Superseded by:** —

### D3 — `createThread()` Auto-Creates Thread If None Supplied to `submitPing()`
**Date:** 2026-03-10
**Decision:** `PingService.submitPing()` will accept an optional `threadId`. If omitted, it creates a new single-ping thread implicitly.
**Rationale:** Backward compat. Existing callers (MCP adapter, CLI, ext-apps) don't pass `threadId` yet. They should not break.
**Status:** provisional
**Superseded by:** —

---

## Open Questions

| # | Question | Priority | Status |
|---|----------|----------|--------|
| Q1 | Does `Thread` need a `title` field or is that always derived from the first ping's payload? | Medium | open |
| Q2 | Should `Thread` have `participants[]` (multiple agents per thread) or is one agent per thread sufficient for v1? | High | open — recommend one agent for v1, multiple in v2 |
| Q3 | Does `closeThread()` cascade-dismiss all pending pings in the thread, or leave them pending? | High | open |
| Q4 | Should `IThreadStore` live in `@agentping/core/ports` or be a new top-level port in a separate file? | Low | open — recommend separate file (`ports/thread-store.ts`) |
| Q5 | Does the HTTP API expose thread listing at `/api/v1/threads` or only per-agent/session scoped? | Medium | open |

---

## Entity Matrix

| Entity | Type | State | Location | Notes |
|--------|------|-------|----------|-------|
| `Ping` | Domain model | crystallized | `packages/core/src/domain/ping.ts` | Needs `threadId` field added |
| `Thread` | Domain model | ephemeral → crystallizing | (does not exist yet) | This workstream creates it |
| `IPingStore` | Port | crystallized | `packages/core/src/ports/store.ts` | Needs `findByThread()` method |
| `IThreadStore` | Port | ephemeral | (does not exist yet) | New port for this workstream |
| `PingService` | Service | crystallized | `packages/core/src/services/ping-service.ts` | Add `createThread`, `getThread`, `closeThread` |
| `EventBus` (ThreadEvents) | Event contract | ephemeral | (does not exist yet) | Add `thread:created`, `thread:closed` |
| `AgentPingEvents` | Type | crystallized | `packages/core/src/events/event-bus.ts` | Extend with `ThreadEvents` |

---

## Code Context

### Critical Paths

```text
packages/core/src/
├── domain/
│   ├── ping.ts              # ADD: threadId?: string to Ping; add Thread type here or new file
│   ├── thread.ts            # NEW: Thread interface, ThreadStatus, CreateThreadRequest
│   └── index.ts             # Export thread.ts
├── ports/
│   ├── store.ts             # ADD: findByThread(threadId) to IPingStore
│   ├── thread-store.ts      # NEW: IThreadStore port
│   └── index.ts             # Export thread-store.ts
├── services/
│   ├── ping-service.ts      # ADD: createThread, getThread, closeThread; update submitPing
│   └── index.ts             # (no change needed if PingService already exported)
└── events/
    └── event-bus.ts         # ADD: ThreadEvents; extend AgentPingEvents
```

### Files to Read Before Executing

| File | Why |
|------|-----|
| `packages/core/src/domain/ping.ts` | Understand current Ping shape before adding threadId |
| `packages/core/src/domain/directives.ts` | Pattern reference for how domain types are structured |
| `packages/core/src/services/ping-service.ts` | Where thread methods attach |
| `packages/core/src/ports/store.ts` | `IPingStore` shape before extending |
| `packages/core/src/events/event-bus.ts` | Before adding `ThreadEvents` |
| `packages/core/src/__tests__/` | Understand current test baseline before changing anything |
| `docs/specs/spec-component-migration.md` | Context only — ensure thread work doesn't contradict UI migration |

### Test Baseline

```text
packages/core/src/__tests__/
├── parsers.test.ts      # Tests parser registry
└── ping-service.test.ts # Tests PingService with mocks
```

All existing tests must pass after every change. No regressions allowed.

---

## Meta

```yaml
created_at: 2026-03-10
updated_at: 2026-03-10
session: 1
predecessor: null
successor: null (not yet sharded)
confidence: 0.90
confidence_gaps:
  - none blocking — all open questions resolved in spec
step_status:
  step_1: complete
  step_2: pending_spec_approval
  step_3: not_started
  step_4: not_started
  step_5: not_started
  step_6: not_started
  step_7: not_started
trackers:
  - backend: bd
  - agentping_bd_path: community/agentping/.beads/issues.jsonl
spec_artifacts:
  - docs/specs/spec-thread-domain-model.md
notes: >
  The name "thread-centric conversion" refers specifically to making Thread a first-class
  domain entity in @agentping/core — not a UI thread-rendering concern. It is the structural
  fix for the documented session fragmentation problem (ARCHITECTURAL_REVIEW.md §4.2).
  This work is independent of the ap-4rs component migration epic, which is UI-layer work.
```
