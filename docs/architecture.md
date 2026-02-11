# Architecture

> Detailed technical architecture of AgentPing v2

## Overview

AgentPing uses **Hexagonal Architecture** (Ports & Adapters) to keep the core domain logic completely decoupled from external concerns like HTTP frameworks, databases, and UI libraries.

### Single-File Handoff Entry

Use this file as the implementation handoff source:

- `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/architecture.md`

If any other doc conflicts with this file, this file wins.

### Doc Map (What Says What)

| File | Role | Trust Level |
|---|---|---|
| `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/architecture.md` | Product definition, current vs ideal architecture, execution order, decomposition rules | Canonical |
| `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/web-ui-architecture.md` | UI-surface and package responsibility details for consolidation | High (subordinate to canonical) |
| `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/component-catalog.md` | Component inventory, overlap evidence, neutralization checks | High (inventory source) |
| `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/getting-started.md` | Runtime startup and verification commands | Operational |
| `/Users/jean-patricksmith/digital/leviathan/community/agentping/docs/genui/readme.md` | GenUI research index and design inputs | Input only (not runtime truth) |

### Product Definition

AgentPing is an AI-native interaction protocol where:

- agents emit structured intent
- renderers produce rich action surfaces
- humans return structured actions back to agents

The product is not "a single dashboard app." It is a protocol + primitive system that can be adapted into many surfaces (web, desktop, extension, mobile, chat).

### North-Star Use Case

Any app should be able to install AgentPing and quickly ship an adapter that renders AgentPing primitives in its native UI framework (for example SwiftUI on iOS), with strict typed action callbacks back into agent workflows.

### Dev Handoff Goals (Current Priority)

This is the current execution contract for implementation handoff:

1. Sofia component library must be domain-neutral.
- Remove aviation-specific naming and semantics from shared primitives.
- Example: `pilot-picker` must become a generic selector primitive (for example `entity-picker` or `actor-picker`) with domain data supplied via props.

2. Single component library.
- `packages/ui` is the only canonical reusable component source.
- Other packages may consume or temporarily wrap, but must not become alternate sources of truth.

3. GenUI architecture alignment.
- Implement toward target architecture (single canvas, single control plane, adapter portability), while documenting any temporary current-state deviations explicitly.

Definition of done for this handoff:

- domain-specific primitive names removed or aliased behind generic names in `packages/ui`
- all shared imports in Studio/web-ui/canvas resolve to `packages/ui` for canonical primitives
- architecture docs and runtime behavior agree on current state and target state without contradiction

### Ordered Execution Plan (Do In This Order)

1. Baseline and runtime sanity.
- Kill stale surfaces and start runner-managed stack.
- Confirm `agentping` + `sofia` storybooks and core surfaces are online.

2. Canonical source lock.
- Treat `packages/ui` as the only shared primitive source.
- Freeze new primitive creation outside `packages/ui`.

3. Domain-neutralization pass.
- Remove/rename domain-bound primitive names in `packages/ui`.
- Replace domain semantics with generic prop-driven semantics.

4. Import-path convergence.
- Update Studio/web-ui/canvas shared primitive imports to resolve via `packages/ui`.
- Keep wrappers only as temporary aliases.

5. Canvas convergence.
- Collapse duplicate render/hook logic toward `packages/canvas`.
- Keep canonical payload contract strict.

6. Control-plane convergence.
- Remove embedded Studio orchestration path after runner/server parity checks pass.
- Preserve a short transition alias only if required.

7. Adapter portability preparation.
- Publish adapter starter contract docs and minimum interfaces.
- Validate extension/mobile/Swift adapter feasibility against real core ports.

8. Verification and closeout.
- Re-run component inventory checks, runtime checks, and fail-fast theme checks.
- Update BD tasks with evidence and close only on verified criteria.

### Package Layout Snapshot (Current vs Target Ownership)

| Package | Current | Target |
|---|---|---|
| `packages/ui` | Imported Sofia kit + partial canonical usage | Single canonical shared component library |
| `packages/adapters/web-ui` | Adapter + gallery ownership + some duplicate component ownership | Adapter shell consuming `packages/ui` only |
| `packages/canvas` | Canonical direction but duplicate logic exists elsewhere | Single canvas runtime with modes |
| `packages/studio` | Desktop shell plus embedded orchestration path still present | Desktop shell as dashboard API client only |
| `packages/dashboard-runner` | External process manager | Single dashboard lifecycle authority |
| `packages/dashboard-manager-server` | External dashboard API | Single control-plane API |
| `packages/dashboard-manager-ui` | Operator UI | Operator UI (unchanged scope) |

### Task Decomposition Standard (Large Focus)

Decompose work as:

- Epic: business outcome (for example: "Single Component Library Cutover")
- Track: one technical stream per owning package
- Task: one atomic behavior change with evidenceable completion

Task size constraints:

- 1 task = 1 behavior delta
- expected implementation window <= 0.5 day
- single primary owner package
- explicit verification command list

Definition of Ready for each task:

- entry point path(s) identified
- dependency tasks identified
- acceptance checks defined
- rollback notes captured

Definition of Done for each task:

- code landed
- verification commands passed
- docs updated if contract changed
- BD status updated with evidence references

Recommended task template:

1. Context and objective
2. Files/packages touched
3. Change list (atomic bullets)
4. Verification commands
5. Risks and rollback
6. Evidence links (commit/test output/screenshot)

### Situation Report (2026-02-11)

This section documents **actual current state** and **target state** for dashboard/canvas/UI consolidation.

#### Current Runtime Topology

Runtime surfaces are declared in `packages/dashboard-runner/config/dashboards.yaml` and currently include:

- `agentping` (Studio Storybook)
- `sofia` (local `packages/ui` Storybook)
- `web-ui`
- `canvas`
- `dashboard-manager-ui`
- `studio`

Runtime stack components:

- `@lev-os/dashboard-runner`: process lifecycle, port allocation, health, restart policy
- `@lev-os/dashboard-manager-server`: REST/WebSocket API (`/api/dashboards`)
- Studio renderer navigator: consumes dashboard-manager API

Important current-state caveat:

- Studio also starts an embedded dashboard manager + embedded API server in Electron main process.
- This means two valid control-plane entrypoints exist in practice: external runner/server via root scripts, and embedded runner/server via Studio startup.

#### Why `@agentping/web-ui` Is Driving the Gallery Today

`@agentping/web-ui` is currently a hybrid package:

- adapter runtime for pings
- gallery host (`AppView` includes `gallery`)
- canvas preview host (`AppView` includes `studio`)

`PrimitivesGallery` and the Sofia gallery section still live under `packages/adapters/web-ui/src/components`, so adapter code owns UI-catalog behavior instead of a dedicated first-class UI kit package.

#### Current Architecture Gaps

- Multiple canvas implementations/surfaces exist at once:
  - `packages/canvas` app
  - web-ui "studio" view canvas renderer
  - Studio design canvas (`CanvasWorkspace`)

- Canvas render contract is Sofia-first and strict at core schema level, but renderer/hook code is duplicated between packages.

- Theme contract is mostly fail-fast (`agentping | skynet | syslog`, `dark | light`) in Studio/web-ui, but legacy polymorph theme variants still exist in web-ui (`terminal-swiss`, `system`) with fallback behavior.

- `packages/ui` (Sofia import) now exists locally, but is not yet the sole source for all shared components consumed by Studio/web-ui/canvas.

#### Consolidation Tracking Snapshot (BD)

AgentPing BD (`community/agentping/.beads/issues.jsonl`):

- `ap-n2l` Dashboard Audit & Consolidation: `open`
- `ap-n2l.1` AgentPing Studio audit: `in_progress`
- `ap-n2l.2` Sofia UI audit: `in_progress`
- `ap-n2l.3` Clawd Dashboard audit: `in_progress`
- Component coverage tasks are partially created (`ap-n2l.7`, `.8`, `.9`, `.10`, plus section QA tasks) and still `open`

Lev BD (`~/digital/leviathan/.beads/issues.jsonl`):

- `lev-my90` Dashboard Component Migration to AgentPing: `open`
- `lev-my90.1` Clawd audit: `open`
- `lev-my90.2` CEO stack audit: `open`
- `lev-my90.3` Jarvis audit: `open`
- `lev-my90.4` Kingly agency dashboard visualization: `open`

Interpretation:

- Tracking exists in both repos, but coverage is not yet at strict one-task-per-component across all dashboard sources.
- Active consolidation should be driven from AgentPing package ownership first, with Lev BD used as cross-repo coordination.

#### Ideal Future State (Production Target)

1. One UI kit package.
`packages/ui` is the only reusable component library, and adapter-owned component trees are not the source of record.

2. One canvas implementation with modes.
Modes are `render`, `inspect`, `compose`; Studio and web-ui consume the same canvas package APIs.

3. One dashboard control plane.
Dashboard lifecycle is managed only through runner + manager server; Studio is a client of the dashboard API, not a second orchestrator.

4. Strict fail-fast theming everywhere.
Allowed themes are `agentping`, `skynet`, `syslog`; allowed modes are `light`, `dark`; invalid theme/mode must hard fail (no fallback resolution).

5. Showcase model.
Storybook #1 is the unified component kit (`packages/ui`) with full inventory; Storybook #2 is Studio shell/components only; runtime gallery surfaces render from shared UI-kit exports, not duplicated adapter copies.

6. Open-source adapter portability.
AgentPing ships stable primitive and action contracts so external developers can build new adapters (browser extension, iOS/Swift, Telegram, desktop shells) without forking core behavior.

#### GenUI Alignment Notes

- `docs/genui/` contains research and implementation direction promoted from the Thesys/C1 sprint.
- Treat those docs as design/implementation inputs, not runtime truth.
- Runtime truth for theme and payload contracts is this document plus `docs/web-ui-architecture.md`.
- Candidate multi-theme sets are allowed only through explicit registration; unknown theme selection must fail fast.

#### Current State Scorecard

| Area | Status | Notes |
|---|---|---|
| Core protocol architecture | Good | Hexagonal core + adapter boundaries exist |
| Dashboard control plane | Partial | External runner exists, but Studio embedded orchestration still present |
| Shared UI kit ownership | Partial | `packages/ui` exists but adapter-local component ownership still large |
| Canvas unification | Partial | Canonical payload exists, but duplicate renderer/hook paths remain |
| Theme strictness | Partial | Studio/web-ui mostly fail-fast; legacy polymorph variants still exist |
| Adapter portability docs | Partial | Direction exists; needs explicit adapter contract + package surfaces |

### Package Migration Map

| Package | Keep | Move In | Move Out | Remove/Deprecate | Temporary Compatibility |
|---|---|---|---|---|---|
| `packages/ui` | Canonical shared component kit | Sofia primitives, merged AgentPing primitives, tokens/themes | none (becomes source) | n/a | Keep old import aliases for one cutover window |
| `packages/adapters/web-ui` | Adapter shell for queue/history/review flows | UI-kit consumption (`@kingly/ui` or renamed internal package) | `components/sofia`, gallery ownership, duplicated canvas renderer/hook | adapter-local component ownership | Temporary wrapper exports that re-export from `packages/ui` |
| `packages/canvas` | Canonical canvas app + mode system | shared renderer contracts and mode controllers | none | duplicate render logic outside package | Accept canonical payload only; reject legacy shapes |
| `packages/studio` | Desktop shell + orchestration UX | dashboard API client, shared UI-kit usage, canvas mode integrations | embedded dashboard-runner bootstrapping | local runner startup path in Electron main | Keep `/navigator` route alias to `/dashboards` during transition |
| `packages/dashboard-runner` | process manager | none | none | none | n/a |
| `packages/dashboard-manager-server` | single dashboard API | none | none | none | n/a |
| `packages/dashboard-manager-ui` | ops/admin UI for dashboard runtime | none | none | none | n/a |

### Hard Cutover Rules

1. Do not allow package-local component forks once a component exists in `packages/ui`.
2. Do not allow runtime theme fallback to unregistered names.
3. Do not allow multiple dashboard orchestration entrypoints in steady state.
4. Do not allow non-canonical canvas payload contracts in production mode.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            OUTPUT ADAPTERS                                  │
│                     (where humans see & respond)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│   Web UI        Slack App      Discord Bot      VS Code      Webhook        │
└───────────────────────────────────▲─────────────────────────────────────────┘
                                    │
                                    │ Output Port: INotificationChannel
                                    │
┌───────────────────────┐     ┌─────┴──────────────────┐     ┌────────────────┐
│    INPUT ADAPTERS     │     │                        │     │    PARSERS     │
│                       │     │     CORE DOMAIN        │     │                │
│  • CLI Tool           │────▶│                        │────▶│ • StepApproval │
│  • HTTP API           │     │  • PingService         │     │ • Research     │
│  • MCP Server         │     │  • Domain Models       │     │ • Selection    │
│  • WebSocket          │◀────│  • Event Bus           │◀────│ • CodeReview   │
│                       │     │                        │     │                │
└───────────────────────┘     └──────────┬─────────────┘     └────────────────┘
                                         │
                                         │ Storage Port: IPingStore
                                         │
                              ┌──────────▼─────────────┐
                              │    STORAGE ADAPTERS    │
                              │                        │
                              │  • SQLite (sql.js)     │
                              │  • PostgreSQL (todo)   │
                              │  • In-Memory (testing) │
                              └────────────────────────┘
```

## Core Domain

The core domain (`@agentping/core`) has **zero external dependencies**. It defines:

### Domain Models

| Model | Purpose |
|-------|---------|
| `Ping` | The fundamental unit of agent-human communication |
| `HumanResponse` | Structured response with enrichments |
| `ParsedInteraction` | UI hints produced by parsers |
| `Directive` | Quick actions ("focus on...", "skip...") |

### Ports (Interfaces)

| Port | Direction | Purpose |
|------|-----------|---------|
| `IPingSubmitter` | Input | How pings enter the system |
| `INotificationChannel` | Output | How humans get notified |
| `IPingStore` | Storage | Persistence abstraction |
| `IInteractionParser` | Parser | Turn payloads → UI hints |
| `IEventBus` | Events | Internal communication |

### Adapter Portability Contract

Every new surface adapter should implement this minimal contract:

1. Input:
- accept typed `Ping` payloads from transport (`MCP`, `HTTP`, `WS`, future `SSE`)
- preserve canonical payload fields without silent fallback remapping

2. Render:
- map `ParsedInteraction` and primitive specs to native UI
- enforce fail-fast theme/mode validation from runtime config

3. Action output:
- emit structured `HumanResponse` actions
- round-trip response metadata (channel, actor, timestamp, directives)

4. Transport independence:
- adapter code must not require direct dependencies on sibling adapters
- all integration flows through core ports/interfaces

This is the base for browser extension and iOS/Swift adapters.

### Services

| Service | Responsibility |
|---------|----------------|
| `PingService` | Orchestrates ping lifecycle |
| `ResponseRouter` | Routes responses to agents |

## Data Flow

### 1. Creating a Ping

```
Agent (CLI/MCP/HTTP)
    │
    ▼
Input Adapter → validates & transforms
    │
    ▼
PingService.submitPing()
    │
    ├─▶ Parser transforms payload → ParsedInteraction
    │
    ├─▶ Store.save() → persists to database
    │
    ├─▶ EventBus.emit('ping:created')
    │
    └─▶ NotificationChannels.notify() → Web UI, Slack, etc.
```

### 2. Responding to a Ping

```
Human (Web UI / Slack / CLI)
    │
    ▼
Output Adapter → validates response
    │
    ▼
PingService.respond()
    │
    ├─▶ Store.update() → updates status to 'responded'
    │
    ├─▶ EventBus.emit('ping:responded')
    │
    └─▶ Long-poll waiters receive response
            │
            ▼
        Agent receives structured response
```

## Ping Lifecycle

```
┌──────────┐      ┌───────────┐      ┌───────────┐
│ PENDING  │─────▶│ RESPONDED │      │  EXPIRED  │
└──────────┘      └───────────┘      └───────────┘
     │                                     ▲
     │            ┌───────────┐            │
     └───────────▶│ DISMISSED │────────────┘
                  └───────────┘
```

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting human response |
| `responded` | Human provided response |
| `expired` | Timeout reached with no response |
| `dismissed` | Manually dismissed without action |

## Package Dependencies

```
@agentping/studio (desktop shell)
    │
    ├── @lev-os/dashboard-runner (process control)
    │
    ├── @lev-os/dashboard-manager-server (dashboard API)
    │
    └── @kingly/ui (target shared kit; currently partial adoption)
            │
            ├── studio renderer
            ├── web-ui adapter
            └── canvas

@agentping/daemon (entry point for protocol runtime)
    │
    ├── @agentping/core (domain logic)
    │       │
    │       └── zero external dependencies
    │
    ├── @agentping/http-api (REST/WS adapter)
    │       │
    │       └── hono, @agentping/core
    │
    ├── @agentping/storage-sqlite (persistence)
    │       │
    │       └── sql.js, @agentping/core
    │
    └── @agentping/web-ui (React adapter shell)
            │
            └── react, vite, @agentping/core
```

## Design Decisions

### Why Hexagonal Architecture?

1. **Testability**: Core logic can be tested without HTTP/database
2. **Flexibility**: Swap adapters without changing business logic
3. **Clarity**: Clear boundaries between layers

### Why sql.js over native SQLite?

1. **No native bindings**: Works everywhere without compilation
2. **Portable**: Same code runs in Node, Bun, Edge
3. **Simple deployment**: Single JavaScript bundle

### Why Hono for HTTP?

1. **Lightweight**: Minimal dependencies
2. **Universal**: Runs on Node, Bun, Deno, Cloudflare Workers
3. **Type-safe**: First-class TypeScript support

---

<p align="center">
  Built by <a href="https://github.com/Kingly-Agency">Kingly Agency</a>
</p>
